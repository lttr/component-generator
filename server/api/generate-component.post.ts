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
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: `Create a Vue 3 component based on this description: "${description}"

Requirements:
- Use Vue 3 composition API with <script setup> syntax
- Include proper TypeScript types if needed
- Make it visually appealing with inline styles in <style scoped>
- Use semantic HTML elements
- Make it responsive
- Only return the complete Vue component code, nothing else
- The component should be self-contained and functional

Return only the Vue component code wrapped in <template>, <script setup>, and <style scoped> tags.`,
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
