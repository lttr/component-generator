<template>
  <div class="vhs-history-panel" :class="{ 'panel-open': isOpen }">
    <!-- Toggle Button -->
    <button class="vhs-history-toggle" @click="togglePanel">
      <div class="vhs-tape-icon">
        <div class="vhs-tape-body"></div>
        <div class="vhs-tape-label">HIST</div>
      </div>
    </button>

    <!-- History Panel -->
    <div class="vhs-history-container">
      <div class="vhs-history-header">
        <div class="vhs-history-title vhs-glitch" data-text="RECORD HISTORY">
          RECORD HISTORY
        </div>
        <div class="vhs-history-controls">
          <div class="vhs-rec-indicator" :class="{ active: isRecording }">
            REC
          </div>
          <button
            class="vhs-clear-button"
            :disabled="history.length === 0"
            @click="handleClearHistory"
          >
            ERASE ALL
          </button>
        </div>
      </div>

      <div class="vhs-history-content">
        <div v-if="history.length === 0" class="vhs-no-history">
          NO RECORDINGS FOUND
        </div>

        <div v-else class="vhs-history-list">
          <div
            v-for="record of history"
            :key="record.id"
            class="vhs-history-item"
            :class="{ active: selectedId === record.id }"
          >
            <div class="vhs-tape-reel-mini"></div>

            <div class="vhs-record-info">
              <div class="vhs-record-timecode">
                {{ formatDate(record.timestamp) }}
                {{ formatTimestamp(record.timestamp) }}
              </div>
              <div class="vhs-record-description">
                {{ record.description.slice(0, 50)
                }}{{ record.description.length > 50 ? "..." : "" }}
              </div>
            </div>

            <div class="vhs-record-actions">
              <button
                class="vhs-play-mini"
                title="Load generation"
                @click="handleLoadRecord(record)"
              >
                <div class="vhs-play-icon-mini"></div>
              </button>
              <button
                class="vhs-eject-mini"
                title="Delete record"
                @click="handleDeleteRecord(record.id)"
              >
                ⏏
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="vhs-scan-line-history"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  isRecording?: boolean
  selectedId?: string
}

defineProps<Props>()

const emit = defineEmits<{
  loadGeneration: [record: GenerationRecord]
}>()

const { history, deleteGeneration, clearHistory, formatTimestamp, formatDate } =
  useGenerationHistory()

const isOpen = ref(false)

const togglePanel = () => {
  isOpen.value = !isOpen.value
}

const handleLoadRecord = (record: GenerationRecord) => {
  emit("loadGeneration", record)
}

const handleDeleteRecord = (id: string) => {
  deleteGeneration(id)
}

const handleClearHistory = () => {
  if (confirm("Are you sure you want to erase all recording history?")) {
    clearHistory()
  }
}
</script>

<style scoped>
.vhs-history-panel {
  position: fixed;
  top: 2rem;
  right: -380px;
  width: 400px;
  height: calc(100vh - 4rem);
  max-height: 700px;
  z-index: 1000;
  transition: right 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.vhs-history-panel.panel-open {
  right: 0;
}

.vhs-history-toggle {
  position: absolute;
  left: -60px;
  top: 2rem;
  width: 50px;
  height: 80px;
  background: linear-gradient(135deg, #1a1a1a 0%, #333 50%, #1a1a1a 100%);
  border: 2px solid var(--vhs-pink);
  border-radius: 8px 0 0 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.vhs-history-toggle:hover {
  background: linear-gradient(135deg, #333 0%, #555 50%, #333 100%);
  box-shadow: 0 0 15px var(--vhs-pink);
}

.vhs-tape-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.vhs-tape-body {
  width: 24px;
  height: 16px;
  background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
  border: 1px solid var(--vhs-cyan);
  border-radius: 2px;
  position: relative;
}

.vhs-tape-body::before {
  content: "";
  position: absolute;
  top: 2px;
  left: 2px;
  right: 2px;
  height: 2px;
  background: var(--vhs-cyan);
  border-radius: 1px;
}

.vhs-tape-label {
  font-family: "Space Mono", monospace;
  font-size: 8px;
  color: var(--vhs-cyan);
  font-weight: 700;
  letter-spacing: 0.5px;
}

.vhs-history-container {
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(26, 26, 26, 0.98) 0%,
    rgba(0, 0, 0, 0.98) 100%
  );
  border: 3px solid var(--vhs-pink);
  border-radius: 12px 0 0 12px;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
  box-shadow:
    -8px 0 32px rgba(255, 20, 147, 0.3),
    inset 1px 0 0 rgba(255, 255, 255, 0.1);
}

.vhs-history-container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--vhs-scan-lines);
  pointer-events: none;
  opacity: 0.2;
}

.vhs-history-header {
  padding: 1.5rem;
  border-bottom: 2px solid var(--vhs-pink);
  background: linear-gradient(
    135deg,
    rgba(42, 42, 42, 0.8) 0%,
    rgba(26, 26, 26, 0.8) 100%
  );
}

.vhs-history-title {
  font-family: "Orbitron", monospace;
  font-weight: 900;
  font-size: 1.2rem;
  color: var(--vhs-pink);
  text-align: center;
  margin-bottom: 1rem;
  letter-spacing: 0.1em;
  text-shadow: 0 0 10px var(--vhs-pink);
}

.vhs-history-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.vhs-rec-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: "Space Mono", monospace;
  font-size: 0.8rem;
  color: var(--vhs-text-cream);
  opacity: 0.5;
  transition: all 0.3s ease;
}

.vhs-rec-indicator::before {
  content: "";
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #666;
  box-shadow: 0 0 5px currentColor;
}

.vhs-rec-indicator.active {
  color: var(--vhs-pink);
  opacity: 1;
  animation: vhs-rec-pulse 1s ease-in-out infinite;
}

.vhs-rec-indicator.active::before {
  background: var(--vhs-pink);
  animation: vhs-rec-flash 0.5s ease-in-out infinite;
}

.vhs-clear-button {
  background: rgba(0, 0, 0, 0.8);
  color: var(--vhs-orange);
  border: 1px solid var(--vhs-orange);
  padding: 0.25rem 0.5rem;
  font-family: "Space Mono", monospace;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.vhs-clear-button:hover:not(:disabled) {
  background: var(--vhs-orange);
  color: #000;
  box-shadow: 0 0 10px var(--vhs-orange);
}

.vhs-clear-button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.vhs-history-content {
  height: calc(100% - 120px);
  overflow-y: auto;
  padding: 1rem;
}

.vhs-no-history {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-family: "Space Mono", monospace;
  color: var(--vhs-text-cream);
  font-size: 1rem;
  opacity: 0.7;
  text-align: center;
}

.vhs-history-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.vhs-history-item {
  background: linear-gradient(
    135deg,
    rgba(42, 42, 42, 0.6) 0%,
    rgba(26, 26, 26, 0.6) 100%
  );
  border: 1px solid var(--vhs-cyan);
  border-radius: 6px;
  padding: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.vhs-history-item::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: var(--vhs-pink);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.vhs-history-item:hover::before,
.vhs-history-item.active::before {
  opacity: 1;
}

.vhs-history-item:hover {
  border-color: var(--vhs-pink);
  box-shadow: 0 0 10px rgba(255, 20, 147, 0.3);
  background: linear-gradient(
    135deg,
    rgba(42, 42, 42, 0.8) 0%,
    rgba(26, 26, 26, 0.8) 100%
  );
}

.vhs-tape-reel-mini {
  width: 20px;
  height: 20px;
  background: radial-gradient(circle, #333 30%, #222 60%, #111 90%);
  border: 1px solid var(--vhs-cyan);
  border-radius: 50%;
  position: relative;
  flex-shrink: 0;
}

.vhs-tape-reel-mini::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 6px;
  height: 6px;
  background: #000;
  border: 1px solid var(--vhs-cyan);
  border-radius: 50%;
}

.vhs-record-info {
  flex: 1;
  min-width: 0;
}

.vhs-record-timecode {
  font-family: "Space Mono", monospace;
  font-size: 0.7rem;
  color: var(--vhs-cyan);
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.vhs-record-description {
  font-family: "Space Mono", monospace;
  font-size: 0.8rem;
  color: var(--vhs-text-cream);
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.vhs-record-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.vhs-play-mini,
.vhs-eject-mini {
  width: 24px;
  height: 24px;
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid var(--vhs-cyan);
  border-radius: 4px;
  color: var(--vhs-cyan);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  font-size: 0.7rem;
}

.vhs-play-mini:hover {
  background: var(--vhs-cyan);
  color: #000;
  box-shadow: 0 0 8px var(--vhs-cyan);
}

.vhs-eject-mini:hover {
  background: var(--vhs-orange);
  color: #000;
  border-color: var(--vhs-orange);
  box-shadow: 0 0 8px var(--vhs-orange);
}

.vhs-play-icon-mini {
  width: 0;
  height: 0;
  border-left: 6px solid currentColor;
  border-top: 4px solid transparent;
  border-bottom: 4px solid transparent;
  margin-left: 1px;
}

.vhs-scan-line-history {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    var(--vhs-pink) 50%,
    transparent 100%
  );
  animation: vhs-scan-history 4s ease-in-out infinite;
}

/* Animations */
@keyframes vhs-rec-pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@keyframes vhs-rec-flash {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}

@keyframes vhs-scan-history {
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
    transform: translateY(580px) scaleX(1);
    opacity: 1;
  }
  100% {
    transform: translateY(580px) scaleX(0);
    opacity: 0;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .vhs-history-panel {
    width: 100vw;
    right: -100vw;
    height: 100vh;
    top: 0;
    transform: none;
  }

  .vhs-history-container {
    border-radius: 0;
  }

  .vhs-history-toggle {
    display: none;
  }
}
</style>
