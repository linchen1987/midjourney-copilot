import { eq, sql } from 'drizzle-orm';
import { db, usagesTable } from './db';
import { getCurrentDate } from '@/lib/utils';

const totalTimes = Number(process.env.TOTAL_TIMES_PER_DAY || 100);

type InputDateParam = { date?: string };

export async function increaseUsedTimes({ date: inputDate }: InputDateParam = {}) {
  const date = inputDate || getCurrentDate();
  const exist = await db.query.usagesTable.findFirst({
    where: eq(usagesTable.date, date),
  });

  if (exist) {
    await db
      .update(usagesTable)
      .set({ usedTimes: sql`${usagesTable.usedTimes} + 1` })
      .where(eq(usagesTable.date, date));
    return;
  }
  await db.insert(usagesTable).values({ date, usedTimes: 1 });
}

export async function getUsedTimes({ date: inputDate }: InputDateParam = {}) {
  const date = inputDate || getCurrentDate();
  const data = await db.query.usagesTable.findFirst({
    where: eq(usagesTable.date, date),
  });
  return data?.usedTimes || 0;
}

export async function getRemainingTimes({ date: inputDate }: InputDateParam = {}) {
  const date = inputDate || getCurrentDate();
  const usage = await db.query.usagesTable.findFirst({
    where: eq(usagesTable.date, date),
  });

  const usedTimes = usage?.usedTimes || 0;
  const remainingTimes = Math.max(totalTimes - usedTimes, 0);
  return remainingTimes;
}
