<template>
  <div class="dual-renderer-container">
    <div class="renderer-grid">
      <!-- Tailwind Component -->
      <div class="renderer-section">
        <div class="section-header">
          <h3>Tailwind CSS</h3>
          <button
            class="toggle-btn"
            @click="showTailwindCode = !showTailwindCode"
          >
            {{ showTailwindCode ? "Hide Code" : "Show Code" }}
          </button>
        </div>

        <div
          v-if="showTailwindCode"
          class="code-display"
          v-html="highlightedTailwindCode"
        ></div>

        <div v-if="tailwindError" class="error-message">
          Error rendering Tailwind component: {{ tailwindError }}
        </div>

        <div v-else ref="tailwindContainer" class="preview-content">
          <!-- Tailwind component will be inserted here -->
        </div>
      </div>

      <!-- Puleo Component -->
      <div class="renderer-section">
        <div class="section-header">
          <h3>Puleo CSS</h3>
          <button class="toggle-btn" @click="showPuleoCode = !showPuleoCode">
            {{ showPuleoCode ? "Hide Code" : "Show Code" }}
          </button>
        </div>

        <div
          v-if="showPuleoCode"
          class="code-display"
          v-html="highlightedPuleoCode"
        ></div>

        <div v-if="puleoError" class="error-message">
          Error rendering Puleo component: {{ puleoError }}
        </div>

        <div v-else ref="puleoContainer" class="preview-content">
          <!-- Puleo component will be inserted here -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, computed } from "vue"
import { createHighlighter } from "shiki"

interface Props {
  tailwindCode: string
  puleoCode: string
}

const props = defineProps<Props>()

const showTailwindCode = ref<boolean>(false)
const showPuleoCode = ref<boolean>(false)
const tailwindError = ref<string>("")
const puleoError = ref<string>("")
const tailwindContainer = ref<HTMLElement | null>(null)
const puleoContainer = ref<HTMLElement | null>(null)
const highlightedTailwindCode = ref<string>("")
const highlightedPuleoCode = ref<string>("")

let highlighter: any = null

const initHighlighter = async () => {
  if (!highlighter) {
    highlighter = await createHighlighter({
      themes: ["vitesse-dark"],
      langs: ["html"],
    })
  }
}

const updateHighlightedCode = async () => {
  await initHighlighter()

  if (props.tailwindCode) {
    highlightedTailwindCode.value = highlighter.codeToHtml(props.tailwindCode, {
      lang: "html",
      theme: "vitesse-dark",
    })
  }

  if (props.puleoCode) {
    highlightedPuleoCode.value = highlighter.codeToHtml(props.puleoCode, {
      lang: "html",
      theme: "vitesse-dark",
    })
  }
}

const renderTailwindComponent = async (code: string) => {
  try {
    tailwindError.value = ""

    if (!tailwindContainer.value) {
      return
    }

    // Clear previous content
    tailwindContainer.value.innerHTML = ""

    // Create a unique component name
    const componentName = `tailwind-component-${Date.now()}`

    // Create the web component with Tailwind CSS
    class TailwindComponent extends HTMLElement {
      constructor() {
        super()

        // Create shadow root
        const shadow = this.attachShadow({ mode: "open" })

        // Add Tailwind CSS v4 CDN
        const tailwindScript = document.createElement("script")
        tailwindScript.src = "https://cdn.tailwindcss.com/"
        shadow.appendChild(tailwindScript)

        // Create a container for the generated HTML
        const container = document.createElement("div")
        container.innerHTML = code
        shadow.appendChild(container)
      }
    }

    // Register the custom element
    if (!customElements.get(componentName)) {
      customElements.define(componentName, TailwindComponent)
    }

    // Create and append the component
    const componentElement = document.createElement(componentName)
    tailwindContainer.value.appendChild(componentElement)
  } catch (e: unknown) {
    tailwindError.value = e instanceof Error ? e.message : "Unknown error"
    if (tailwindContainer.value) {
      tailwindContainer.value.innerHTML = ""
    }
  }
}

const renderPuleoComponent = async (code: string) => {
  try {
    puleoError.value = ""

    if (!puleoContainer.value) {
      return
    }

    // Clear previous content
    puleoContainer.value.innerHTML = ""

    // Create a unique component name
    const componentName = `puleo-component-${Date.now()}`

    // Create the web component with Puleo CSS
    class PuleoComponent extends HTMLElement {
      constructor() {
        super()

        // Create shadow root
        const shadow = this.attachShadow({ mode: "open" })

        // Add Puleo CSS CDN
        const puleoLink = document.createElement("link")
        puleoLink.rel = "stylesheet"
        puleoLink.href =
          "https://cdn.jsdelivr.net/npm/@lttr/puleo/output/puleo.min.css"
        shadow.appendChild(puleoLink)

        // Create a container for the generated HTML
        const container = document.createElement("div")
        container.innerHTML = code
        shadow.appendChild(container)
      }
    }

    // Register the custom element
    if (!customElements.get(componentName)) {
      customElements.define(componentName, PuleoComponent)
    }

    // Create and append the component
    const componentElement = document.createElement(componentName)
    puleoContainer.value.appendChild(componentElement)
  } catch (e: unknown) {
    puleoError.value = e instanceof Error ? e.message : "Unknown error"
    if (puleoContainer.value) {
      puleoContainer.value.innerHTML = ""
    }
  }
}

// Watch for changes in component code
watch(
  () => props.tailwindCode,
  async (newCode) => {
    if (newCode) {
      await nextTick()
      renderTailwindComponent(newCode)
      updateHighlightedCode()
    }
  },
  { immediate: true },
)

watch(
  () => props.puleoCode,
  async (newCode) => {
    if (newCode) {
      await nextTick()
      renderPuleoComponent(newCode)
      updateHighlightedCode()
    }
  },
  { immediate: true },
)
</script>

<style scoped>
.dual-renderer-container {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
}

.renderer-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1px;
  background: #e2e8f0;
}

@media (max-width: 768px) {
  .renderer-grid {
    grid-template-columns: 1fr;
  }
}

.renderer-section {
  background: white;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: #f8f9fa;
  border-bottom: 1px solid #e2e8f0;
}

.section-header h3 {
  margin: 0;
  font-size: 1.25rem;
  color: #2d3748;
}

.toggle-btn {
  background: #4299e1;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s ease;
}

.toggle-btn:hover {
  background: #3182ce;
}

.preview-content {
  padding: 2rem;
  min-height: 200px;
}

.error-message {
  color: #e53e3e;
  background: #fed7d7;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #feb2b2;
  margin: 1rem;
}

.code-display {
  margin-bottom: 1.5rem;
  border-radius: 8px;
  overflow-x: auto;
}

.code-display :deep(pre) {
  margin: 0;
  padding: 1.5rem;
  white-space: pre-wrap;
  word-wrap: break-word;
  border-radius: 8px;
}

.code-display :deep(code) {
  font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
  font-size: 1.1rem;
  line-height: 1.5;
}
</style>
