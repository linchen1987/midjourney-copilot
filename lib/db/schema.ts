import {
  pgTable,
  serial,
  text,
  integer,
  smallint,
  timestamp,
  uuid,
  date,
  json,
} from 'drizzle-orm/pg-core';

export const promptAnalysisTable = pgTable('mjtool_prompt_analysis', {
  id: uuid('uuid1').primaryKey().defaultRandom(),
  prompt: text('room_name'),
  result: json('result'),
  feedback: text('feedback', { enum: ['good', 'bad'] }),
  createdAt: timestamp('created_at').defaultNow(),
});

export const usagesTable = pgTable('mjtool_usages', {
  id: serial('id').primaryKey(),
  date: date('date'),
  usedTokens: integer('used_tokens'),
  usedTimes: smallint('used_times'),
  createdAt: timestamp('created_at').defaultNow(),
});
