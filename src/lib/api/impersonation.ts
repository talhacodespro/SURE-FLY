/* =========================================
   Constants
========================================= */

export const ACCESS_TOKEN_KEY = 'token'

export const ORIGINAL_ADMIN_TOKEN_KEY = 'original-admin-token'

/* =========================================
   Save Original Admin Token
========================================= */

export const saveOriginalAdminToken = () => {
  const currentToken = localStorage.getItem(ACCESS_TOKEN_KEY)

  if (!currentToken) {
    return
  }

  /*
   * আগে থেকেই original admin token
   * save থাকলে overwrite করব না।
   */
  const existing = sessionStorage.getItem(ORIGINAL_ADMIN_TOKEN_KEY)

  if (existing) {
    return
  }

  sessionStorage.setItem(ORIGINAL_ADMIN_TOKEN_KEY, currentToken)
}

/* =========================================
   Is Impersonating Locally
========================================= */

export const hasOriginalAdminToken = () => {
  return Boolean(sessionStorage.getItem(ORIGINAL_ADMIN_TOKEN_KEY))
}

/* =========================================
   Exit Impersonation
========================================= */

export const exitImpersonation = () => {
  const adminToken = sessionStorage.getItem(ORIGINAL_ADMIN_TOKEN_KEY)

  if (!adminToken) {
    return
  }

  /*
   * Agent token remove হয়ে
   * original Admin token restore হবে।
   */
  localStorage.setItem(ACCESS_TOKEN_KEY, adminToken)

  sessionStorage.removeItem(ORIGINAL_ADMIN_TOKEN_KEY)

  /*
   * Axios / React Query / Auth Store
   * fresh token দিয়ে আবার load করার জন্য
   * full reload করছি।
   */
  window.location.href = '/profile'
}
