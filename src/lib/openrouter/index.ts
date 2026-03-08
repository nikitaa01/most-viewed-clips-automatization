import { env } from "@/utils/env";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

export const openrouter = createOpenRouter({
  apiKey: env.OPEN_ROUTER_API_KEY,
});
