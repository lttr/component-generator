<template>
  <BaseRenderer
    :component-code="componentCode"
    framework-name="Puleo CSS"
    :cdn-url="appConfig.puleoCdn"
  />
</template>

<script setup lang="ts">
interface Props {
  componentCode: string
}

defineProps<Props>()
const appConfig = useAppConfig()
</script>
