<template>
  <div class="container">
    <h1 class="title">Component Generator</h1>
    <GeneratorForm :loading="loading" @generate="handleGenerate" />
    <DualComponentRenderer
      v-if="tailwindComponent || puleoComponent"
      :tailwind-code="tailwindComponent"
      :puleo-code="puleoComponent"
    />
  </div>
</template>

<script setup lang="ts">
const tailwindComponent = ref<string>("")
const puleoComponent = ref<string>("")
const loading = ref<boolean>(false)

const handleGenerate = async (description: string) => {
  loading.value = true
  try {
    // Call both APIs in parallel
    const [tailwindResponse, puleoResponse] = await Promise.all([
      $fetch<{
        success: boolean
        data: { component: string }
      }>("/api/generate-component", {
        method: "POST",
        body: { description },
      }),
      $fetch<{
        success: boolean
        data: { component: string }
      }>("/api/generate-component-puleo", {
        method: "POST",
        body: { description },
      }),
    ])

    tailwindComponent.value = tailwindResponse.data.component
    puleoComponent.value = puleoResponse.data.component
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
