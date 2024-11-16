import { z } from 'zod';

export const layerRenameSchema = z.object({
  id: z.string(),
  n: z.string(),
});

export const renameLayersResponseSchema = z.object({
  renamedLayers: z
    .array(layerRenameSchema),
});
