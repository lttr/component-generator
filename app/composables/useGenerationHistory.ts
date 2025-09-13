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
  // Initialize with example if empty
  const initializeExample = (): GenerationRecord[] => [
    {
      id: "example-card",
      timestamp: Date.now() - 86400000, // 24 hours ago
      description:
        "A card component with heading, subheading, text, date and link to read more",
      tailwindCode: `<article
  href="#"
  class="block max-w-[40ch] rounded-md border border-gray-300 p-4 shadow-sm sm:p-6"
>
  <header class="mt-4 sm:mt-0">
    <h2 class="text-lg font-medium text-balance text-gray-900">
      Yet another generated component thing
    </h2>
    <h3 class="mt-1 text-sm text-gray-700">By John Doe</h3>
  </header>

  <p class="mt-4 text-sm text-pretty text-gray-700">
    Lorem ipsum dolor sit, amet consectetur adipisicing elit. At velit illum
    provident a, ipsa maiores deleniti consectetur nobis et eaque.
  </p>

  <footer class="mt-4 flex items-center justify-between gap-2 text-sm">
    <span class="text-gray-700">31/06/2025</span>
    <a href="#" class="underline hover:no-underline">Read more</a>
  </footer>
</article>`,
      puleoCode: `<style>
  .card {
    max-width: 40ch;
    border: var(--border-2);
    border-radius: var(--radius-2);
    padding: var(--space-4);
    box-shadow: var(--shadow-3);
  }

  .content {
    margin-top: var(--space-2);
  }

  .subheading {
    font-size: var(--font-size--1);
    color: var(--text-color-2);
  }

  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>

<article href="#" class="card p-stack">
  <header class="content p-flow">
    <h2 class="p-heading-4">Yet another generated component thing</h2>
    <h3 class="subheading">By John Doe</h3>
  </header>

  <p>
    Lorem ipsum dolor sit, amet consectetur adipisicing elit. At velit illum
    provident a, ipsa maiores deleniti consectetur nobis et eaque.
  </p>

  <foter class="footer">
    <span class="">31/06/2025</span>
    <a href="#" class="">Read more</a>
  </foter>
</article>`,
    },
  ]

  const history = useLocalStorage<GenerationRecord[]>(
    "component-history",
    initializeExample(),
    {
      serializer: StorageSerializers.object,
    },
  )

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

  return {
    history: readonly(history),
    saveGeneration,
    loadGeneration,
    deleteGeneration,
    clearHistory,
    formatTimestamp,
    formatDate,
  }
}
