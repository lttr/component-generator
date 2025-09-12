// Cache for Puleo CSS variables
let cachedCssVariables: string | null = null
let lastFetchTime = 0
const CACHE_DURATION = 60 * 60 * 1000 // 1 hour in milliseconds

export const getPuleoCssVariables = async (): Promise<string> => {
  const now = Date.now()

  // Return cached version if still valid
  if (cachedCssVariables && now - lastFetchTime < CACHE_DURATION) {
    return cachedCssVariables
  }

  try {
    // Fetch the CSS file
    const response = await fetch(
      "https://cdn.jsdelivr.net/npm/@lttr/puleo@0.6.1/output/puleo.post.css",
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch Puleo CSS: ${response.status}`)
    }

    const cssText = await response.text()

    // Extract CSS variables from the CSS text
    const variableMatches = cssText.match(/--[a-zA-Z0-9-]+:\s*[^;]+;/g) || []

    // Create a structured list of variables organized by category
    const variables = {
      colors: variableMatches.filter(
        (v) =>
          v.includes("color") ||
          v.includes("gray") ||
          v.includes("red") ||
          v.includes("blue") ||
          v.includes("green"),
      ),
      spacing: variableMatches.filter(
        (v) =>
          v.includes("space") ||
          v.includes("gap") ||
          v.includes("margin") ||
          v.includes("padding"),
      ),
      typography: variableMatches.filter(
        (v) =>
          v.includes("font") || v.includes("text") || v.includes("line-height"),
      ),
      layout: variableMatches.filter(
        (v) =>
          v.includes("width") || v.includes("height") || v.includes("size"),
      ),
      effects: variableMatches.filter(
        (v) =>
          v.includes("shadow") || v.includes("radius") || v.includes("border"),
      ),
      animation: variableMatches.filter(
        (v) =>
          v.includes("ease") || v.includes("duration") || v.includes("timing"),
      ),
    }

    // Format the variables for the prompt
    const formattedVariables = `
<puleo-css-variables>
Colors:
${variables.colors.join("\n")}

Spacing:
${variables.spacing.join("\n")}

Typography: 
${variables.typography.join("\n")}

Layout:
${variables.layout.join("\n")}

Effects (shadows, borders, radius):
${variables.effects.join("\n")}

Animation:
${variables.animation.join("\n")}

All other variables:
${variableMatches
  .filter(
    (v) =>
      !variables.colors.includes(v) &&
      !variables.spacing.includes(v) &&
      !variables.typography.includes(v) &&
      !variables.layout.includes(v) &&
      !variables.effects.includes(v) &&
      !variables.animation.includes(v),
  )
  .join("\n")}
</puleo-css-variables>`

    // Cache the result
    cachedCssVariables = formattedVariables
    lastFetchTime = now

    return formattedVariables
  } catch (error) {
    console.error("Error fetching Puleo CSS variables:", error)

    // Return a fallback with common variables if fetch fails
    return `
<puleo-css-variables>
Common Puleo CSS Variables (fallback):
--gray-1: hsl(0 0% 99%);
--gray-2: hsl(0 0% 97.3%);
--gray-3: hsl(0 0% 95.1%);
--gray-4: hsl(0 0% 93%);
--gray-5: hsl(0 0% 90.9%);
--gray-6: hsl(0 0% 88.7%);
--gray-7: hsl(0 0% 85.8%);
--gray-8: hsl(0 0% 78%);
--gray-9: hsl(0 0% 56.1%);
--gray-10: hsl(0 0% 52.3%);
--gray-11: hsl(0 0% 43.5%);
--gray-12: hsl(0 0% 9%);
--space-1: 0.25rem;
--space-2: 0.5rem;
--space-3: 0.75rem;
--space-4: 1rem;
--space-5: 1.25rem;
--space-6: 1.5rem;
--space-7: 1.75rem;
--space-8: 2rem;
--space-9: 2.25rem;
--font-size-body: 1rem;
--font-size-h1: 2.25rem;
--font-size-h2: 1.875rem;
--font-size-h3: 1.5rem;
--font-size-h4: 1.25rem;
--font-size-h5: 1.125rem;
--radius-1: 0.125rem;
--radius-2: 0.25rem;
--radius-3: 0.375rem;
--radius-4: 0.5rem;
--radius-round: 50%;
--shadow-1: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-2: 0 1px 3px 0 rgb(0 0 0 / 0.1);
--shadow-3: 0 4px 6px -1px rgb(0 0 0 / 0.1);
</puleo-css-variables>`
  }
}
