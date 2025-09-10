import Anthropic from "@anthropic-ai/sdk"

export const generateComponent = async (
  description: string,
  prompt: string,
): Promise<string> => {
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

${prompt}`,
      },
    ],
  })

  const firstContent = message.content[0]
  return firstContent?.type === "text" ? firstContent.text : ""
}
