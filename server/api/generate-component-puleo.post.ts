export default defineEventHandler(async (event) => {
  try {
    const { description, html } = await readBody(event)

    if (!description) {
      throw createError({
        statusCode: 400,
        statusMessage: "Description is required",
      })
    }

    // Get cached Puleo CSS variables
    const puleoVariables = await getPuleoCssVariables()

    let prompt: string

    if (html) {
      // If HTML is provided, add CSS styling without changing structure
      prompt = `Requirements:
- Add CSS styling to the provided HTML using Puleo CSS variables
- DO NOT change the HTML structure, elements, or content - only add CSS styling
- Use CSS custom properties (CSS variables) from Puleo CSS for ALL styling
- NO inline styles - all styling must use CSS classes or style blocks
- Make it responsive and modern-looking using these variables
- Preserve all existing attributes and accessibility features
- Include a <style> block with CSS that uses Puleo variables
- NO JavaScript modifications

Provided HTML:
${html}

Available Puleo CSS Variables:
${puleoVariables}

Component Description: ${description}

Return only the complete HTML content with CSS styling using these Puleo variables. No explanations, no markdown formatting, no triple backticks, just the raw HTML with embedded CSS.`
    } else {
      // Fallback to original behavior if no HTML provided
      prompt = `Requirements:
- Generate ONLY semantic HTML with CSS styling
- Use CSS custom properties (CSS variables) from Puleo CSS for ALL styling
- NO inline styles - all styling must use CSS classes or style blocks
- Make it responsive and modern-looking using these variables
- Use proper HTML structure and accessibility attributes
- NO JavaScript, NO custom elements, NO Shadow DOM - just plain HTML with CSS
- Include a <style> block with CSS that uses Puleo variables
- The HTML should be ready to be inserted into a web component programmatically

Available Puleo CSS Variables:
${puleoVariables}

Component Description: ${description}

Return only the complete HTML content with CSS styling using these Puleo variables. No explanations, no markdown formatting, no triple backticks, just the raw HTML with embedded CSS.`
    }

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
