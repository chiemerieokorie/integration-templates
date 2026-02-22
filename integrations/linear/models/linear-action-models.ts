import { z } from 'zod';

export const Entity = z.object({
    name: z.string()
});

export type Entity = z.infer<typeof Entity>;

export const Field = z.object({}).catchall(z.union([z.string(), z.record(z.string(), z.string())]));
export type Field = z.infer<typeof Field>;

export const FieldResponse = z.object({
    fields: Field.array()
});

export type FieldResponse = z.infer<typeof FieldResponse>;

export const Model = z.object({
    name: z.string()
});

export type Model = z.infer<typeof Model>;

export const ModelResponse = z.object({
    models: Model.array()
});

export type ModelResponse = z.infer<typeof ModelResponse>;
