export default defineEventHandler(async (event) => {
  try {
    const { description, html } = await readBody(event)

    if (!description) {
      throw createError({
        statusCode: 400,
        statusMessage: "Description is required",
      })
    }

    if (!html) {
      throw createError({
        statusCode: 400,
        statusMessage: "HTML is required",
      })
    }

    const prompt = `<task>
Add Tailwind CSS v4 utility classes to the provided HTML.
</task>

<requirements>
- Add ONLY Tailwind CSS v4 utility classes to the provided HTML
- DO NOT change the HTML structure, elements, or content - only add class attributes
- Use Tailwind CSS v4 syntax and classes for ALL styling
- Make it responsive and modern-looking using Tailwind classes
- Preserve all existing attributes and accessibility features
- NO JavaScript, NO custom elements, NO Shadow DOM modifications
- NO inline SVG elements - use text, emojis, or CSS-based graphics instead
</requirements>

<example>
Input Description: A card component with heading, subheading, text, date and link to read more

Input HTML:
<article href="#">
  <header>
    <h2>Yet another generated component thing</h2>
    <h3>By John Doe</h3>
  </header>

  <p>
    Lorem ipsum dolor sit, amet consectetur adipisicing elit. At velit illum
    provident a, ipsa maiores deleniti consectetur nobis et eaque.
  </p>

  <foter>
    <span>31/06/2025</span>
    <a href="#">Read more</a>
  </foter>
</article>

Expected Output:
<article
  href="#"
  class="block max-w-[40ch] rounded-md border border-gray-300 p-4 shadow-sm sm:p-6"
>
  <header class="mt-4 sm:mt-0">
    <h2 class="text-lg font-medium text-balance text-gray-900">
      Yet another generated component thing
    </h2>
    <h3 class="mt-1 text-sm text-gray-700">By John Doe</h3>
  </header>

  <p class="mt-4 text-sm text-pretty text-gray-700">
    Lorem ipsum dolor sit, amet consectetur adipisicing elit. At velit illum
    provident a, ipsa maiores deleniti consectetur nobis et eaque.
  </p>

  <footer class="mt-4 flex items-center justify-between gap-2 text-sm">
    <span class="text-gray-700">31/06/2025</span>
    <a href="#" class="underline hover:no-underline">Read more</a>
  </footer>
</article>
</example>

<input_html>
${html}
</input_html>

<description>
${description}
</description>

<output_format>
Return only the HTML content with Tailwind classes added. No explanations, no markdown formatting, no triple backticks, no <script> tags, just the raw HTML with Tailwind classes.
</output_format>`

    const componentCode = await callClaude(prompt)

    return {
      success: true,
      data: {
        component: componentCode,
      },
    }
  } catch (error: unknown) {
    console.error("Error generating component:", error)
    throw createError({
      statusCode: 500,
      statusMessage:
        error instanceof Error ? error.message : "Failed to generate component",
    })
  }
})
