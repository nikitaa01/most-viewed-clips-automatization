import { $ } from "bun";
import { CLIPS_PATH } from "../constants/paths";
import { clipsSchema } from "../types/clip";
import type { Clip } from "../types/clip";
import { getTwitchOAuthHeaders } from "../lib/twitch/auth";
import { env } from "../utils/env";

export async function fetchClips(gameId: string): Promise<Clip[]> {
  const headers = await getTwitchOAuthHeaders();

  const sevenDaysBefore = new Date();
  sevenDaysBefore.setDate(sevenDaysBefore.getDate() - 7);
  const endedAt = new Date().toISOString();

  const allEnClips: Clip[] = [];
  let cursor: string | undefined;

  console.log(
    `[fetch-clips] Fetching clips (until ${env.TARGET_DURATION_SECONDS / 60} minutes of clips or no more pages)...`,
  );

  let hasMore = true;
  while (hasMore) {
    const url = new URL("https://api.twitch.tv/helix/clips");
    url.searchParams.set("game_id", gameId);
    url.searchParams.set("started_at", sevenDaysBefore.toISOString());
    url.searchParams.set("ended_at", endedAt);
    url.searchParams.set("first", "20");
    if (cursor) url.searchParams.set("after", cursor);

    const res = await fetch(url.toString(), { method: "GET", headers });
    const parsed = clipsSchema.parse(await res.json());

    allEnClips.push(...parsed.data.filter((c) => c.language === "en"));
    cursor = parsed.pagination.cursor;

    const enDuration = allEnClips.reduce((acc, c) => acc + c.duration, 0);

    console.log(
      `[fetch-clips] Fetched ${allEnClips.length} clips, ~${Math.round(enDuration / 60)} min`,
    );

    if (enDuration >= env.TARGET_DURATION_SECONDS) {
      console.log(
        `[fetch-clips] Reached ${env.TARGET_DURATION_SECONDS / 60} minutes of clips, stopping.`,
      );
      hasMore = false;
    } else if (!cursor || parsed.data.length === 0) {
      console.log("[fetch-clips] No more clips, stopping.");
      hasMore = false;
    }
  }

  const clipsData = { data: allEnClips, pagination: { cursor } };
  await $`echo ${JSON.stringify(clipsData, null, 2)} > ${CLIPS_PATH}`;
  console.log("[save-clips-data] Clips saved");

  return allEnClips;
}
