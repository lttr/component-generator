export default defineEventHandler(async (event) => {
  try {
    const { description, html } = await readBody(event)

    if (!description) {
      throw createError({
        statusCode: 400,
        statusMessage: "Description is required",
      })
    }

    if (!html) {
      throw createError({
        statusCode: 400,
        statusMessage: "HTML is required",
      })
    }

    // Get cached Puleo CSS variables
    const puleoVariables = await getPuleoCssVariables()

    const prompt = `<task>
Add CSS styling to the provided HTML using Puleo CSS framework.
</task>

<requirements>
- DO NOT change the HTML structure, elements, or content - only add CSS styling
- Use CSS custom properties (CSS variables) from Puleo CSS for ALL styling
- Create semantic CSS classes and apply them to HTML elements
- Make it responsive and modern-looking using these variables
- Preserve all existing attributes and accessibility features
- Include a <style> block with CSS that uses Puleo variables with proper fallback values
- NO JavaScript modifications
- NO inline SVG elements - use text, emojis, or CSS-based graphics instead
- DO NOT include CSS framework links - the framework is already loaded
</requirements>

<example>
Input Description: A card component with heading, subheading, text, date and link to read more

Input HTML:
<article href="#">
  <header>
    <h2>Yet another generated component thing</h2>
    <h3>By John Doe</h3>
  </header>

  <p>
    Lorem ipsum dolor sit, amet consectetur adipisicing elit. At velit illum
    provident a, ipsa maiores deleniti consectetur nobis et eaque.
  </p>

  <foter>
    <span>31/06/2025</span>
    <a href="#">Read more</a>
  </foter>
</article>

Expected Output:
<style>
  .card {
    max-width: 40ch;
    border: var(--border-2);
    border-radius: var(--radius-2);
    padding: var(--space-4);
    box-shadow: var(--shadow-3);
  }

  .content {
    margin-top: var(--space-2);
  }

  .subheading {
    font-size: var(--font-size--1);
    color: var(--text-color-2);
  }

  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>

<article href="#" class="card p-stack">
  <header class="content p-flow">
    <h2 class="p-heading-4">Yet another generated component thing</h2>
    <h3 class="subheading">By John Doe</h3>
  </header>

  <p>
    Lorem ipsum dolor sit, amet consectetur adipisicing elit. At velit illum
    provident a, ipsa maiores deleniti consectetur nobis et eaque.
  </p>

  <foter class="footer">
    <span class="">31/06/2025</span>
    <a href="#" class="">Read more</a>
  </foter>
</article>
</example>

<input_html>
${html}
</input_html>

<puleo_variables>
${puleoVariables}
</puleo_variables>

<description>
${description}
</description>

<output_format>
Return only the complete HTML content with CSS classes on elements and embedded CSS styling. No explanations, no markdown formatting, no triple backticks, just the raw HTML with embedded CSS.
</output_format>`

    const componentCode = await callClaude(prompt)

    return {
      success: true,
      data: {
        component: componentCode,
      },
    }
  } catch (error: unknown) {
    console.error("Error generating component:", error)
    throw createError({
      statusCode: 500,
      statusMessage:
        error instanceof Error ? error.message : "Failed to generate component",
    })
  }
})
