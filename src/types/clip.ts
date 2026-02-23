import z from "zod";

export const clipsSchema = z.object({
  data: z.array(
    z.object({
      id: z.string(),
      url: z.string(),
      embed_url: z.string(),
      broadcaster_id: z.string(),
      broadcaster_name: z.string(),
      creator_id: z.string(),
      creator_name: z.string(),
      video_id: z.string(),
      game_id: z.string(),
      language: z.string(),
      title: z.string(),
      view_count: z.number(),
      created_at: z.string(),
      thumbnail_url: z.string(),
      duration: z.number(),
      vod_offset: z.number().nullable(),
      is_featured: z.boolean(),
    }),
  ),
  pagination: z.object({
    cursor: z.string().optional(),
  }),
});

export type Clip = z.infer<typeof clipsSchema>["data"][number];
