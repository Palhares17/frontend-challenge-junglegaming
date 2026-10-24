import { useUnavailable } from '@/core/hooks/use-unavailable';
import { Link } from '@tanstack/react-router';
import { useProductNavigation } from '@/core/router/navigation';

export function FooterLinks({
  title,
  links,
}: {
  title: string;
  links: string[];
}) {
  const notify = useUnavailable();
  const navigation = useProductNavigation();
  return (
    <section>
      <h2 className="text-lg leading-4 font-bold">{title}</h2>
      <ul className="mt-2 text-sm leading-[30px]">
        {links.map((link) => (
          <li key={link}>
            {navigation && link === 'Meu perfil' ? (
              <Link
                to="/account/profile"
                preload={false}
                className="text-left hover:text-text-accent"
              >
                {link}
              </Link>
            ) : (
              <button
                type="button"
                className="text-left hover:text-text-accent"
                onClick={() => notify(link)}
              >
                {link}
              </button>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
