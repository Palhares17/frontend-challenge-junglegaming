import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/core/components/ui/tabs';
import type { NftPresentation } from '../../entities/nft-presentation.entity';

export function NftDescription({ nft }: { nft: NftPresentation }) {
  return (
    <Tabs defaultValue="details" className="nft-description">
      <TabsList variant="line" className="nft-description-tabs">
        <TabsTrigger value="details">Detalhes do NFT</TabsTrigger>
        <TabsTrigger value="reviews">
          Avaliações de colecionadores ({nft.ratingCount})
        </TabsTrigger>
      </TabsList>
      <TabsContent value="details">
        <div className="space-y-6 leading-6 text-text-secondary">
          {nft.story.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <dl className="mt-3 space-y-3 leading-6">
          {[
            ['Rede:', nft.networkInfo],
            ['Contrato:', nft.contractInfo],
            ['Direitos autorais:', nft.royaltyInfo],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="font-bold">{label}</dt>
              <dd className="text-text-secondary">{value}</dd>
            </div>
          ))}
        </dl>
      </TabsContent>
      <TabsContent value="reviews">
        <p className="py-8 text-text-secondary">
          As avaliações não estão disponíveis nesta prévia visual.
        </p>
      </TabsContent>
    </Tabs>
  );
}
