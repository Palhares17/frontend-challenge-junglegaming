import { mkdir } from 'node:fs/promises';
import sharp from 'sharp';

const sources = {
  emerald: 'desktop-frame136.png',
  sage: 'desktop-nft-artwork18.png',
  neon: 'desktop-nft-artwork05.png',
  golden: 'desktop-nft-artwork09.png',
};

await mkdir('public/assets/artwork', { recursive: true });
for (const [name, source] of Object.entries(sources)) {
  const input = `public/assets/figma/${source}`;
  const output = `public/assets/artwork/${name}.webp`;
  await sharp(input).webp({ lossless: true, effort: 6 }).toFile(output);
  const originalPixels = await sharp(input).raw().toBuffer();
  const webPixels = await sharp(output).raw().toBuffer();
  if (!originalPixels.equals(webPixels)) {
    throw new Error(`Lossless artwork verification failed: ${name}`);
  }
  for (const width of [320, 640, 960]) {
    await sharp(input).resize(width).webp({ quality: 90, effort: 6 }).toFile(`public/assets/artwork/${name}-${width}.webp`);
  }
  console.log(`${name}: lossless original verified; responsive WebP quality 90 generated`);
}
