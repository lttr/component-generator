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
    const puleoSource = await getPuleoFrameworkCode()

    const prompt = `<objective>
Add CSS styling to the provided HTML using Puleo CSS framework.
</objective>

<requirements>
- DO NOT change the HTML structure, elements, or content - only add CSS styling
- PREFER using existing CSS custom properties from Puleo CSS framework whenever possible
- Only create additional CSS custom properties when existing Puleo variables don't cover your needs
- If you create new CSS custom properties, MUST define them at the top of your <style> block
- Use helper classes from Puleo CSS if applicable
- Create semantic CSS classes and apply them to HTML elements
- Make it responsive and modern-looking using these variables
- Preserve all existing attributes and accessibility features
- Include a <style> block with CSS that uses Puleo variables and any custom properties you define
- NO JavaScript modifications
- NO inline SVG elements - use text, emojis, or CSS-based graphics instead
- DO NOT include CSS framework links - the framework is already loaded
- CRITICAL: Any CSS custom properties you use must either exist in the Puleo framework OR be defined by you in the CSS
</requirements>

<example>
Input Description: ${exampleData.description}

Input HTML:
${exampleData.html}

Expected Output:
${exampleData.puleoCode}
</example>

<context>
Whole Puleo CSS framework:
${puleoSource}
</context>

<input>
HTML: ${html}
Description: ${description}
</input>

<output>
Return only the complete HTML content with CSS classes on elements and embedded CSS styling. No explanations, no markdown formatting, no triple backticks, just the raw HTML with embedded CSS.
</output>`

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
