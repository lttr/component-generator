<template>
  <div class="form-container">
    <div class="form-group">
      <label for="description">Component Description</label>
      <textarea
        id="description"
        v-model="description"
        :disabled="loading"
        placeholder="A card component with heading, subheading, text, date and link to read more"
        class="description-input"
        rows="4"
      >
      </textarea>
    </div>
    <button
      :disabled="loading || !description.trim()"
      class="generate-btn"
      @click="generate"
    >
      {{ loading ? "Generating..." : "Generate Component" }}
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  loading?: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  generate: [description: string]
}>()

const initialText =
  "A card component with heading, subheading, text, date and link to read more"
const description = ref<string>(initialText)

const generate = () => {
  if (description.value.trim()) {
    emit("generate", description.value.trim())
  }
}
</script>

<style scoped>
.form-container {
  background: #f7fafc;
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
}

.form-group {
  margin-bottom: 1.5rem;
}

.description-input {
  width: 100%;
  padding: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  transition: border-color 0.2s ease;
}

.description-input:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
}

.description-input:disabled {
  background-color: #f7fafc;
  cursor: not-allowed;
}

.generate-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.generate-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.generate-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}
</style>
