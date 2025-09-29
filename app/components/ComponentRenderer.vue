<template>
  <div class="vhs-monitor-container">
    <!-- VHS Monitor Header -->
    <div class="vhs-monitor-header">
      <div class="vhs-view-switcher">
        <button
          class="vhs-view-btn"
          :class="{ active: viewMode === 'dual' }"
          @click="viewMode = 'dual'"
        >
          DUAL
        </button>
        <button
          class="vhs-view-btn"
          :class="{ active: viewMode === 'tailwind' }"
          @click="viewMode = 'tailwind'"
        >
          CH-A
        </button>
        <button
          class="vhs-view-btn"
          :class="{ active: viewMode === 'puleo' }"
          @click="viewMode = 'puleo'"
        >
          CH-B
        </button>
      </div>
      <div class="vhs-monitor-brand">CLAUDE VISION™ DUAL-SYNC</div>
      <button class="vhs-code-toggle" @click="showCode = !showCode">
        {{ showCode ? "HIDE CODE" : "SHOW CODE" }}
      </button>
    </div>

    <!-- Dual Monitor Display -->
    <div class="vhs-screen-container" :class="viewMode">
      <div
        v-if="viewMode === 'dual' || viewMode === 'tailwind'"
        class="vhs-screen-bezel"
      >
        <TailwindRenderer
          :component-code="tailwindCode"
          :component-css="tailwindCss"
          :show-code="showCode"
        />
      </div>
      <div
        v-if="viewMode === 'dual' || viewMode === 'puleo'"
        class="vhs-screen-bezel"
      >
        <PuleoRenderer :component-code="puleoCode" :show-code="showCode" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  tailwindCode: string
  tailwindCss?: string
  puleoCode: string
}

defineProps<Props>()

type ViewMode = "dual" | "tailwind" | "puleo"
const viewMode = ref<ViewMode>("dual")
const showCode = ref<boolean>(false)
</script>

<style scoped>
.vhs-monitor-container {
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%);
  border: 3px solid var(--vhs-orange);
  border-radius: 16px;
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
  box-shadow:
    0 12px 48px rgba(0, 0, 0, 0.8),
    inset 0 2px 0 rgba(255, 255, 255, 0.1),
    0 0 30px rgba(255, 140, 0, 0.3);
}

.vhs-monitor-container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--vhs-scan-lines);
  opacity: 0.2;
  pointer-events: none;
  z-index: 1;
}

/* Monitor Header */
.vhs-monitor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding: 0.75rem 1rem;
  background: linear-gradient(90deg, #333 0%, #555 50%, #333 100%);
  border: 2px solid var(--vhs-cyan);
  border-radius: 8px;
  position: relative;
  z-index: 10;
}

.vhs-view-switcher {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: linear-gradient(90deg, #222 0%, #333 50%, #222 100%);
  border: 2px solid var(--vhs-cyan);
  border-radius: 8px;
  padding: 0.25rem;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.8);
}

.vhs-view-btn {
  font-family: "Space Mono", monospace;
  font-weight: 700;
  font-size: 0.75rem;
  color: var(--vhs-cyan);
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  border: 1px solid var(--vhs-cyan);
  border-radius: 4px;
  padding: 0.4rem 0.8rem;
  cursor: pointer;
  letter-spacing: 0.05em;
  text-shadow: 0 0 5px currentColor;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.vhs-view-btn::before {
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

.vhs-view-btn:hover {
  background: linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%);
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.5);
  text-shadow: 0 0 10px currentColor;
}

.vhs-view-btn:hover::before {
  left: 100%;
}

.vhs-view-btn.active {
  background: linear-gradient(135deg, var(--vhs-cyan) 0%, #4dd2e5 100%);
  color: #000;
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.8);
  box-shadow:
    0 0 20px var(--vhs-cyan),
    inset 0 1px 0 rgba(255, 255, 255, 0.5);
}

.vhs-monitor-brand {
  font-family: "Orbitron", monospace;
  font-weight: 700;
  font-size: 0.9rem;
  color: var(--vhs-orange);
  text-shadow: 0 0 8px currentColor;
  letter-spacing: 0.1em;
  text-align: center;
  flex-grow: 1;
}

.vhs-code-toggle {
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

.vhs-code-toggle::before {
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

.vhs-code-toggle:hover {
  background: linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%);
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.5);
  text-shadow: 0 0 10px currentColor;
}

.vhs-code-toggle:hover::before {
  left: 100%;
}

/* Screen Container */
.vhs-screen-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
  position: relative;
  z-index: 10;
  transition: all 0.3s ease;
}

.vhs-screen-container.tailwind,
.vhs-screen-container.puleo {
  grid-template-columns: 1fr;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.vhs-screen-bezel {
  background: transparent;
  border: none;
  border-radius: 0;
  padding: 0;
  position: relative;
  overflow: visible;
  min-height: 400px;
  display: flex;
  flex-direction: column;
}

.vhs-screen-bezel::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(
      ellipse at center,
      transparent 70%,
      rgba(0, 255, 255, 0.1) 100%
    ),
    var(--vhs-scan-lines);
  border-radius: 9px;
  pointer-events: none;
  z-index: 1;
}

.vhs-screen-bezel::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    var(--vhs-cyan) 50%,
    transparent 100%
  );
  animation: vhs-screen-scan 4s ease-in-out infinite;
  z-index: 2;
  opacity: 0.6;
}

/* Control Bar */
.vhs-control-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
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
}

/* Shared sticker styling */
.vhs-warning-label,
.vhs-serial-label,
.vhs-inspection-label {
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

.vhs-serial-label {
  background: linear-gradient(
    135deg,
    rgba(200, 200, 200, 0.8) 0%,
    rgba(240, 240, 240, 0.8) 100%
  );
  border-color: rgba(150, 150, 150, 0.6);
  color: rgba(0, 0, 0, 0.9);
  transform: rotate(1deg);
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

.vhs-tape-counter {
  display: flex;
  gap: 0.125rem;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.7) 0%,
    rgba(20, 20, 20, 0.7) 100%
  );
  border: 2px solid rgba(0, 255, 255, 0.5);
  border-radius: 2px;
  padding: 0.2rem 0.4rem;
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(0, 255, 255, 0.2);
  transform: rotate(0.5deg);
  opacity: 0.7;
}

.vhs-counter-digit {
  font-family: "Space Mono", monospace;
  font-size: 0.9rem;
  font-weight: 700;
  color: rgba(0, 255, 255, 0.9);
  text-shadow: 0 0 3px rgba(0, 255, 255, 0.5);
  min-width: 0.6rem;
  text-align: center;
}

.vhs-mode-indicator {
  background: linear-gradient(
    135deg,
    rgba(0, 0, 150, 0.8) 0%,
    rgba(100, 100, 255, 0.8) 100%
  );
  border: 2px solid rgba(0, 0, 100, 0.6);
  border-radius: 2px;
  color: rgba(255, 255, 255, 0.95);
  font-family: "Space Mono", monospace;
  font-size: 0.55rem;
  font-weight: 900;
  padding: 0.2rem 0.4rem;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  transform: rotate(1.5deg);
  opacity: 0.7;
}

.vhs-tracking-control {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-family: "Space Mono", monospace;
  font-size: 0.8rem;
  color: rgba(255, 140, 0, 0.6);
  text-shadow: 0 0 5px rgba(255, 140, 0, 0.3);
  opacity: 0.7;
}

.vhs-tracking-slider {
  width: 100px;
  height: 6px;
  background: #222;
  border: 1px solid var(--vhs-orange);
  border-radius: 3px;
  position: relative;
  overflow: hidden;
}

.vhs-tracking-indicator {
  width: 20px;
  height: 4px;
  background: var(--vhs-orange);
  border-radius: 2px;
  position: absolute;
  top: 50%;
  left: 40%;
  transform: translateY(-50%);
  box-shadow: 0 0 8px var(--vhs-orange);
  animation: vhs-tracking-drift 6s ease-in-out infinite;
}

/* Animations */

@keyframes vhs-screen-scan {
  0%,
  100% {
    transform: translateY(0);
    opacity: 0;
  }
  10% {
    opacity: 0.6;
  }
  90% {
    transform: translateY(400px);
    opacity: 0.6;
  }
  100% {
    transform: translateY(400px);
    opacity: 0;
  }
}

@keyframes vhs-tracking-drift {
  0%,
  100% {
    left: 40%;
  }
  25% {
    left: 35%;
  }
  50% {
    left: 45%;
  }
  75% {
    left: 38%;
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .vhs-monitor-container {
    padding: 1rem;
  }

  .vhs-monitor-header {
    flex-direction: column;
    gap: 0.75rem;
    text-align: center;
  }

  .vhs-screen-container {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .vhs-screen-bezel {
    min-height: 300px;
  }

  .vhs-control-bar {
    flex-direction: column;
    gap: 1rem;
  }

  .vhs-tracking-control {
    justify-content: center;
  }
}

/* Channel Labels Animation */
.vhs-channel-label {
  animation: vhs-channel-flicker 4s ease-in-out infinite;
}

.vhs-channel-label:nth-child(1) {
  animation-delay: 0s;
}

.vhs-channel-label:nth-child(3) {
  animation-delay: 2s;
}

@keyframes vhs-channel-flicker {
  0%,
  90%,
  100% {
    opacity: 1;
  }
  95% {
    opacity: 0.7;
  }
}
</style>
