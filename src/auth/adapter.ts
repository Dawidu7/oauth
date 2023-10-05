import { eq } from "drizzle-orm"
import type { Adapter, InitializeAdapter } from "lucia"
import db from "~/db"
import { keys, sessions, users } from "~/db/schema"

type Error = {
  code: string
  message: string
}

export default function adapter(): InitializeAdapter<Adapter> {
  return LuciaError => ({
    getUser: async userId =>
      await db
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .limit(1)
        .then(rows => rows[0] ?? null),
    setUser: async (user, key) => {
      if (!key) {
        await db.insert(users).values(user)
        return
      }
      try {
        await db.transaction(async tx => {
          await tx.insert(users).values(user)
          await tx.insert(keys).values({
            ...key,
            userId: key.user_id,
            hashedPassword: key.hashed_password,
          })
        })
      } catch (e) {
        const error = e as Partial<Error>

        if (error.code === "P2002" && error.message?.includes("`id`")) {
          throw new LuciaError("AUTH_DUPLICATE_KEY_ID")
        }
        throw error
      }
    },
    deleteUser: async userId => {
      try {
        await db.delete(users).where(eq(users.id, userId))
      } catch (e) {
        const error = e as Partial<Error>

        if (error.code === "P2025") {
          return
        }
        throw error
      }
    },
    updateUser: async (userId, partialUser) => {
      await db.update(users).set(partialUser).where(eq(users.id, userId))
    },
    getSession: async sessionId =>
      await db
        .select()
        .from(sessions)
        .where(eq(sessions.id, sessionId))
        .limit(1)
        .then(rows => rows[0] ?? null),
    getSessionsByUserId: async userId =>
      await db.select().from(sessions).where(eq(sessions.userId, userId)),
    setSession: async session => {
      try {
        await db.insert(sessions).values({
          id: session.id,
          userId: session.user_id,
          activeExpires: session.active_expires,
          idleExpires: session.idle_expires,
        })
      } catch (e) {
        const error = e as Partial<Error>

        if (error.code === "P2003") {
          throw new LuciaError("AUTH_INVALID_USER_ID")
        }
        throw error
      }
    },
    deleteSession: async sessionId => {
      try {
        await db.delete(sessions).where(eq(sessions.id, sessionId))
      } catch (e) {
        const error = e as Partial<Error>

        if (error.code === "P2025") {
          return
        }
        throw error
      }
    },
    deleteSessionsByUserId: async userId => {
      await db.delete(sessions).where(eq(sessions.userId, userId))
    },
    updateSession: async (sessionId, partialSession) => {
      await db
        .update(sessions)
        .set(partialSession)
        .where(eq(sessions.id, sessionId))
    },
    getKey: async keyId =>
      await db
        .select()
        .from(keys)
        .where(eq(keys.id, keyId))
        .limit(1)
        .then(rows =>
          rows[0]
            ? {
                ...rows[0],
                user_id: rows[0].userId,
                hashed_password: rows[0].hashedPassword,
              }
            : null,
        ),
    getKeysByUserId: async userId =>
      await db
        .select()
        .from(keys)
        .where(eq(keys.userId, userId))
        .then(rows =>
          rows.map(row => ({
            ...row,
            user_id: row.userId,
            hashed_password: row.hashedPassword,
          })),
        ),
    setKey: async key => {
      console.log(key)
      try {
        await db.insert(keys).values({
          ...key,
          userId: key.user_id,
          hashedPassword: key.hashed_password,
        })
      } catch (e) {
        const error = e as Partial<Error>

        if (error.code === "P2003") {
          throw new LuciaError("AUTH_INVALID_USER_ID")
        }
        if (error.code === "P2002" && error.message?.includes("`id`")) {
          throw new LuciaError("AUTH_DUPLICATE_KEY_ID")
        }
        throw error
      }
    },
    deleteKey: async keyId => {
      try {
        await db.delete(keys).where(eq(keys.id, keyId))
      } catch (e) {
        const error = e as Partial<Error>

        if (error.code === "P2025") {
          return
        }
        throw error
      }
    },
    deleteKeysByUserId: async userId => {
      await db.delete(keys).where(eq(keys.userId, userId))
    },
    updateKey: async (keyId, partialKey) => {
      await db.update(keys).set(partialKey).where(eq(keys.id, keyId))
    },
  })
}
