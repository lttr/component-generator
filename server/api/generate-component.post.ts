import Anthropic from "@anthropic-ai/sdk"

export default defineEventHandler(async (event) => {
  try {
    const { description } = await readBody(event)

    if (!description) {
      throw createError({
        statusCode: 400,
        statusMessage: "Description is required",
      })
    }

    const runtimeConfig = useRuntimeConfig()
    const apiKey = runtimeConfig.anthropicApiKey

    if (!apiKey) {
      throw createError({
        statusCode: 500,
        statusMessage: "API key not configured",
      })
    }

    const anthropic = new Anthropic({
      apiKey: apiKey,
    })

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      messages: [
        {
          role: "user",
          content: `Generate HTML content for a component based on this description: "${description}"

Requirements:
- Generate ONLY semantic HTML with Tailwind CSS utility classes
- Use Tailwind CSS v4 syntax and classes for ALL styling
- Make it responsive and modern-looking using Tailwind classes
- Use proper HTML structure and accessibility attributes
- NO JavaScript, NO custom elements, NO Shadow DOM - just plain HTML with Tailwind classes
- NO inline SVG elements - use text, emojis, or CSS-based graphics instead
- The HTML should be ready to be inserted into a web component programmatically

Return only the HTML content with Tailwind classes. No explanations, no markdown formatting, no triple backticks, no <script> tags, just the raw HTML with Tailwind classes.`,
        },
      ],
    })

    const firstContent = message.content[0]
    const componentCode = firstContent?.type === "text" ? firstContent.text : ""

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
