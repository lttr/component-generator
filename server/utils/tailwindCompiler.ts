import { compile } from "tailwindcss"
import { readFileSync } from "fs"
import { join } from "path"

interface TailwindCompiler {
  build: (candidates: string[]) => Promise<string>
}

let compilerInstance: TailwindCompiler | null = null

// Extract Tailwind classes from HTML string
export function extractTailwindClasses(html: string): string[] {
  const classRegex = /class\s*=\s*["']([^"']*?)["']/g
  const classes: string[] = []
  let match

  while ((match = classRegex.exec(html)) !== null) {
    const classNames = match[1].split(/\s+/).filter(Boolean)
    classes.push(...classNames)
  }

  // Remove duplicates and return
  return [...new Set(classes)]
}

// Get or create Tailwind compiler instance
async function getTailwindCompiler(): Promise<TailwindCompiler> {
  if (compilerInstance) {
    return compilerInstance
  }

  try {
    const baseCss = `@import "tailwindcss";`

    const compiler = await compile(baseCss, {
      async loadStylesheet(id, base) {
        if (id === "tailwindcss") {
          // Load Tailwind's core stylesheet
          try {
            const tailwindPath = join(
              process.cwd(),
              "node_modules/tailwindcss/index.css",
            )
            const content = readFileSync(tailwindPath, "utf-8")
            return {
              path: "virtual:tailwindcss/index.css",
              base,
              content,
            }
          } catch (error) {
            throw new Error(`Failed to load Tailwind CSS: ${error}`)
          }
        }
        throw new Error(`Unknown stylesheet: ${id}`)
      },
    })

    compilerInstance = {
      build: async (candidates: string[]): Promise<string> => {
        try {
          const result = await compiler.build(candidates)

          if (typeof result === "string") {
            return result
          } else if (result && result.css) {
            return result.css
          }

          return ""
        } catch (error) {
          console.error("Tailwind compilation error:", error)
          throw new Error(`Failed to compile Tailwind CSS: ${error}`)
        }
      },
    }

    return compilerInstance
  } catch (error) {
    console.error("Failed to initialize Tailwind compiler:", error)
    throw new Error(`Failed to initialize Tailwind compiler: ${error}`)
  }
}

// Process HTML and generate corresponding CSS
export async function processTailwindHtml(html: string): Promise<string> {
  try {
    const classes = extractTailwindClasses(html)

    if (classes.length === 0) {
      return "" // No classes found, return empty CSS
    }

    const compiler = await getTailwindCompiler()
    const css = await compiler.build(classes)

    return css
  } catch (error) {
    console.error("Error processing Tailwind HTML:", error)
    throw new Error(`Failed to process Tailwind HTML: ${error}`)
  }
}

// Cache for compiled CSS to avoid recompilation
const cssCache = new Map<string, string>()

// Process HTML with caching
export async function processTailwindHtmlCached(html: string): Promise<string> {
  const classes = extractTailwindClasses(html)
  const cacheKey = classes.sort().join(",")

  if (cssCache.has(cacheKey)) {
    return cssCache.get(cacheKey)!
  }

  const css = await processTailwindHtml(html)
  cssCache.set(cacheKey, css)

  return css
}
