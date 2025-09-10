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
      model: "claude-3-5-sonnet-20250106",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: `Create a Web Component based on this description: "${description}"

Requirements:
- Create a proper Web Component using custom elements and Shadow DOM
- Use semantic HTML elements within the shadow root
- Use Tailwind CSS v4 utility classes for ALL styling (no inline CSS)
- Include Tailwind CSS v4 via: <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
- Make it responsive and modern-looking using Tailwind classes
- DO NOT include any JavaScript logic beyond the minimal web component registration
- The component should be self-contained and properly scoped
- Use proper HTML structure and accessibility attributes

Structure:
1. A <template> element with an id
2. Include the Tailwind CSS v4 browser script inside the template
3. HTML content using Tailwind v4 utility classes
4. The custom element tag
5. Minimal <script> to register the web component with Shadow DOM

Return only the complete Web Component code. No explanations, no markdown formatting, no code blocks (```), just the raw HTML/JavaScript code.`,
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
