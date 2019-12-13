export interface Request {
  headers: {
    'x-auth-id': string,
    'x-auth-secret': string
  },
  body?: Body,
  query?: Query
}

interface Body extends SFCCContext {
  search_text: string,
  catalog_id?: string
}

interface Query extends SFCCContext {
  ids: any[]
}

interface SFCCContext {
  site_id: string,
  endpoint: string,
  page?: number
}
