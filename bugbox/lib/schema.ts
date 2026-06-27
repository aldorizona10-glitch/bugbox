import { pgTable, text, timestamp, serial, integer } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
});

export type BugStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type BugPriority = 'low' | 'medium' | 'high' | 'critical';

export const bugs = pgTable('bugs', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull().default(''),
  status: text('status', { enum: ['open', 'in_progress', 'resolved', 'closed'] })
    .notNull()
    .default('open'),
  priority: text('priority', { enum: ['low', 'medium', 'high', 'critical'] })
    .notNull()
    .default('medium'),
  createdBy: integer('created_by')
    .notNull()
    .references(() => users.id),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

export const comments = pgTable('comments', {
  id: serial('id').primaryKey(),
  bugId: integer('bug_id')
    .notNull()
    .references(() => bugs.id, { onDelete: 'cascade' }),
  body: text('body').notNull(),
  authorId: integer('author_id')
    .notNull()
    .references(() => users.id),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
});

export type User = typeof users.$inferSelect;
export type Bug = typeof bugs.$inferSelect;
export type Comment = typeof comments.$inferSelect;
