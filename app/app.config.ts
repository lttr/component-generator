import { PULEO_VERSION, TAILWIND_VERSION } from "../shared/constants"

export default defineAppConfig({
  tailwindCdn: `https://cdn.tailwindcss.com/${TAILWIND_VERSION}`,
  puleoCdn: `https://cdn.jsdelivr.net/npm/@lttr/puleo@${PULEO_VERSION}/output/puleo.host.min.css`,
})
