import { readFile } from "fs/promises"
import { join } from "path"

export default defineEventHandler(async () => {
  try {
    const description = await readFile(
      join(process.cwd(), "server/examples/card-prompt.txt"),
      "utf-8",
    )
    const tailwindCode = await readFile(
      join(process.cwd(), "server/examples/card-tailwind.html"),
      "utf-8",
    )
    const puleoCode = await readFile(
      join(process.cwd(), "server/examples/card-puleo.html"),
      "utf-8",
    )

    return {
      success: true,
      data: {
        description: description.trim(),
        tailwindCode: tailwindCode.trim(),
        puleoCode: puleoCode.trim(),
      },
    }
  } catch (error: unknown) {
    console.error("Error reading example data:", error)
    throw createError({
      statusCode: 500,
      statusMessage:
        error instanceof Error ? error.message : "Failed to read example data",
    })
  }
})
