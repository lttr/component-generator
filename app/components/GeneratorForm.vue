<template>
  <div class="vhs-form-container">
    <!-- VHS Control Panel Header -->
    <div class="vhs-control-header">
      <div
        class="vhs-control-tabs"
        role="tablist"
        aria-label="Input mode selector"
      >
        <button
          role="tab"
          :aria-selected="activeTab === 'empty'"
          :tabindex="activeTab === 'empty' ? 0 : -1"
          class="vhs-control-tab"
          :class="{ active: activeTab === 'empty' }"
          :disabled="loading"
          @click="setActiveTab('empty')"
        >
          EMPTY
        </button>
        <button
          role="tab"
          :aria-selected="activeTab === 'example'"
          :tabindex="activeTab === 'example' ? 0 : -1"
          class="vhs-control-tab"
          :class="{ active: activeTab === 'example' }"
          :disabled="loading"
          @click="setActiveTab('example')"
        >
          EXAMPLE
        </button>
        <button
          role="tab"
          :aria-selected="activeTab === 'random'"
          :tabindex="activeTab === 'random' ? 0 : -1"
          class="vhs-control-tab"
          :class="{ active: activeTab === 'random', loading: loadingRandom }"
          :disabled="loading || loadingRandom"
          @click="setActiveTab('random')"
        >
          {{ loadingRandom ? "GENERATING..." : "RANDOM" }}
        </button>
      </div>
      <div class="vhs-timecode" :class="{ active: loading }">
        {{ loading ? formatTimecode(elapsedTime) : "00:00:00" }}
      </div>
    </div>

    <!-- Terminal Input Area -->
    <div
      class="vhs-terminal-group"
      role="tabpanel"
      aria-labelledby="active-tab"
    >
      <label for="description" class="vhs-terminal-label">
        COMPONENT.PROMPT > _
      </label>
      <textarea
        id="description"
        v-model="description"
        :disabled="loading"
        placeholder="ENTER COMPONENT SPECIFICATION..."
        class="vhs-terminal-input"
        :class="{ 'vhs-glitch': loading }"
        rows="4"
        @focus="startGlitch"
        @blur="stopGlitch"
      ></textarea>
    </div>

    <!-- VHS Play Button -->
    <div class="vhs-button-area">
      <button
        :disabled="loading || !description.trim()"
        class="vhs-play-button"
        :class="{ loading: loading }"
        @click="generate"
      >
        <div class="vhs-button-icon">
          <div class="vhs-play-icon"></div>
        </div>
        <div class="vhs-button-text">
          {{ loading ? "PROCESSING" : "EXECUTE" }}
        </div>
      </button>
    </div>

    <!-- VHS Status Indicators -->
    <div class="vhs-status-bar">
      <div
        class="vhs-status-light"
        :class="{ active: !loading && !loadingRandom }"
      >
        READY
      </div>
      <div class="vhs-status-light" :class="{ active: loading }">BUSY</div>
      <div class="vhs-status-light" :class="{ active: loadingRandom }">
        CLAUDE-AI
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  loading?: boolean
}

const emit = defineEmits<{
  generate: [description: string]
}>()

const initialText =
  "A card component with heading, subheading, text, date and link to read more"
const description = useState<string>("generator-description", () => initialText)
const elapsedTime = ref(0)
const timerInterval = ref<NodeJS.Timeout | null>(null)
const glitchActive = ref(false)
const activeTab = ref<"empty" | "example" | "random">("example")
const loadingRandom = ref(false)

const formatTimecode = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `00:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
}

const startTimer = () => {
  elapsedTime.value = 0
  timerInterval.value = setInterval(() => {
    elapsedTime.value++
  }, 1000)
}

const stopTimer = () => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
    timerInterval.value = null
  }
}

const startGlitch = () => {
  glitchActive.value = true
}

const stopGlitch = () => {
  glitchActive.value = false
}

const setActiveTab = async (tab: "empty" | "example" | "random") => {
  if (props.loading) {
    return
  }

  activeTab.value = tab

  switch (tab) {
    case "empty":
      description.value = ""
      break
    case "example":
      description.value = initialText
      break
    case "random":
      if (!loadingRandom.value) {
        loadingRandom.value = true
        try {
          const response = await $fetch<{
            success: boolean
            data: { description: string }
          }>("/api/generate-random-description", {
            method: "POST",
          })
          description.value = response.data.description
        } catch (error) {
          console.error("Failed to generate random description:", error)
          // Fallback to example text
          description.value = initialText
        } finally {
          loadingRandom.value = false
        }
      }
      break
  }
}

const generate = () => {
  if (description.value.trim()) {
    startTimer()
    emit("generate", description.value.trim())
  }
}

const props = defineProps<Props>()

// Watch for loading state changes to stop timer
watch(
  () => props.loading,
  (newLoading) => {
    if (!newLoading) {
      stopTimer()
    }
  },
)

onUnmounted(() => {
  stopTimer()
})
</script>

<style scoped>
.vhs-form-container {
  background: linear-gradient(
    135deg,
    rgba(42, 42, 42, 0.95) 0%,
    rgba(0, 0, 0, 0.95) 100%
  );
  border: 3px solid var(--vhs-cyan);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  position: relative;
  backdrop-filter: blur(10px);
  box-shadow:
    0 8px 32px rgba(0, 255, 255, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.vhs-form-container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--vhs-scan-lines);
  border-radius: 9px;
  pointer-events: none;
  opacity: 0.3;
}

/* Control Header */
.vhs-control-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--vhs-cyan);
}

.vhs-control-tabs {
  display: flex;
  gap: 1rem;
  position: relative;
  z-index: 1001;
}

.vhs-control-tab {
  background: rgba(0, 0, 0, 0.8);
  color: var(--vhs-orange);
  border: 1px solid var(--vhs-orange);
  padding: 0.25rem 0.5rem;
  font-family: "Space Mono", monospace;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: 0.5;
  transition: all 0.3s ease;
  cursor: pointer;
  border-radius: 4px;
}

.vhs-control-tab:hover:not(:disabled) {
  opacity: 0.8;
  box-shadow: 0 0 5px var(--vhs-orange);
}

.vhs-control-tab.active {
  opacity: 1;
  box-shadow: 0 0 10px var(--vhs-orange);
  animation: vhs-pulse 2s ease-in-out infinite;
}

.vhs-control-tab:disabled {
  cursor: not-allowed;
  opacity: 0.3;
}

.vhs-control-tab.loading {
  background: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0.8) 0%,
    var(--vhs-orange) 25%,
    rgba(0, 0, 0, 0.8) 50%,
    var(--vhs-orange) 75%,
    rgba(0, 0, 0, 0.8) 100%
  );
  background-size: 200% 100%;
  animation: vhs-tab-shimmer 1.5s linear infinite;
}

@keyframes vhs-tab-shimmer {
  0% {
    background-position: 0% center;
  }
  100% {
    background-position: 200% center;
  }
}

.vhs-timecode {
  font-family: "Space Mono", monospace;
  color: var(--vhs-cyan);
  font-size: 1.2rem;
  font-weight: 700;
  text-shadow: 0 0 5px currentColor;
  opacity: 0.7;
}

.vhs-timecode.active {
  opacity: 1;
  animation: vhs-blink 1s linear infinite;
}

/* Terminal Input */
.vhs-terminal-group {
  margin-bottom: 2rem;
}

.vhs-terminal-label {
  display: block;
  color: var(--vhs-cyan);
  font-family: "Space Mono", monospace;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  text-shadow: 0 0 5px currentColor;
  animation: vhs-cursor-blink 1.5s linear infinite;
}

.vhs-terminal-input {
  width: 100%;
  background: rgba(0, 0, 0, 0.9);
  border: 2px solid var(--vhs-cyan);
  border-radius: 6px;
  color: var(--vhs-cyan);
  font-family: "Space Mono", monospace;
  font-size: 1rem;
  padding: 1rem;
  resize: vertical;
  transition: all 0.3s ease;
  text-shadow: 0 0 3px currentColor;
}

.vhs-terminal-input::placeholder {
  color: rgba(0, 255, 255, 0.5);
  font-style: italic;
}

.vhs-terminal-input:focus {
  outline: none;
  box-shadow:
    0 0 0 3px rgba(0, 255, 255, 0.3),
    0 0 15px var(--vhs-cyan);
  border-color: var(--vhs-pink);
}

.vhs-terminal-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.vhs-terminal-input.vhs-glitch {
  animation: vhs-terminal-glitch 0.5s linear infinite;
}

/* VHS Play Button */
.vhs-button-area {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.vhs-play-button {
  background: linear-gradient(135deg, #1a1a1a 0%, #333 50%, #1a1a1a 100%);
  border: 3px solid var(--vhs-cyan);
  border-radius: 8px;
  color: var(--vhs-cyan);
  font-family: "Orbitron", monospace;
  font-weight: 700;
  padding: 1rem 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative;
  overflow: hidden;
  min-width: 200px;
  min-height: 60px;
  justify-content: center;
  text-shadow: 0 0 10px currentColor;
}

.vhs-play-button::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.3) 50%,
    transparent 100%
  );
  transition: left 0.5s ease;
}

.vhs-play-button:hover:not(:disabled)::before {
  left: 100%;
}

.vhs-play-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow:
    0 0 25px var(--vhs-cyan),
    0 8px 25px rgba(0, 255, 255, 0.4);
  border-color: var(--vhs-pink);
  color: var(--vhs-pink);
}

.vhs-play-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.vhs-play-button.loading {
  background: linear-gradient(
    45deg,
    #1a1a1a 0%,
    var(--vhs-pink) 15%,
    #1a1a1a 30%,
    var(--vhs-cyan) 45%,
    #1a1a1a 60%,
    var(--vhs-orange) 75%,
    #1a1a1a 100%
  );
  background-size: 300% 100%;
  animation: vhs-rainbow-shift 4s linear infinite;
}

.vhs-button-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
}

.vhs-play-icon {
  width: 0;
  height: 0;
  border-left: 10px solid currentColor;
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
  filter: drop-shadow(0 0 5px currentColor);
}

.vhs-button-text {
  font-size: 1rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

/* Status Bar */
.vhs-status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid rgba(0, 255, 255, 0.3);
}

.vhs-status-light {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: "Space Mono", monospace;
  font-size: 0.8rem;
  color: var(--vhs-text-cream);
  opacity: 0.5;
  transition: all 0.3s ease;
}

.vhs-status-light::before {
  content: "";
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
  box-shadow: 0 0 5px currentColor;
}

.vhs-status-light.active {
  color: var(--vhs-neon-green);
  opacity: 1;
  animation: vhs-status-pulse 2s ease-in-out infinite;
}

/* Animations */
@keyframes vhs-pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@keyframes vhs-blink {
  0%,
  50% {
    opacity: 1;
  }
  51%,
  100% {
    opacity: 0.3;
  }
}

@keyframes vhs-cursor-blink {
  0%,
  50% {
    opacity: 1;
  }
  51%,
  100% {
    opacity: 0;
  }
}

@keyframes vhs-terminal-glitch {
  0%,
  100% {
    transform: translateX(0);
  }
  20% {
    transform: translateX(-1px);
  }
  40% {
    transform: translateX(1px);
  }
  60% {
    transform: translateX(-1px);
  }
  80% {
    transform: translateX(1px);
  }
}

@keyframes vhs-rainbow-shift {
  0% {
    background-position: -100% center;
  }
  100% {
    background-position: 100% center;
  }
}

@keyframes vhs-status-pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .vhs-form-container {
    padding: 1.5rem;
  }

  .vhs-control-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .vhs-play-button {
    min-width: auto;
    width: 100%;
  }
}
</style>
