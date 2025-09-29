<template>
  <div class="renderer-section">
    <div class="section-header">
      <h3>{{ frameworkName }}</h3>
      <button class="toggle-btn" @click="showCode = !showCode">
        {{ showCode ? "Hide Code" : "Show Code" }}
      </button>
    </div>

    <div v-if="error" class="error-message">
      Error rendering {{ frameworkName }} component: {{ error }}
    </div>

    <div v-else class="preview-content">
      <div ref="container" class="component-container">
        <!-- Framework component will be inserted here -->
      </div>
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
  frameworkName: string
  componentCss?: string
  cdnUrl?: string
  useScriptTag?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  useScriptTag: false,
})

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

const updateHighlightedCode = async (componentCode: string) => {
  if (!componentCode) {
    highlightedCode.value = ""
    return
  }

  await initHighlighter()
  if (highlighter) {
    highlightedCode.value = highlighter.codeToHtml(componentCode, {
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

    container.value.innerHTML = ""

    const componentName = `${props.frameworkName.toLowerCase().replace(/\s+/g, "-")}-component`

    class DynamicComponent extends HTMLElement {
      constructor() {
        super()

        const shadow = this.attachShadow({ mode: "open" })

        // If we have component CSS, inject it directly
        if (props.componentCss) {
          const styleTag = document.createElement("style")
          styleTag.textContent = props.componentCss
          shadow.appendChild(styleTag)
        } else if (props.cdnUrl) {
          // Fallback to CDN if no CSS provided
          if (props.useScriptTag) {
            const scriptTag = document.createElement("script")
            scriptTag.src = props.cdnUrl
            shadow.appendChild(scriptTag)
          } else {
            const linkTag = document.createElement("link")
            linkTag.rel = "stylesheet"
            linkTag.href = props.cdnUrl
            shadow.appendChild(linkTag)
          }
        }

        const container = document.createElement("div")
        container.innerHTML = code
        shadow.appendChild(container)
      }
    }

    if (!customElements.get(componentName)) {
      customElements.define(componentName, DynamicComponent)
    }

    const componentElement = document.createElement(componentName)
    container.value.appendChild(componentElement)

    await nextTick()
    container.value.scrollTop = 0
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : "Unknown error"
    if (container.value) {
      container.value.innerHTML = ""
    }
  }
}

watch(
  () => props.componentCode,
  async (newCode) => {
    if (newCode) {
      await nextTick()
      renderComponent(newCode)
      updateHighlightedCode(newCode)
    }
  },
  { immediate: true },
)
</script>

<style scoped>
.renderer-section {
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%);
  border: 2px solid var(--vhs-cyan);
  border-radius: 12px;
  overflow: hidden;
  position: relative;
}

.renderer-section::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--vhs-scan-lines);
  opacity: 0.1;
  pointer-events: none;
  z-index: 1;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: linear-gradient(90deg, #333 0%, #555 50%, #333 100%);
  border-bottom: 2px solid var(--vhs-cyan);
  position: relative;
  z-index: 10;
}

.section-header h3 {
  margin: 0;
  font-size: 1.1rem;
  font-family: "Orbitron", monospace;
  font-weight: 700;
  color: var(--vhs-orange);
  text-shadow: 0 0 8px currentColor;
  letter-spacing: 0.1em;
}

.toggle-btn {
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  color: var(--vhs-cyan);
  border: 1px solid var(--vhs-cyan);
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.75rem;
  font-family: "Space Mono", monospace;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-shadow: 0 0 5px currentColor;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.toggle-btn::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(0, 255, 255, 0.3) 50%,
    transparent 100%
  );
  transition: left 0.3s ease;
}

.toggle-btn:hover {
  background: linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%);
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.5);
  text-shadow: 0 0 10px currentColor;
}

.toggle-btn:hover::before {
  left: 100%;
}

.preview-content {
  padding: 0;
  min-height: 380px;
  background: #fff;
  position: relative;
  z-index: 10;
  border-radius: 0 0 10px 10px;
  overflow: hidden;
  margin: 0;
}

.component-container {
  background-color: #2d2d2d;
  min-height: 380px;
  width: 100%;
  position: relative;
  padding: 2rem;
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
