import { readFileSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), "../..")

const readExample = (filename: string): string => {
  const content = readFileSync(join(projectRoot, "examples", filename), "utf-8")
  return content.trim()
}

export const exampleData = {
  description: readExample("card-prompt.txt"),
  tailwindCode: readExample("card-tailwind.html"),
  tailwindCodeWithStyle: readExample("card-tailwind-with-style.html"),
  puleoCode: readExample("card-puleo.html"),
  html: readExample("card.html"),
}
