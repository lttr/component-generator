import cardPromptText from "../../examples/card-prompt.txt?raw"
import cardTailwindHtml from "../../examples/card-tailwind.html?raw"
import cardPuleoHtml from "../../examples/card-puleo.html?raw"

export const exampleData = {
  description: cardPromptText.trim(),
  tailwindCode: cardTailwindHtml.trim(),
  puleoCode: cardPuleoHtml.trim(),
}
