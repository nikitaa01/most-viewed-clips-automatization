import { TEMP_DIR } from "@/constants/paths";
import { openrouter } from "@/lib/openrouter";
import { concurrentPool } from "@/utils/concurrent-pool";
import { Output, generateText } from "ai";
import { join } from "node:path";
import z from "zod";

const systemPrompt = `You are an expert Content Compliance Auditor. 
Your task is to analyze the audio of a Twitch clip for safety and Terms of Service (ToS) violations.

### CRITERIA FOR REJECTION:
1. SENSITIVE TOPICS / TOS: 
   - Self-harm, extreme hate speech, racial slurs, or real-world threats.
   - Note: Standard "Gamer Rage" (screaming, generic insults like "trash", "idiot") is usually allowed unless it crosses into hate speech or targeted harassment.

### ANALYSIS PROTOCOL:
1. Scan the audio for prohibited keywords or phrases.
2. Determine if the tone and content violate platform safety guidelines.`;

async function analyzeClipAudio(path: string) {
  const audioData = await Bun.file(path).arrayBuffer();

  const response = await generateText({
    model: openrouter("google/gemini-3-flash-preview", {
      reasoning: {
        effort: "low",
      },
    }),
    system: systemPrompt,
    output: Output.object({
      schema: z.object({
        sensitiveTopicsFound: z
          .boolean()
          .describe("True if hate speech, slurs, or threats are detected"),
        violationDetails: z
          .string()
          .describe("Description of the specific safety violation found"),
        reasoning: z
          .string()
          .describe("Analysis of the audio content regarding safety"),
        approved: z
          .boolean()
          .describe("True if the clip is safe for YouTube/Social Media"),
      }),
    }),
    messages: [
      {
        role: "user",
        content: [
          {
            type: "file",
            data: audioData,
            mediaType: "audio/m4a",
          },
          {
            type: "text",
            text: "Analyze this clip for safety violations.",
          },
        ],
      },
    ],
  });

  console.log(
    `[analyze-clips-audio] Safety Check for ${path}: ${
      response.output.approved ? "✅" : "❌"
    }`,
  );

  return {
    tokens: response.usage.totalTokens,
    id: path.split("/").pop()?.split(".")[0] ?? "",
    output: response.output,
  };
}

export async function analyzeClipsAudio(inputPaths: string[]): Promise<void> {
  if (inputPaths.length === 0) {
    console.error("[analyze-clips-audio] No clips to process.");
    return;
  }

  const results = await concurrentPool(inputPaths, analyzeClipAudio, {
    concurrency: 8,
    retries: 2,
  });

  await Bun.write(
    join(TEMP_DIR, "analyze-clips-audio-results.json"),
    JSON.stringify(results, null, 2),
  );
}
