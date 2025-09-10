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

      <div v-else class="component-preview">
        <component :is="compiledComponent" v-if="compiledComponent" />
      </div>

      <div v-if="showCode" class="code-display">
        <pre><code>{{ componentCode }}</code></pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineComponent, ref, watch, type Component } from "vue"

interface Props {
  componentCode: string
}

const props = defineProps<Props>()

const showCode = ref<boolean>(false)
const error = ref<string>("")
const compiledComponent = ref<Component | null>(null)

const compileComponent = (code: string) => {
  try {
    error.value = ""

    // Extract template
    const templateMatch = code.match(/<template>([\s\S]*?)<\/template>/)
    const template =
      templateMatch?.[1]?.trim() ?? "<div>No template found</div>"

    // Extract script setup content
    const scriptSetupMatch = code.match(
      /<script\s+setup[^>]*>([\s\S]*?)<\/script>/,
    )

    // For simplicity, create a basic component with just the template
    // In a production app, you'd want more sophisticated parsing for script setup
    const componentDef: Record<string, unknown> = {
      template: template,
      setup() {
        // Basic reactive refs for common properties
        const title = ref("Sample Title")
        const subtitle = ref("Sample Subtitle")
        const text = ref("This is sample text content.")
        const date = ref("2024-01-01")
        const link = ref("#")

        // If there's script setup content, try to extract simple refs
        if (scriptSetupMatch?.[1]) {
          const scriptContent = scriptSetupMatch[1]

          // Look for ref definitions and extract their values
          const refMatches = scriptContent.matchAll(
            /const\s+(\w+)\s*=\s*ref\(['"`]([^'"`]*?)['"`]\)/g,
          )
          for (const match of refMatches) {
            const [, varName, value] = match
            if (varName === "title" && value) {
              title.value = value
            } else if (varName === "subtitle" && value) {
              subtitle.value = value
            } else if (varName === "text" && value) {
              text.value = value
            } else if (varName === "date" && value) {
              date.value = value
            } else if (varName === "link" && value) {
              link.value = value
            }
          }
        }

        return {
          title,
          subtitle,
          text,
          date,
          link,
        }
      },
    }

    compiledComponent.value = defineComponent(componentDef)
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : "Unknown error"
    compiledComponent.value = null
  }
}

watch(
  () => props.componentCode,
  (newCode) => {
    if (newCode) {
      compileComponent(newCode)
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
