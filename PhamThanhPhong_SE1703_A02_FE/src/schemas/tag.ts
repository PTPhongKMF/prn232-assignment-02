import * as v from "valibot";
import { TagSchema as BaseTagSchema } from "./news.ts";

export const TagSchema = BaseTagSchema;

export const TagsResponseSchema = v.object({
  "@odata.context": v.string(),
  value: v.array(TagSchema),
});

export const CreateTagRequestSchema = v.object({
  tagName: v.string(),
  note: v.optional(v.string()),
});

export const UpdateTagRequestSchema = CreateTagRequestSchema;

export type Tag = v.InferOutput<typeof TagSchema>;
export type TagsResponse = v.InferOutput<typeof TagsResponseSchema>;
export type CreateTagRequest = v.InferOutput<typeof CreateTagRequestSchema>;
export type UpdateTagRequest = v.InferOutput<typeof UpdateTagRequestSchema>;


