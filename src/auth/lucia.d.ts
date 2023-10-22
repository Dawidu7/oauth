/// <reference types="lucia" />
declare namespace Lucia {
  type Auth = import("./lucia.ts").Auth
  type DatabaseUserAttributes = import("../db/schema.ts").User
  type DatabaseSessionAttributes = {}
}
