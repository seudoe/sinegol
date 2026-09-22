"use server";

import { requireAdmin } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { drawRandomNumbers } from "@/lib/draw/random";
import { drawAlgorithmicNumbers } from "@/lib/draw/algorithmic";
import { matchNumbers } from "@/lib/draw/matcher";
import { calculatePrizePerWinner } from "@/lib/draw/prize-calculator";
import { revalidatePath } from "next/cache";
import { logger } from "@/lib/logger";

export async function simulateDraw(method: "random" | "algorithmic", prizePool: number, username: string) {
  await requireAdmin(username);
  const admin = createAdminClient();
  
  const { data: allScores, error } = await admin.from("golf_scores").select("*").order("played_date", { ascending: false });
  if (error) throw new Error(error.message);

  const userTickets = new Map<string, number[]>();
  for (const s of (allScores || [])) {
    const ticket = userTickets.get(s.user_id) || [];
    if (ticket.length < 5 && !ticket.includes(s.score)) {
      ticket.push(s.score);
    }
    userTickets.set(s.user_id, ticket);
  }
  
  let numbers: number[] = [];
  if (method === "random") {
    numbers = drawRandomNumbers();
  } else {
    // @ts-expect-error
    numbers = drawAlgorithmicNumbers(allScores || []);
  }
  
  const tierCounts = { 3: 0, 4: 0, 5: 0 };
  for (const ticket of userTickets.values()) {
    const { tier } = matchNumbers(ticket, numbers);
    if (tier) tierCounts[tier]++;
  }
  
  return {
    numbers,
    prizes: {
      3: calculatePrizePerWinner(3, prizePool, tierCounts[3]),
      4: calculatePrizePerWinner(4, prizePool, tierCounts[4]),
      5: calculatePrizePerWinner(5, prizePool, tierCounts[5])
    },
    winnerCounts: tierCounts
  };
}

export async function publishDraw(month: string, method: "random" | "algorithmic", prizePool: number, numbers: number[], username: string) {
  await requireAdmin(username);
  const admin = createAdminClient();
  
  const { data: draw, error: drawError } = await admin.from("draws").insert({
    month,
    method,
    numbers,
    status: "published",
    published_at: new Date().toISOString()
  }).select().single();
  
  if (drawError || !draw) {
    logger.error("action:draw", "Failed to create draw", { error: drawError?.message });
    throw new Error("Failed to create draw");
  }

  const { data: allScores } = await admin.from("golf_scores").select("*").order("played_date", { ascending: false });
  const userTickets = new Map<string, number[]>();
  for (const s of (allScores || [])) {
    const ticket = userTickets.get(s.user_id) || [];
    if (ticket.length < 5 && !ticket.includes(s.score)) {
      ticket.push(s.score);
    }
    userTickets.set(s.user_id, ticket);
  }

  const winnersToInsert = [];
  const tierCounts = { 3: 0, 4: 0, 5: 0 };
  const pendingWinners = [];

  for (const [userId, ticket] of userTickets.entries()) {
    const { tier } = matchNumbers(ticket, numbers);
    if (tier) {
      pendingWinners.push({ userId, tier });
      tierCounts[tier]++;
    }
  }

  const prizes = {
    3: calculatePrizePerWinner(3, prizePool, tierCounts[3]),
    4: calculatePrizePerWinner(4, prizePool, tierCounts[4]),
    5: calculatePrizePerWinner(5, prizePool, tierCounts[5])
  };

  for (const pw of pendingWinners) {
    winnersToInsert.push({
      draw_id: draw.id,
      user_id: pw.userId,
      match_tier: pw.tier,
      prize_amount: prizes[pw.tier],
      verification_status: "pending",
      payout_status: "pending"
    });
  }

  if (winnersToInsert.length > 0) {
    await admin.from("winners").insert(winnersToInsert);
  }

  logger.info("action:draw", "Successfully published draw", { drawId: draw.id, winners: winnersToInsert.length });
  revalidatePath(`/admin/${username}/draws`);
  return { success: true };
}
