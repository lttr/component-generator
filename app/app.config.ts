const PULEO_VERSION = "0.8.1"
const TAILWIND_VERSION = "4.1.13"

export default defineAppConfig({
  tailwindCdn: `https://cdn.jsdelivr.net/npm/@tailwindcss/browser@${TAILWIND_VERSION}`,
  puleoCdn: `https://cdn.jsdelivr.net/npm/@lttr/puleo@${PULEO_VERSION}/output/puleo.host.min.css`,
})
