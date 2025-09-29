import Anthropic from "@anthropic-ai/sdk"

export const callClaude = async (prompt: string): Promise<string> => {
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
    // model: "claude-3-5-haiku-20241022",
    model: "claude-sonnet-4-20250514",
    max_tokens: 5000,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: prompt,
          },
        ],
      },
    ],
  })

  const firstContent = message.content[0]
  return firstContent?.type === "text" ? firstContent.text : ""
}
