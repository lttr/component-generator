import { useLocalStorage, StorageSerializers } from "@vueuse/core"

export interface GenerationRecord {
  id: string
  timestamp: number
  description: string
  tailwindCode: string
  puleoCode: string
}

const MAX_HISTORY_SIZE = 50

export function useGenerationHistory() {
  // Initialize with empty array first
  const history = useLocalStorage<GenerationRecord[]>("component-history", [], {
    serializer: StorageSerializers.object,
  })

  const saveGeneration = (
    description: string,
    tailwindCode: string,
    puleoCode: string,
  ) => {
    const record: GenerationRecord = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      description,
      tailwindCode,
      puleoCode,
    }

    // Add to beginning of array
    history.value.unshift(record)

    // Limit history size
    if (history.value.length > MAX_HISTORY_SIZE) {
      history.value = history.value.slice(0, MAX_HISTORY_SIZE)
    }
  }

  const loadGeneration = (id: string) => {
    return history.value.find((record) => record.id === id)
  }

  const deleteGeneration = (id: string) => {
    const index = history.value.findIndex((record) => record.id === id)
    if (index !== -1) {
      history.value.splice(index, 1)
    }
  }

  const clearHistory = () => {
    history.value = []
  }

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp)
    const hours = date.getHours().toString().padStart(2, "0")
    const minutes = date.getMinutes().toString().padStart(2, "0")
    const seconds = date.getSeconds().toString().padStart(2, "0")
    return `${hours}:${minutes}:${seconds}`
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString()
  }

  const initializeWithExample = async () => {
    // Only initialize if history is empty
    if (history.value.length === 0) {
      const exampleRecord: GenerationRecord = {
        id: "example-card",
        timestamp: Date.now() - 86400000, // 24 hours ago
        description: exampleData.description,
        tailwindCode: exampleData.tailwindCodeWithStyle,
        puleoCode: exampleData.puleoCode,
      }
      history.value.push(exampleRecord)
    }
  }

  return {
    history: readonly(history),
    saveGeneration,
    loadGeneration,
    deleteGeneration,
    clearHistory,
    formatTimestamp,
    formatDate,
    initializeWithExample,
  }
}
