<template>
  <div class="vhs-container">
    <!-- VHS Cassette Header -->
    <div class="vhs-cassette-header">
      <div class="vhs-cassette-body">
        <div class="vhs-tape-reels">
          <div
            class="vhs-reel vhs-reel-left"
            :class="{ 'spinning-fast': loading }"
          >
            <div class="vhs-reel-center"></div>
          </div>
          <div
            class="vhs-reel vhs-reel-right"
            :class="{ 'spinning-fast': loading }"
          >
            <div class="vhs-reel-center"></div>
          </div>
        </div>
        <div class="vhs-label-area">
          <div class="vhs-title-area">
            <h1 class="vhs-title vhs-glitch" data-text="COMPONENT GENERATOR">
              COMPONENT GENERATOR
            </h1>
            <div class="vhs-subtitle">AI-POWERED WEB COMPONENT SYNTHESIS</div>
          </div>
        </div>
      </div>
      <div class="vhs-scan-line"></div>
    </div>

    <GeneratorForm :loading="loading" @generate="handleGenerate" />

    <ComponentRenderer
      v-if="tailwindComponent || puleoComponent"
      :tailwind-code="tailwindComponent"
      :tailwind-css="tailwindCss"
      :puleo-code="puleoComponent"
    />

    <!-- History Panel -->
    <ClientOnly>
      <HistoryPanel
        :is-recording="loading"
        :selected-id="selectedRecordId"
        @load-generation="handleLoadGeneration"
      />
    </ClientOnly>

    <!-- Footer with Project Info -->
    <footer class="vhs-control-bar">
      <div class="vhs-decorative-panel">
        <a
          href="https://github.com/lttr/component-generator"
          target="_blank"
          class="vhs-github-label"
        >
          📡 GITHUB.COM/LTTR/COMPONENT-GENERATOR
        </a>
        <div class="vhs-inspection-label">✓ INSPECTED BY LUKAS TRUMM</div>
        <div class="vhs-warning-label">
          ⚠ MIT LICENSE: NO WARRANTY, HAVE FUN!
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import {
  useGenerationHistory,
  type GenerationRecord,
} from "~/composables/useGenerationHistory"

const tailwindComponent = ref<string>("")
const tailwindCss = ref<string>("")
const puleoComponent = ref<string>("")
const loading = ref<boolean>(false)
const selectedRecordId = ref<string>("")

const { saveGeneration, initializeWithExample } = useGenerationHistory()

const handleGenerate = async (description: string) => {
  loading.value = true
  selectedRecordId.value = ""
  try {
    // First generate semantic HTML
    const htmlResponse = await $fetch<{
      success: boolean
      data: { html: string }
    }>("/api/generate-html", {
      method: "POST",
      body: { description },
    })

    const semanticHtml = htmlResponse.data.html

    // Then apply styling to the HTML in parallel
    const [tailwindResponse, puleoResponse] = await Promise.all([
      $fetch<{
        success: boolean
        data: { component: string; css: string }
      }>("/api/generate-component-tailwind", {
        method: "POST",
        body: { description, html: semanticHtml },
      }),
      $fetch<{
        success: boolean
        data: { component: string }
      }>("/api/generate-component-puleo", {
        method: "POST",
        body: { description, html: semanticHtml },
      }),
    ])

    tailwindComponent.value = tailwindResponse.data.component
    tailwindCss.value = tailwindResponse.data.css
    puleoComponent.value = puleoResponse.data.component

    // Save to history
    saveGeneration(description, tailwindComponent.value, puleoComponent.value)

    // Scroll to Claude Vision dual-sync after processing
    nextTick(() => {
      const claudeVision = document.querySelector(".vhs-monitor-container")
      if (claudeVision) {
        claudeVision.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  } catch (error) {
    console.error("Failed to generate component:", error)
  } finally {
    loading.value = false
  }
}

const handleLoadGeneration = (record: GenerationRecord) => {
  tailwindComponent.value = record.tailwindCode
  puleoComponent.value = record.puleoCode
  selectedRecordId.value = record.id

  // Update the description in the form
  const description = useState<string>("generator-description")
  description.value = record.description

  // Scroll to rendered components
  nextTick(() => {
    const claudeVision = document.querySelector(".vhs-monitor-container")
    if (claudeVision) {
      claudeVision.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  })
}

// Initialize example and stop animations after initial load
onMounted(() => {
  // Initialize with example data if history is empty
  initializeWithExample()

  setTimeout(() => {
    document.body.classList.add("stop-animations")
  }, 3000) // Stop animations after 3 seconds
})
</script>

<style scoped>
.vhs-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  position: relative;
  z-index: 10;
}

/* VHS Cassette Header */
.vhs-cassette-header {
  background: linear-gradient(
    135deg,
    #0a0a0a 0%,
    #1a1a1a 30%,
    #2a2a2a 70%,
    #1a1a1a 100%
  );
  border: 3px solid var(--vhs-orange);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  position: relative;
  overflow: hidden;
  box-shadow:
    0 12px 48px rgba(0, 0, 0, 0.8),
    inset 0 2px 0 rgba(255, 140, 0, 0.2),
    inset 0 -2px 0 rgba(0, 0, 0, 0.5);
}

.vhs-cassette-body {
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 2rem;
  align-items: center;
}

.vhs-tape-reels {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.vhs-reel {
  width: 70px;
  height: 70px;
  background: radial-gradient(circle, #333 20%, #222 40%, #111 80%);
  border: 3px solid var(--vhs-cyan);
  border-radius: 50%;
  position: relative;
  animation: vhs-reel-spin 8s linear infinite;
  box-shadow:
    0 0 10px rgba(0, 255, 255, 0.3),
    inset 0 0 20px rgba(0, 0, 0, 0.8);
  transition:
    animation-duration 0.6s ease-in-out,
    opacity 0.3s ease-in-out;
}

.vhs-reel::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50px;
  height: 50px;
  background: repeating-conic-gradient(
    from 0deg,
    #444 0deg 30deg,
    #222 30deg 60deg
  );
  border-radius: 50%;
}

.vhs-reel-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 16px;
  height: 16px;
  background: radial-gradient(circle, #000 30%, #333 100%);
  border: 2px solid var(--vhs-cyan);
  border-radius: 50%;
  box-shadow: 0 0 5px rgba(0, 255, 255, 0.5);
  z-index: 2;
}

.vhs-reel-left {
  animation-duration: 10s;
}

.vhs-reel-right {
  animation-duration: 6s;
  animation-direction: reverse;
}

.vhs-reel.spinning-fast {
  animation-duration: 1.2s !important;
  opacity: 0.9;
  box-shadow:
    0 0 15px rgba(0, 255, 255, 0.5),
    inset 0 0 20px rgba(0, 0, 0, 0.8);
}

.vhs-reel.spinning-fast.vhs-reel-left {
  animation-duration: 1s !important;
}

.vhs-reel.spinning-fast.vhs-reel-right {
  animation-duration: 1.4s !important;
  animation-direction: reverse;
}

@keyframes vhs-reel-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.vhs-label-area {
  background: linear-gradient(45deg, #2a2a2a 0%, #1a1a1a 100%);
  color: var(--vhs-text-cream);
  padding: 1rem;
  border-radius: 6px;
  border: 2px solid var(--vhs-cyan);
  position: relative;
}

.vhs-title-area {
  margin-bottom: 1rem;
}

.vhs-title {
  font-family: "Orbitron", monospace;
  font-weight: 900;
  font-size: 2.8rem;
  color: var(--vhs-text-cream);
  text-align: center;
  margin: 0;
  letter-spacing: 0.15em;
  text-shadow:
    0 0 20px rgba(255, 20, 147, 0.8),
    2px 2px 0px #ff1493,
    4px 4px 0px #00ffff,
    0 0 40px rgba(0, 255, 255, 0.6);
}

.vhs-subtitle {
  font-family: "Space Mono", monospace;
  font-size: 1rem;
  text-align: center;
  color: var(--vhs-cyan);
  font-weight: 700;
  letter-spacing: 0.1em;
  margin-top: 0.75rem;
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
}

/* Animated scan line */
.vhs-scan-line {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    var(--vhs-cyan) 50%,
    transparent 100%
  );
  animation: vhs-scan 3s ease-in-out infinite;
}

@keyframes vhs-scan {
  0%,
  100% {
    transform: translateY(0) scaleX(0);
    opacity: 0;
  }
  10% {
    transform: translateY(0) scaleX(1);
    opacity: 1;
  }
  90% {
    transform: translateY(200px) scaleX(1);
    opacity: 1;
  }
  100% {
    transform: translateY(200px) scaleX(0);
    opacity: 0;
  }
}

/* Footer Control Bar */
.vhs-control-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  margin-top: 2rem;
  background: linear-gradient(90deg, #222 0%, #444 50%, #222 100%);
  border: 2px solid var(--vhs-pink);
  border-radius: 8px;
  position: relative;
  z-index: 10;
}

.vhs-decorative-panel {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
}

/* Shared sticker styling */
.vhs-warning-label,
.vhs-inspection-label,
.vhs-github-label {
  font-family: "Space Mono", monospace;
  font-size: 0.55rem;
  font-weight: 900;
  padding: 0.2rem 0.4rem;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  border-radius: 2px;
  border: 2px solid;
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  position: relative;
  opacity: 0.7;
  text-decoration: none;
  display: block;
}

.vhs-warning-label {
  background: linear-gradient(
    135deg,
    rgba(255, 0, 0, 0.8) 0%,
    rgba(255, 100, 100, 0.8) 100%
  );
  border-color: rgba(200, 0, 0, 0.6);
  color: rgba(255, 255, 255, 0.95);
  transform: rotate(-2deg);
}

.vhs-inspection-label {
  background: linear-gradient(
    135deg,
    rgba(0, 150, 0, 0.8) 0%,
    rgba(100, 255, 100, 0.8) 100%
  );
  border-color: rgba(0, 100, 0, 0.6);
  color: rgba(255, 255, 255, 0.95);
  transform: rotate(-0.5deg);
}

.vhs-github-label {
  background: linear-gradient(
    135deg,
    rgba(0, 100, 200, 0.8) 0%,
    rgba(100, 150, 255, 0.8) 100%
  );
  border-color: rgba(0, 50, 150, 0.6);
  color: rgba(255, 255, 255, 0.95);
  transform: rotate(1deg);
  transition: all 0.2s ease;
}

.vhs-github-label:hover {
  opacity: 1;
  transform: rotate(1deg) scale(1.05);
  box-shadow:
    0 4px 8px rgba(0, 0, 0, 0.4),
    0 0 15px rgba(0, 100, 200, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

/* Responsive design */
@media (max-width: 768px) {
  .vhs-cassette-body {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .vhs-tape-reels {
    justify-content: center;
  }

  .vhs-title {
    font-size: 1.8rem;
  }

  .vhs-control-bar {
    flex-direction: column;
    gap: 0.5rem;
  }

  .vhs-decorative-panel {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
