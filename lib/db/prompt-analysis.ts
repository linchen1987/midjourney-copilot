import { eq } from 'drizzle-orm';
import { db, promptAnalysisTable } from './db';

type InputDateParam = { prompt?: string };

export async function recordUserInputPrompt({ prompt: string }: InputDateParam = {}) {
  const docs = await db
    .insert(promptAnalysisTable)
    .values({ prompt: string })
    .returning();
  return docs[0];
}

export async function updatePromptAnalysisTable({
  id,
  result,
  feedback,
}: { id?: string; result?: any; feedback?: 'good' | 'bad' } = {}) {
  if (!id) {
    throw new Error('id is required');
  }
  if (feedback && !['good', 'bad'].includes(feedback)) {
    throw new Error('feedback is invalid');
  }

  const data = await db.query.promptAnalysisTable.findFirst({
    where: eq(promptAnalysisTable.id, id),
  });

  if (!data) {
    throw new Error('record not found');
  }

  const updates: Record<string, any> = {};

  if (result) {
    updates.result = result;
  }
  if (feedback) {
    updates.feedback = feedback;
  }

  await db.update(promptAnalysisTable).set(updates).where(eq(promptAnalysisTable.id, id));
}
