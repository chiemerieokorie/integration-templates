import { z } from 'zod';

export const AsanaPhoto = z.object({
    image_1024x1024: z.string(),
    image_128x128: z.string(),
    image_21x21: z.string(),
    image_27x27: z.string(),
    image_36x36: z.string(),
    image_60x60: z.string()
});

export type AsanaPhoto = z.infer<typeof AsanaPhoto>;

export const AsanaUser = z.object({
    gid: z.string(),
    resource_type: z.string(),
    name: z.string(),
    id: z.string(),
    email: z.string(),
    photo: z.union([AsanaPhoto, z.null()]),
    workspace: z.string()
});

export type AsanaUser = z.infer<typeof AsanaUser>;
