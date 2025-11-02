import * as v from "valibot";

export function createApiResponseSchema<TSchema extends v.GenericSchema>(
  dataSchema: TSchema,
) {
  return v.object({
    statusCode: v.number(),
    message: v.string(),
    data: dataSchema,
  });
}

export const ApiErrorResponseSchema = v.object({
  statusCode: v.number(),
  message: v.string(),
});

export type ApiErrorResponse = v.InferOutput<typeof ApiErrorResponseSchema>;
