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
    max_tokens: 4000,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `You are a web component generator. You create HTML components based on user descriptions.

${prompt}`,
            cache_control: { type: "ephemeral" },
          },
          {
            type: "text",
            text: `Generate HTML content for a component based on this description: "${description}"`,
          },
        ],
      },
    ],
  })

  const firstContent = message.content[0]
  return firstContent?.type === "text" ? firstContent.text : ""
}
