import { artwork } from "@/core/lib/assets";
import type { Nft } from "@/core/entities/nft.entity";
import { collectionOptions } from "../schemas/catalog-search.schema";

const names = [
  ["Emerald Ape #042", artwork.emerald, "1.19"],
  ["Sage Nomad #009", artwork.sage, "1.69"],
  ["Neon Vessel #552", artwork.neon, "1.99"],
  ["Cosmic Bloom #118", artwork.sage, "1.29"],
  ["Violet Nomad #314", artwork.sage, "1.39"],
  ["Ivory Baron #088", artwork.neon, "1.79"],
  ["Golden Beat #207", artwork.golden, "0.99"],
  ["Golden Frequency #071", artwork.golden, "0.59"],
  ["Golden Signal #160", artwork.golden, "0.39"],
] as const;

const counts = [33, 12, 65, 39, 23, 17, 19, 13, 18];
let sequence = 0;

export const catalogFixtures: Nft[] = collectionOptions.flatMap(
  (collection, group) =>
    Array.from({ length: counts[group] }, (_, index) => {
      const id = sequence++;
      const [name, image, price] = names[index % names.length];
      return {
        id: `nft-${id + 1}`,
        name:
          group === 0 && index < 9
            ? name
            : `${name.split(" #")[0]} #${String(id + 1).padStart(3, "0")}`,
        image,
        imageAlt:
          image === artwork.emerald
            ? "Macaco com óculos e jaqueta verde"
            : image === artwork.sage
              ? "Macaco com chapéu e roupa roxa"
              : image === artwork.neon
                ? "Macaco de pelagem escura e paletó"
                : "Macaco dourado com fones de ouvido",
        price,
        ...(index === 2 ? { previousPrice: "2.29" } : {}),
        collection: collection.value,
        network: ["ethereum", "polygon", "solana"][id % 3],
        isNew: index % 2 === 0,
        isTrending: index % 3 === 0,
        isRare: index === 2,
      };
    }),
);
