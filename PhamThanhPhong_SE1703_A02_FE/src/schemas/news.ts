import * as v from "valibot";

export const TagSchema = v.object({
  TagId: v.number(),
  TagName: v.string(),
  Note: v.optional(v.string()),
});

export const NewsArticleSchema = v.object({
  NewsArticleId: v.number(),
  NewsTitle: v.string(),
  Headline: v.optional(v.string()),
  CreatedDate: v.string(),
  NewsContent: v.optional(v.string()),
  NewsSource: v.optional(v.string()),
  NewsStatus: v.optional(v.boolean()),
  ModifiedDate: v.optional(v.string()),
  CategoryId: v.optional(v.number()),
  CategoryName: v.optional(v.string()),
  CreatedById: v.optional(v.number()),
  AuthorName: v.optional(v.string()),
  Tags: v.optional(v.array(TagSchema)),
});

export const NewsArticlesResponseSchema = v.object({
  "@odata.context": v.string(),
  value: v.array(NewsArticleSchema),
});

export const TagsResponseSchema = v.object({
  "@odata.context": v.string(),
  value: v.array(TagSchema),
});

export const CreateNewsRequestSchema = v.object({
  newsTitle: v.string(),
  headline: v.optional(v.string()),
  newsContent: v.optional(v.string()),
  newsSource: v.optional(v.string()),
  categoryId: v.optional(v.number()),
  tagIds: v.optional(v.array(v.number())),
  newsStatus: v.optional(v.boolean()),
});

export const UpdateNewsRequestSchema = v.object({
  newsTitle: v.optional(v.string()),
  headline: v.optional(v.string()),
  newsContent: v.optional(v.string()),
  newsSource: v.optional(v.string()),
  categoryId: v.optional(v.number()),
  tagIds: v.optional(v.array(v.number())),
  newsStatus: v.optional(v.boolean()),
});

export type Tag = v.InferOutput<typeof TagSchema>;
export type NewsArticle = v.InferOutput<typeof NewsArticleSchema>;
export type NewsArticlesResponse = v.InferOutput<
  typeof NewsArticlesResponseSchema
>;
export type CreateNewsRequest = v.InferOutput<typeof CreateNewsRequestSchema>;
export type UpdateNewsRequest = v.InferOutput<typeof UpdateNewsRequestSchema>;
export type TagsResponse = v.InferOutput<typeof TagsResponseSchema>;
