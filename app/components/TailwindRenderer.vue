<template>
  <BaseRenderer
    :component-code="componentCode"
    framework-name="Tailwind CSS"
    :cdn-url="appConfig.tailwindCdn"
    use-script-tag
  />
</template>

<script setup lang="ts">
interface Props {
  componentCode: string
}

defineProps<Props>()
const appConfig = useAppConfig()
</script>
