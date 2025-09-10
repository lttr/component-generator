<template>
  <div class="container">
    <h1 class="title">Component Generator</h1>
    <GeneratorForm :loading="loading" @generate="handleGenerate" />
    <ComponentRenderer
      v-if="generatedComponent"
      :component-code="generatedComponent"
    />
  </div>
</template>

<script setup lang="ts">
const generatedComponent = ref<string>("")
const loading = ref<boolean>(false)

const handleGenerate = async (description: string) => {
  loading.value = true
  try {
    const response = await $fetch<{
      success: boolean
      data: { component: string }
    }>("/api/generate-component", {
      method: "POST",
      body: { description },
    })
    generatedComponent.value = response.data.component
  } catch (error) {
    console.error("Failed to generate component:", error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.title {
  font-size: 3rem;
  text-align: center;
  margin-bottom: 2rem;
  color: #2d3748;
}
</style>
