<template>
  <div class="renderer-container">
    <div class="preview-header">
      <h2>Generated Component</h2>
      <button class="toggle-btn" @click="showCode = !showCode">
        {{ showCode ? "Hide Code" : "Show Code" }}
      </button>
    </div>

    <div class="preview-content">
      <div v-if="error" class="error-message">
        Error rendering component: {{ error }}
      </div>

      <div v-else ref="previewContainer" class="component-preview">
        <!-- HTML content will be inserted here -->
      </div>

      <div v-if="showCode" class="code-display">
        <pre><code>{{ componentCode }}</code></pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from "vue"

interface Props {
  componentCode: string
}

const props = defineProps<Props>()

const showCode = ref<boolean>(false)
const error = ref<string>("")
const previewContainer = ref<HTMLElement | null>(null)

const renderHtmlComponent = async (code: string) => {
  try {
    error.value = ""

    if (!previewContainer.value) {
      return
    }

    // Clear previous content and remove any existing custom elements
    previewContainer.value.innerHTML = ""

    // Remove any previously registered custom elements
    const existingElements = document.querySelectorAll("generated-component")
    existingElements.forEach((el) => el.remove())

    // Create a unique component name to avoid conflicts
    const componentName = `generated-component-${Date.now()}`

    // Create the web component programmatically
    class GeneratedComponent extends HTMLElement {
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
      customElements.define(componentName, GeneratedComponent)
    }

    // Create and append the component
    const componentElement = document.createElement(componentName)
    previewContainer.value.appendChild(componentElement)
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : "Unknown error"
    if (previewContainer.value) {
      previewContainer.value.innerHTML = ""
    }
  }
}

watch(
  () => props.componentCode,
  async (newCode) => {
    if (newCode) {
      await nextTick()
      renderHtmlComponent(newCode)
    }
  },
  { immediate: true },
)
</script>

<style scoped>
.renderer-container {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: #f8f9fa;
  border-bottom: 1px solid #e2e8f0;
}

.preview-header h2 {
  margin: 0;
  font-size: 1.5rem;
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
}

.component-preview {
  min-height: 200px;
  padding: 1rem;
  border: 2px dashed #e2e8f0;
  border-radius: 8px;
  background: #fafafa;
}

.error-message {
  color: #e53e3e;
  background: #fed7d7;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #feb2b2;
}

.code-display {
  margin-top: 1.5rem;
  background: #2d3748;
  border-radius: 8px;
  overflow-x: auto;
}

.code-display pre {
  margin: 0;
  padding: 1.5rem;
}

.code-display code {
  color: #e2e8f0;
  font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
  font-size: 0.9rem;
  line-height: 1.5;
}
</style>
