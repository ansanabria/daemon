import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const messages = sqliteTable("messages", {
  id: text("id").primaryKey(),
  chatId: text("chat_id").notNull(),
  role: text("role", { enum: ["user", "assistant", "system", "data"] }).notNull(),
  content: text("content").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(current_timestamp)`),
});

export const videos = sqliteTable("videos", {
  id: text("id").primaryKey(),
  chatId: text("chat_id").notNull(),
  title: text("title").notNull(),
  prompt: text("prompt").notNull(),
  status: text("status", { enum: ["pending", "processing", "ready", "failed"] })
    .notNull()
    .default("pending"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(current_timestamp)`),
});

