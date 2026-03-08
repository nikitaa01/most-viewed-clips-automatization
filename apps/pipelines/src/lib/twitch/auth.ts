import { env } from "@/utils/env";
import z from "zod";

const twitchOAuthTokenSchema = z.object({
  access_token: z.string(),
  expires_in: z.number(),
  token_type: z.literal("bearer"),
});

let oauthToken: string | null = null;
let oauthTokenExpiresAt: Date | null = null;

export async function getTwitchOAuthToken() {
  if (oauthTokenExpiresAt && oauthTokenExpiresAt <= new Date()) {
    oauthToken = null;
    oauthTokenExpiresAt = null;
  }
  if (oauthToken && oauthTokenExpiresAt && oauthTokenExpiresAt > new Date()) {
    return oauthToken;
  }

  const auth = await fetch("https://id.twitch.tv/oauth2/token", {
    method: "POST",
    body: new URLSearchParams({
      client_id: env.TWITCH_CLIENT_ID,
      client_secret: env.TWITCH_CLIENT_SECRET,
      grant_type: "client_credentials",
    }),
  });

  const parsed = twitchOAuthTokenSchema.safeParse(await auth.json());

  if (!parsed.success) {
    throw new Error("Failed to parse Twitch OAuth token");
  }

  oauthToken = parsed.data.access_token;
  oauthTokenExpiresAt = new Date(Date.now() + parsed.data.expires_in * 1000);

  return oauthToken;
}

export async function getTwitchOAuthHeaders() {
  return {
    Authorization: `Bearer ${await getTwitchOAuthToken()}`,
    "Client-ID": env.TWITCH_CLIENT_ID,
  };
}
