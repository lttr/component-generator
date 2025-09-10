export default defineEventHandler(async (event) => {
  try {
    const { description } = await readBody(event)

    if (!description) {
      throw createError({
        statusCode: 400,
        statusMessage: "Description is required",
      })
    }

    const prompt = `Requirements:
- Generate ONLY semantic HTML with CSS styling
- Use CSS custom properties (CSS variables) from Puleo CSS for ALL styling
- NO inline styles - all styling must use CSS classes or style blocks
- Use Puleo CSS variables like: --gray-1 to --gray-12, --space-1 to --space-9, --brand-color, --surface-0 to --surface-4, --text-color-1, --text-color-2, --font-size-body, --font-size-h1 to --font-size-h5, --radius-1 to --radius-round, --shadow-1 to --shadow-6
- Make it responsive and modern-looking using these variables
- Use proper HTML structure and accessibility attributes
- NO JavaScript, NO custom elements, NO Shadow DOM - just plain HTML with CSS
- Include a <style> block with CSS that uses Puleo variables
- The HTML should be ready to be inserted into a web component programmatically

Return only the complete HTML content with CSS styling using Puleo variables. No explanations, no markdown formatting, no triple backticks, just the raw HTML with embedded CSS.`

    const componentCode = await generateComponent(description, prompt)

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
