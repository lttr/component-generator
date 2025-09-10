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

    // Clear previous content
    previewContainer.value.innerHTML = ""

    // Create a container for the HTML content
    const wrapper = document.createElement("div")
    wrapper.innerHTML = code

    // Extract and execute any script tags
    const scripts = wrapper.querySelectorAll("script")
    scripts.forEach((script) => {
      const newScript = document.createElement("script")
      if (script.src) {
        newScript.src = script.src
      } else {
        newScript.textContent = script.textContent
      }
      // Remove the script from the wrapper to avoid duplicate execution
      script.remove()
      // Append the script to execute it
      document.head.appendChild(newScript)
      // Clean up after execution
      setTimeout(() => document.head.removeChild(newScript), 100)
    })

    // Append the HTML content to the preview container
    previewContainer.value.appendChild(wrapper)
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
