<template>
  <BaseRenderer
    :component-code="componentCode"
    :component-css="componentCss"
    framework-name="Tailwind CSS"
  />
</template>

<script setup lang="ts">
interface Props {
  componentCode: string
  componentCss?: string
}

defineProps<Props>()
</script>
