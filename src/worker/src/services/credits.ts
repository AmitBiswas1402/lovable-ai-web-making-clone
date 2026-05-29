import { Env } from "../types";

export interface UserCredits {
  remaining: number;
  total: number;
  plan: "free" | "pro";
  periodStart: string; // ISO date string
  periodEnd: string; // ISO date string
}

const DEFAULT_FREE_CREDITS = 50;

const UNLIMITED_CREDITS = -1; // Effectively unlimited for our use case

export const FREE_PROJECT_LIMIT = 3;

function createBillingPeriod(): { periodStart: string; periodEnd: string } {
  const now = new Date();
  const periodStart = new Date(now.getTime());
  const periodEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  return {
    periodStart: periodStart.toISOString(),
    periodEnd: periodEnd.toISOString(),
  };
}

async function checkAndResetPeriod(
  credits: UserCredits,
  userId: string,
  env: Env,
): Promise<UserCredits> {
  const now = new Date();
  const periodEnd = new Date(credits.periodEnd);
  // If current time is still within the billing period, return unchanged
  if (now < periodEnd) {
    return credits;
  }

  const newPeriod = createBillingPeriod();

  const resetPeriod: UserCredits = {
    ...credits,
    remaining:
      credits.plan === "pro" ? UNLIMITED_CREDITS : DEFAULT_FREE_CREDITS,
    periodStart: newPeriod.periodStart,
    periodEnd: newPeriod.periodEnd,
  };

  if (typeof env.METADATA.put === "function") {
    await env.METADATA.put(userId, JSON.stringify(resetPeriod));
  }

  return resetPeriod;
}

export async function getCredits(
  userId: string,
  env: Env,
): Promise<UserCredits> {
  const raw = await env.METADATA.get?.(`credits:${userId}`);

  if (raw) {
    try {
      const parsed = JSON.parse(raw) as UserCredits;
      return checkAndResetPeriod(parsed, userId, env);
    } catch (e) {
      // malformed — fall through to recreate
    }
  }

  const period = createBillingPeriod();

  const initial: UserCredits = {
    remaining: DEFAULT_FREE_CREDITS,
    total: DEFAULT_FREE_CREDITS,
    plan: "free",
    periodStart: period.periodStart,
    periodEnd: period.periodEnd,
  };

  if (typeof env.METADATA.put === "function") {
    await env.METADATA.put(`credits:${userId}`, JSON.stringify(initial));
  }

  return initial;
}
