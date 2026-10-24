interface FooterBenefitProps {
  mark: string;
  title: string;
  description: string;
}

export function FooterBenefit({
  mark,
  title,
  description,
}: FooterBenefitProps) {
  return (
    <section className="flex min-w-0 flex-col gap-3">
      <span
        aria-hidden="true"
        className="flex size-[74px] items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground"
      >
        {mark}
      </span>
      <h2 className="text-[17px] leading-4 font-bold">{title}</h2>
      <p className="max-w-[204px] text-body text-text-secondary">
        {description}
      </p>
    </section>
  );
}
