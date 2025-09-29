<template>
  <BaseRenderer
    :component-code="componentCode"
    :component-css="componentCss"
    framework-name="tailwind"
  />
</template>

<script setup lang="ts">
interface Props {
  componentCode: string
  componentCss?: string
}

defineProps<Props>()
</script>
