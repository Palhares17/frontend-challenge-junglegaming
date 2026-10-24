interface FilterGroupProps {
  title: string;
  options: readonly { value: string; label: string }[];
  selected: string[];
  counts?: Record<string, number>;
  onToggle: (value: string) => void;
}

export function FilterGroup({
  title,
  options,
  selected,
  counts,
  onToggle,
}: FilterGroupProps) {
  return (
    <fieldset>
      <legend className="mb-3 text-lg leading-4 font-bold">{title}</legend>
      <div className="px-3">
        {options.map((option) => (
          <label
            key={option.value}
            className="group/filter relative block cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selected.includes(option.value)}
              onChange={() => onToggle(option.value)}
              className="peer sr-only"
            />
            <span className="pointer-events-none flex min-h-10 items-center justify-between gap-2 text-[15px] text-text-secondary peer-checked:text-text-accent peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring group-hover/filter:text-text-accent">
              {option.label}
              <span className="font-bold tabular-nums">
                {counts ? (
                  `(${counts[option.value] ?? 0})`
                ) : (
                  <span
                    aria-label="Carregando contagem"
                    className="skeleton-shimmer inline-block h-4 w-7"
                  />
                )}
              </span>
            </span>
            {selected.includes(option.value) && (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute top-3 -left-4 text-xs text-text-accent"
              >
                ✓
              </span>
            )}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
