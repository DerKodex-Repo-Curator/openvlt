import type {
  DatabaseView,
  DatabaseViewConfig,
  DatabaseViewRow,
  DatabaseViewType,
  PropertyDefinition,
} from "@/types"

interface DatabaseViewQueryResult {
  view: DatabaseView
  rows: DatabaseViewRow[]
}

interface UpdateDatabaseViewPayload {
  name?: string
  viewType?: DatabaseViewType
  config?: DatabaseViewConfig
}

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as { error?: unknown }
    if (typeof data.error === "string" && data.error.length > 0) {
      return data.error
    }
  } catch {}

  return `${response.status} ${response.statusText}`.trim()
}

export async function fetchDatabaseView(
  viewId: string
): Promise<DatabaseViewQueryResult> {
  const response = await fetch(`/api/database-views/${viewId}`, {
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error(
      `Failed to load database view ${viewId}: ${await readErrorMessage(response)}`
    )
  }

  return (await response.json()) as DatabaseViewQueryResult
}

export async function fetchPropertyDefinitions(): Promise<PropertyDefinition[]> {
  const response = await fetch("/api/properties", {
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error(
      `Failed to load property definitions: ${await readErrorMessage(response)}`
    )
  }

  return (await response.json()) as PropertyDefinition[]
}

export async function updateDatabaseView(
  viewId: string,
  payload: UpdateDatabaseViewPayload
): Promise<DatabaseView> {
  const response = await fetch(`/api/database-views/${viewId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    keepalive: true,
  })

  if (!response.ok) {
    throw new Error(
      `Failed to update database view ${viewId}: ${await readErrorMessage(response)}`
    )
  }

  return (await response.json()) as DatabaseView
}
