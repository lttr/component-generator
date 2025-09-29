import { processTailwindHtmlCached } from "../utils/tailwindCompiler"
import { exampleData } from "../utils/exampleData.server"

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

    const prompt = `<objective>
Add Tailwind CSS version ${TAILWIND_VERSION} utility classes to the provided HTML.
</objective>

<requirements>
- Add ONLY Tailwind CSS utility classes to the provided HTML
- DO NOT change the HTML structure, elements, or content - only add class attributes
- Use Tailwind CSS syntax and classes for ALL styling
- Make it responsive and modern-looking using Tailwind classes
- Preserve all existing attributes and accessibility features
- NO JavaScript, NO custom elements, NO Shadow DOM modifications
- NO inline SVG elements - use text, emojis, or CSS-based graphics instead
</requirements>

<example>
Input Description: ${exampleData.description}

Input HTML:
${exampleData.html}

Expected Output:
${exampleData.tailwindCode}
</example>

<input>
HTML: ${html}
Description: ${description}
</input>

<output>
Return only the HTML content with Tailwind classes added. No explanations, no markdown formatting, no triple backticks, no <script> tags, just the raw HTML with Tailwind classes.
</output>`

    const componentCode = await callClaude(prompt)

    // Generate CSS from the HTML with Tailwind classes
    const css = await processTailwindHtmlCached(componentCode)

    return {
      success: true,
      data: {
        component: componentCode,
        css: css,
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
