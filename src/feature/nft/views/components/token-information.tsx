import type { NftPresentation } from '../../entities/nft-presentation.entity';

export function TokenInformation({ nft }: { nft: NftPresentation }) {
  return (
    <dl className="space-y-3 text-[15px] text-text-subtle">
      <div>
        <dt className="inline">ID do token: </dt>
        <dd className="inline">{nft.tokenId}</dd>
      </div>
      <div>
        <dt className="inline">Coleção: </dt>
        <dd className="inline">{nft.collectionName}</dd>
      </div>
      <div>
        <dt className="inline">Atributos: </dt>
        <dd className="inline">{nft.attributes}</dd>
      </div>
    </dl>
  );
}
