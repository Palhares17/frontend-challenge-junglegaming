import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter, useRouterState } from "@tanstack/react-router";
import { isAxiosError } from "axios";
import {
  parseCatalogSearch,
  defaultCatalogSearch,
  type CatalogSearch,
} from "@/feature/home/schemas/catalog-search.schema";
import {
  clearPrivateCache,
  logout,
  sessionOptions,
  type SessionUser,
} from "@/core/session/session";
import { useUnavailable } from "@/core/hooks/use-unavailable";
import { safeRedirect } from "./redirect";
import { FavoritesDialog } from "@/feature/favorites/views/favorites-dialog";
import { cartOptions } from "@/feature/cart/services/get-cart.service";
import { useMarketplaceRealtime } from "@/core/realtime/use-marketplace-realtime";
import { RoutePending } from "./route-feedback";

interface Navigation {
  catalogSearch: CatalogSearch;
  user: SessionUser | null;
  returnTo: string;
  cartCount: number;
  onAction: (label: string) => void;
  onSearch: (query: string) => void;
}
const NavigationContext = createContext<Navigation | null>(null);
export const useProductNavigation = () => useContext(NavigationContext);
const storageKey = "kurio:catalog-search";
const isPrivate = (path: string) =>
  /^\/(checkout|account|orders)(\/|$)/.test(path);
function rememberedCatalog() {
  try {
    return parseCatalogSearch(
      JSON.parse(sessionStorage.getItem(storageKey) ?? "{}"),
    );
  } catch {
    return defaultCatalogSearch;
  }
}

export function ProductNavigation({ children }: { children: ReactNode }) {
  useEffect(() => { document.getElementById('root')?.removeAttribute('inert'); }, []);
  const router = useRouter();
  const client = router.options.context.queryClient;
  const location = useRouterState({ select: (state) => state.location });
  const session = useQuery(sessionOptions);
  const cart = useQuery(cartOptions);
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  useMarketplaceRealtime(session.data);
  const notify = useUnavailable();
  const [remembered, setRemembered] = useState(rememberedCatalog);
  const searchJson = JSON.stringify(location.search);
  const catalogSearch =
    location.pathname === "/"
      ? parseCatalogSearch(location.search)
      : remembered;
  useEffect(() => {
    if (location.pathname !== "/") return;
    const search = parseCatalogSearch(JSON.parse(searchJson));
    setRemembered(search);
    try {
      sessionStorage.setItem(storageKey, JSON.stringify(search));
    } catch {
      /* Storage can be unavailable. */
    }
  }, [location.pathname, searchJson]);
  useEffect(
    () =>
      client.getQueryCache().subscribe((event) => {
        if (
          event.type === "updated" &&
          event.action.type === "error" &&
          event.query.queryKey[0] === "private" &&
          isAxiosError(event.action.error) &&
          event.action.error.response?.status === 401
        ) {
          client.setQueryData(sessionOptions.queryKey, { user: null });
        }
      }),
    [client],
  );
  useEffect(
    () =>
      client.getMutationCache().subscribe((event) => {
        if (
          event.type === "updated" &&
          event.action.type === "error" &&
          isAxiosError(event.action.error) &&
          event.action.error.response?.status === 401 &&
          event.mutation.options.meta?.public !== true
        ) {
          client.setQueryData(sessionOptions.queryKey, { user: null });
        }
      }),
    [client],
  );
  useEffect(() => {
    if (
      session.isSuccess &&
      !session.data.user &&
      isPrivate(location.pathname)
    ) {
      void clearPrivateCache(client).then(() =>
        router.navigate({
          to: "/login",
          search: { redirect: safeRedirect(location.href) },
          replace: true,
        }),
      );
    }
  }, [
    session.isSuccess,
    session.data?.user,
    location.pathname,
    location.href,
    client,
    router,
  ]);
  const signOut = useMutation({
    mutationFn: logout,
    onSuccess: async () => {
      await router.navigate({ to: "/", search: catalogSearch, replace: true });
      await clearPrivateCache(client);
      client.setQueryData(sessionOptions.queryKey, { user: null });
    },
    onError: () => notify("Não foi possível sair. Tente novamente."),
  });
  const home = () => {
    void router.navigate({ to: "/", search: catalogSearch });
  };
  function onAction(label: string) {
    switch (label) {
      case "Seus favoritos":
        void client.query(sessionOptions).then(resolved => {
          if (resolved.user) setFavoritesOpen(true);
          else void router.navigate({ to: '/login', search: { redirect: safeRedirect(location.href) } });
        }).catch(() => notify('Não foi possível carregar a sessão. Tente novamente.'));
        break;
      case "Início":
      case "Mercado":
      case "Continuar explorando":
      case "Coleções":
        home();
        break;
      case "Carrinho":
      case "Carrinho de NFTs":
        void router.navigate({ to: "/cart" });
        break;
      case "Conectar e finalizar":
        void router.navigate({ to: "/checkout" });
        break;
      case "Entrar na Kurio":
        void router.navigate({
          to: "/login",
          search: { redirect: safeRedirect(location.href) },
        });
        break;
      case "Meu perfil":
      case "Dados do perfil":
        void router.navigate({ to: "/account/profile" });
        break;
      case "Carteiras":
        void router.navigate({ to: "/account/wallets" });
        break;
      case "Trocar carteira":
      case "Adicionar carteira secundária":
      case "Adicionar carteira":
        void router.navigate({ to: "/account/wallets" });
        break;
      case "Sair":
        if (!signOut.isPending) signOut.mutate();
        break;
      case "Voltar":
        if (location.pathname === "/checkout")
          void router.navigate({ to: "/cart" });
        else home();
        break;
      default:
        notify(label);
    }
  }
  return (
    <NavigationContext.Provider
      value={{
        catalogSearch,
        returnTo: safeRedirect(location.href),
        cartCount:
          cart.data?.items.reduce((total, item) => total + item.quantity, 0) ??
          0,
        user: session.data?.user ?? null,
        onAction,
        onSearch: (q) => {
          void router.navigate({
            to: "/",
            search: { ...catalogSearch, q, page: 1 },
            hash: "catalogo",
          });
        },
      }}
    >
      <FavoritesDialog
        open={favoritesOpen && !!session.data?.user}
        onOpenChange={setFavoritesOpen}
      />
      {session.isSuccess &&
      !session.data.user &&
      isPrivate(location.pathname) ? (
        <RoutePending />
      ) : (
        children
      )}
    </NavigationContext.Provider>
  );
}
