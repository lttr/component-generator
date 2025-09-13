<template>
  <div class="renderer-section">
    <div class="section-header">
      <h3>Puleo CSS</h3>
      <button class="toggle-btn" @click="showCode = !showCode">
        {{ showCode ? "Hide Code" : "Show Code" }}
      </button>
    </div>

    <div v-if="error" class="error-message">
      Error rendering Puleo component: {{ error }}
    </div>

    <div v-else ref="container" class="preview-content">
      <!-- Puleo component will be inserted here -->
    </div>

    <!-- eslint-disable-next-line vue/no-v-html -->
    <div v-if="showCode" class="code-display" v-html="highlightedCode"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from "vue"
import { createHighlighter } from "shiki"

interface Props {
  componentCode: string
}

const props = defineProps<Props>()

const showCode = ref<boolean>(false)
const error = ref<string>("")
const container = ref<HTMLElement | null>(null)
const highlightedCode = ref<string>("")

let highlighter: Awaited<ReturnType<typeof createHighlighter>> | null = null

const initHighlighter = async () => {
  if (!highlighter) {
    highlighter = await createHighlighter({
      themes: ["vitesse-dark"],
      langs: ["html"],
    })
  }
}

const updateHighlightedCode = async () => {
  if (!props.componentCode) {
    highlightedCode.value = ""
    return
  }

  await initHighlighter()
  if (highlighter) {
    highlightedCode.value = highlighter.codeToHtml(props.componentCode, {
      lang: "html",
      theme: "vitesse-dark",
    })
  }
}

const renderComponent = async (code: string) => {
  try {
    error.value = ""

    if (!container.value) {
      return
    }

    // Clear previous content
    container.value.innerHTML = ""

    // Create a unique component name
    const componentName = `puleo-component-${Date.now()}`

    // Create the web component with Puleo CSS
    class PuleoComponent extends HTMLElement {
      constructor() {
        super()

        // Create shadow root
        const shadow = this.attachShadow({ mode: "open" })

        // Add Puleo CSS via link tag
        const puleoLink = document.createElement("link")
        puleoLink.rel = "stylesheet"
        puleoLink.href =
          "https://cdn.jsdelivr.net/npm/@lttr/puleo@0.6.1/output/puleo.post.css"
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
    container.value.appendChild(componentElement)

    // Scroll container to top after component loads
    await nextTick()
    container.value.scrollTop = 0
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : "Unknown error"
    if (container.value) {
      container.value.innerHTML = ""
    }
  }
}

// Watch for changes in component code
watch(
  () => props.componentCode,
  async (newCode) => {
    if (newCode) {
      await nextTick()
      renderComponent(newCode)
      updateHighlightedCode()
    }
  },
  { immediate: true },
)
</script>

<style scoped>
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
