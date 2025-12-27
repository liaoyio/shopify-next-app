import { deleteSessions, findSessionsByShop } from './session-storage'

export const AppInstallations = {
  async includes(shopDomain: string) {
    const shopSessions = await findSessionsByShop(shopDomain)

    if (shopSessions.length > 0) {
      for (const session of shopSessions) {
        if (session.accessToken) return true
      }
    }

    return false
  },

  async delete(shopDomain: string) {
    const shopSessions = await findSessionsByShop(shopDomain)
    if (shopSessions.length > 0) {
      await deleteSessions(shopSessions.map(session => session.id))
    }
  },
}
