export default defineEventHandler(async (_event) => {
  try {
    const prompt = `Generate a random, simple web component description in 1-3 sentences. 
    
    Examples of good descriptions:
    - A pricing card with three tiers, monthly/yearly toggle, and feature lists
    - A user profile card showing avatar, name, title, and social media links
    - A testimonial component with quote, author photo, and star rating
    - A newsletter signup form with email input and subscribe button
    - A product card with image, title, price, and add to cart button
    - A loading spinner with animated dots or circles
    - A notification banner with icon, message, and close button
    - A progress bar showing completion percentage
    - A toggle switch for dark/light mode
    - A breadcrumb navigation component
    
    Create a similar simple, practical web component description. Be creative but keep it realistic and commonly used. Focus on UI components that would be useful in real applications.
    
    Return only the description, no explanations or formatting.`

    const componentDescription = await callClaude(prompt)

    return {
      success: true,
      data: {
        description: componentDescription.trim(),
      },
    }
  } catch (error) {
    console.error("Failed to generate random description:", error)
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to generate random description",
    })
  }
})
