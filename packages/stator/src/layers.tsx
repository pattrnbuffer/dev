import { createIdentityLayer } from './identity-layer';

export const [LayerDepth, useLayerCount] = createIdentityLayer(
  (parentId?: number) => {
    return parentId == null ? 0 : parentId + 1;
  },
);
