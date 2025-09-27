// Cache for Puleo CSS variables
let cachedCssVariables: string | null = null
let lastFetchTime = 0
const CACHE_DURATION = 60 * 60 * 1000 // 1 hour in milliseconds

export const getPuleoFrameworkCode = async (): Promise<string | undefined> => {
  const now = Date.now()

  // Return cached version if still valid
  if (cachedCssVariables && now - lastFetchTime < CACHE_DURATION) {
    return cachedCssVariables
  }

  try {
    const appConfig = useAppConfig()
    const puleoCdn = appConfig.puleoCdn
    const puleoVersion = appConfig.puleoVersion

    // Fetch the CSS file
    const response = await fetch(
      `${puleoCdn}${puleoVersion}/output/puleo.post.css`,
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch Puleo CSS: ${response.status}`)
    }

    const cssText = await response.text()

    // Cache the result
    cachedCssVariables = cssText
    lastFetchTime = now

    return cssText
  } catch (error) {
    console.error("Error fetching Puleo CSS variables:", error)
  }
}
