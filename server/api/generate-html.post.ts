export default defineEventHandler(async (event) => {
  try {
    const { description } = await readBody(event)

    if (!description) {
      throw createError({
        statusCode: 400,
        statusMessage: "Description is required",
      })
    }

    const prompt = `<objective>
Generate semantic HTML without CSS or JavaScript for the provided component description.
</objective>

<requirements>
- Generate ONLY semantic HTML without any CSS or JavaScript
- Focus on semantically correct HTML5 elements and proper structure
- Use appropriate accessibility attributes (ARIA labels, roles, alt text, etc.)
- Create a well-structured document with proper heading hierarchy
- NO styling, NO classes, NO inline styles - just pure semantic HTML
- Use meaningful HTML elements (header, nav, main, section, article, aside, footer, etc.)
- Ensure all interactive elements have proper accessibility attributes
- The HTML should be clean and ready to have CSS styling applied later
</requirements>

<example>
Input Description: ${exampleData.description}

Expected Output:
${exampleData.html}
</example>

<input>
Component Description: ${description}
</input>

<output>
Return only the HTML content. No explanations, no markdown formatting, no triple backticks, just the raw semantic HTML.
</output>`

    const htmlCode = await callClaude(prompt)

    return {
      success: true,
      data: {
        html: htmlCode,
      },
    }
  } catch (error: unknown) {
    console.error("Error generating HTML:", error)
    throw createError({
      statusCode: 500,
      statusMessage:
        error instanceof Error ? error.message : "Failed to generate HTML",
    })
  }
})
