import type { User } from "lucia"

/// <reference types="lucia" />
declare namespace Lucia {
  type Auth = import("./lucia.ts").Auth
  type DatabaseUserAttributes = {} & User
  type DatabaseSessionAttributes = {}
}
