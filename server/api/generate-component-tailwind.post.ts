import { readFileSync } from "fs"

const exampleDescription = readFileSync("examples/card-prompt.txt", "utf-8")
const exampleInputHtml = readFileSync("examples/card.html", "utf-8")
const exampleTailwindOutput = readFileSync(
  "examples/card-tailwind.html",
  "utf-8",
)

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
Add Tailwind CSS v4 utility classes to the provided HTML.
</objective>

<requirements>
- Add ONLY Tailwind CSS v4 utility classes to the provided HTML
- DO NOT change the HTML structure, elements, or content - only add class attributes
- Use Tailwind CSS v4 syntax and classes for ALL styling
- Make it responsive and modern-looking using Tailwind classes
- Preserve all existing attributes and accessibility features
- NO JavaScript, NO custom elements, NO Shadow DOM modifications
- NO inline SVG elements - use text, emojis, or CSS-based graphics instead
</requirements>

<example>
Input Description: ${exampleDescription.trim()}

Input HTML:
${exampleInputHtml.trim()}

Expected Output:
${exampleTailwindOutput.trim()}
</example>

<input>
HTML: ${html}
Description: ${description}
</input>

<output>
Return only the HTML content with Tailwind classes added. No explanations, no markdown formatting, no triple backticks, no <script> tags, just the raw HTML with Tailwind classes.
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
