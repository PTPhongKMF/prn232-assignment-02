import * as v from "valibot";

export const TagSchema = v.object({
  tagId: v.number(),
  tagName: v.string(),
  note: v.string(),
});

export const NewsArticleSchema = v.object({
  newsArticleId: v.number(),
  newsTitle: v.string(),
  headline: v.string(),
  createdDate: v.string(),
  newsContent: v.string(),
  newsSource: v.string(),
  newsStatus: v.boolean(),
  modifiedDate: v.string(),
  categoryId: v.number(),
  categoryName: v.string(),
  createdById: v.number(),
  authorName: v.string(),
  tags: v.array(TagSchema),
});

export const AuthorStatSchema = v.object({
  authorId: v.number(),
  authorName: v.string(),
  articleCount: v.number(),
});

export const CategoryStatSchema = v.object({
  categoryId: v.number(),
  categoryName: v.string(),
  articleCount: v.number(),
});

export const TagStatSchema = v.object({
  tagId: v.number(),
  tagName: v.string(),
  articleCount: v.number(),
});

export const StatisticDataSchema = v.object({
  startDate: v.nullable(v.string()),
  endDate: v.nullable(v.string()),
  totalNewsCount: v.number(),
  totalAuthorsCount: v.number(),
  newsList: v.array(NewsArticleSchema),
  authorStats: v.array(AuthorStatSchema),
  categoryStats: v.array(CategoryStatSchema),
  tagStats: v.array(TagStatSchema),
});

export const StatisticResponseSchema = v.object({
  statusCode: v.number(),
  message: v.string(),
  data: StatisticDataSchema,
});

export type Tag = v.InferOutput<typeof TagSchema>;
export type NewsArticle = v.InferOutput<typeof NewsArticleSchema>;
export type AuthorStat = v.InferOutput<typeof AuthorStatSchema>;
export type CategoryStat = v.InferOutput<typeof CategoryStatSchema>;
export type TagStat = v.InferOutput<typeof TagStatSchema>;
export type StatisticData = v.InferOutput<typeof StatisticDataSchema>;
export type StatisticResponse = v.InferOutput<typeof StatisticResponseSchema>;
