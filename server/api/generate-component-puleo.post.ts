import { readFile } from "fs/promises"
import { join } from "path"

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

    // Read example files
    const exampleDescription = await readFile(
      join(process.cwd(), "server/examples/card-prompt.txt"),
      "utf-8",
    )
    const exampleInputHtml = await readFile(
      join(process.cwd(), "server/examples/card.html"),
      "utf-8",
    )
    const exampleOutput = await readFile(
      join(process.cwd(), "server/examples/card-puleo.html"),
      "utf-8",
    )

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
Input Description: ${exampleDescription.trim()}

Input HTML:
${exampleInputHtml.trim()}

Expected Output:
${exampleOutput.trim()}
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
