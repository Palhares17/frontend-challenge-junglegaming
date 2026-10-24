import { figmaAssets } from '@/core/lib/figma-assets';

const assets = figmaAssets.loginDesktop;
const pieces = [
  { asset: assets.vector, left: 1.422, top: 11.536 },
  { asset: assets.vector1, left: 10, top: 14.266 },
  { asset: assets.group, left: 0, top: 4.938 },
  { asset: assets.vector2, left: 9.414, top: 7.656 },
  { asset: assets.vector3, left: 10, top: 7.656 },
  { asset: assets.vector4, left: 1.422, top: 0 },
  { asset: assets.vector5, left: 10, top: 0 },
];

export function GoogleMark() {
  return (
    <span aria-hidden="true" className="relative block size-5 shrink-0">
      {pieces.map(({ asset, left, top }) => (
        <img
          key={asset.src}
          src={asset.src}
          width={asset.width}
          height={asset.height}
          alt=""
          className="absolute"
          style={{ left, top }}
        />
      ))}
    </span>
  );
}
