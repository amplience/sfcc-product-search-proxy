export interface Request {
  headers: {
    'x-auth-id': string,
    'x-auth-secret': string
  },
  body?: {
    search_text: string,
    catalog_id?: string,
    site_id: string,
    endpoint: string,
    page?: number
  }
}
