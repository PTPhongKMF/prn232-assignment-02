import * as v from "valibot";

export const CategorySchema = v.object({
  CategoryId: v.number(),
  CategoryName: v.string(),
  CategoryDesciption: v.string(),
  IsActive: v.boolean(),
  Deleteable: v.boolean(),
});

export type Category = v.InferOutput<typeof CategorySchema>;

export const CategoriesResponseSchema = v.object({
  "@odata.context": v.string(),
  value: v.array(CategorySchema),
});

export type CategoriesResponse = v.InferOutput<typeof CategoriesResponseSchema>;

export const CreateCategoryRequestSchema = v.object({
  categoryName: v.string(),
  categoryDesciption: v.string(),
  isActive: v.boolean(),
});
export type CreateCategoryRequest = v.InferOutput<
  typeof CreateCategoryRequestSchema
>;

export const UpdateCategoryRequestSchema = v.object({
  categoryName: v.optional(v.string()),
  categoryDesciption: v.optional(v.string()),
  isActive: v.optional(v.boolean()),
});
export type UpdateCategoryRequest = v.InferOutput<
  typeof UpdateCategoryRequestSchema
>;
