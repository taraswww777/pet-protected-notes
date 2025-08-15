import { schema } from "protected-notes-be/src/db";

export type UIRole = schema.RolesSelect & {
  userCount?: number;
};
