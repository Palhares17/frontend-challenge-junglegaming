import { figmaAssets } from '@/core/lib/figma-assets';
import { Icon } from '@/core/components/general/icon';
import { Button } from '@/core/components/ui/button';

export function AvatarField({
  onChange,
  onRemove,
  avatar,
}: {
  onChange: () => void;
  onRemove: () => void;
  avatar?: string;
}) {
  return (
    <div className="avatar-field">
      <p className="form-label">Avatar</p>
      <div className="flex min-h-10 flex-wrap items-center gap-6">
        <span className="flex size-[50px] items-center justify-center rounded-full border border-border bg-surface-control">
          {avatar ? (
            <img
              src={avatar}
              alt="Avatar do colecionador"
              className="size-full rounded-full object-cover"
            />
          ) : (
            <Icon asset={figmaAssets.profileDesktop.image2} />
          )}
        </span>
        <Button
          type="button"
          onClick={onChange}
          className="h-10 rounded-input px-6 text-[15px]"
        >
          Alterar
        </Button>
        <button type="button" onClick={onRemove} className="text-sm">
          Remover
        </button>
      </div>
    </div>
  );
}
