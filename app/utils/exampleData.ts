import cardPromptText from "~~/examples/card-prompt.txt?raw"
import cardHtml from "~~/examples/card.html?raw"
import cardTailwindHtmlWithStyle from "~~/examples/card-tailwind-with-style.html?raw"
import cardTailwindHtml from "~~/examples/card-tailwind.html?raw"
import cardPuleoHtml from "~~/examples/card-puleo.html?raw"

export const exampleData = {
  description: cardPromptText.trim(),
  html: cardHtml.trim(),
  puleoCode: cardPuleoHtml.trim(),
  tailwindCode: cardTailwindHtml.trim(),
  tailwindCodeWithStyle: cardTailwindHtmlWithStyle.trim(),
}
