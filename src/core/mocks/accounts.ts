import type {
  CollectorProfile,
  Network,
  Wallet,
} from "@/core/entities/marketplace.entity";
import type { Session, SessionUser } from "@/core/session/session";
import { getCart, mergeGuestCart } from "./cart";
import {
  readDatabase,
  readLocal,
  writeLocal,
  removeLocal,
  sessionKey,
  transaction,
  nextId,
  type Database,
} from "./database";
import {
  emailInput,
  invalid,
  missing,
  MockError,
  objectInput,
  passwordInput,
  text,
} from "./errors";

export function publicUser(profile: CollectorProfile): SessionUser {
  return { id: profile.id, name: profile.displayName, email: profile.email };
}
export function mockSession(): {
  userId: string;
  expiresAt: number;
  id: string;
} | null {
  try {
    const raw = JSON.parse(readLocal(sessionKey) ?? "null");
    if (
      !raw ||
      typeof raw.expiresAt !== "number" ||
      raw.expiresAt <= Date.now() ||
      typeof raw.userId !== "string" ||
      !Object.hasOwn(readDatabase().accounts, raw.userId)
    )
      return null;
    return raw;
  } catch (error) {
    if (error instanceof MockError) throw error;
    return null;
  }
}

export function mockUser(): SessionUser | null {
  const session = mockSession();
  return session
    ? publicUser(readDatabase().accounts[session.userId].profile)
    : null;
}

export function requireUser(): string {
  return (
    mockSession()?.userId ??
    (() => {
      throw new MockError(
        401,
        "UNAUTHORIZED",
        "Sessão expirada. Entre novamente.",
      );
    })()
  );
}

export function cartOwner() {
  return mockSession()?.userId ?? "guest";
}

export async function hashPassword(password: string, salt = "") {
  return Array.from(
    new Uint8Array(
      await crypto.subtle.digest(
        "SHA-256",
        new TextEncoder().encode(salt + password),
      ),
    ),
  )
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function signIn(value: unknown): Promise<Session> {
  const input = objectInput(value);
  if (typeof input.email !== "string" || typeof input.password !== "string")
    throw new MockError(
      401,
      "INVALID_CREDENTIALS",
      "E-mail ou senha inválidos.",
    );
  const account = Object.values(readDatabase().accounts).find(
    (item) =>
      item.profile.email === (input.email as string).trim().toLowerCase(),
  );
  if (
    !account ||
    (await hashPassword(input.password, account.salt)) !== account.passwordHash
  )
    throw new MockError(
      401,
      "INVALID_CREDENTIALS",
      "E-mail ou senha inválidos.",
    );
  const userId = account.profile.id;
  const previous = readLocal(sessionKey);
  const previousOwner = mockSession()?.userId;
  const sessionId = crypto.randomUUID();
  writeLocal(
    sessionKey,
    JSON.stringify({
      userId,
      id: sessionId,
      expiresAt: Date.now() + 30 * 60_000,
    }),
  );
  try {
    transaction((db) => {
      getCart(db, userId);
      mergeGuestCart(db, userId);
      if (previousOwner) db.connections[previousOwner] = null;
      db.connections[userId] = null;
    });
  } catch (error) {
    if (previous) writeLocal(sessionKey, previous);
    else removeLocal(sessionKey);
    throw error;
  }
  return { user: publicUser(account.profile), sessionId };
}
function usernameInput(value: unknown) {
  const username = text(value, "username", 30).toLowerCase();
  if (!/^[a-z0-9_]{3,30}$/.test(username))
    invalid({ username: "Use 3 a 30 letras, números ou sublinhado." });
  return username;
}
function uniqueAccount(
  db: Database,
  email: string,
  username: string,
  except?: string,
) {
  const fields: Record<string, string> = {};
  for (const item of Object.values(db.accounts)) {
    if (item.profile.id === except) continue;
    if (item.profile.email === email) fields.email = "E-mail já cadastrado.";
    if (item.profile.username === username)
      fields.username = "Nome de usuário indisponível.";
  }
  if (Object.keys(fields).length)
    throw new MockError(
      409,
      "ACCOUNT_CONFLICT",
      "Conta já cadastrada.",
      fields,
    );
}
export async function register(value: unknown): Promise<CollectorProfile> {
  const input = objectInput(value);
  const email = emailInput(input.email);
  const username = usernameInput(input.username);
  const password = passwordInput(input.password, input.confirmPassword);
  const salt = crypto.randomUUID();
  const passwordHash = await hashPassword(password, salt);
  return transaction((db) => {
    uniqueAccount(db, email, username);
    const id = nextId(db, "collector");
    // Seed IDs use collector-1/2; generated account IDs have a separate prefix.
    const profile: CollectorProfile = {
      id: `registered-${id}`,
      displayName: username,
      username,
      email,
      ens: "",
      walletAlias: "",
      avatar: null,
    };
    db.accounts[profile.id] = { profile, salt, passwordHash };
    db.wallets[profile.id] = [];
    return profile;
  });
}
export function updateProfile(
  db: Database,
  owner: string,
  value: unknown,
): CollectorProfile {
  const input = objectInput(value);
  const profile = db.accounts[owner].profile;
  const next = { ...profile };
  if ("displayName" in input)
    next.displayName = text(input.displayName, "displayName");
  if ("username" in input) next.username = usernameInput(input.username);
  if ("email" in input) next.email = emailInput(input.email);
  if ("ens" in input) {
    if (
      typeof input.ens !== "string" ||
      (input.ens && !/^[a-z0-9-]+\.eth$/i.test(input.ens))
    )
      invalid({ ens: "ENS inválido; use nome.eth ou deixe vazio." });
    next.ens = input.ens;
  }
  if ("walletAlias" in input) {
    if (typeof input.walletAlias !== "string" || input.walletAlias.length > 80)
      invalid({ walletAlias: "Apelido inválido." });
    next.walletAlias = input.walletAlias;
  }
  uniqueAccount(db, next.email, next.username, owner);
  db.accounts[owner].profile = next;
  return next;
}
export async function changePassword(owner: string, value: unknown) {
  const input = objectInput(value);
  const account = readDatabase().accounts[owner];
  const oldHash = account.passwordHash;
  if (
    typeof input.currentPassword !== "string" ||
    (await hashPassword(input.currentPassword, account.salt)) !== oldHash
  )
    invalid({ currentPassword: "Senha atual incorreta." });
  const password = passwordInput(input.password, input.confirmPassword);
  const salt = crypto.randomUUID();
  const passwordHash = await hashPassword(password, salt);
  transaction((db) => {
    if (db.accounts[owner].passwordHash !== oldHash)
      throw new MockError(
        409,
        "PASSWORD_CHANGED",
        "A senha já foi alterada. Entre novamente.",
      );
    db.accounts[owner].salt = salt;
    db.accounts[owner].passwordHash = passwordHash;
  });
}
export function updateAvatar(db: Database, owner: string, value: unknown) {
  const avatar = objectInput(value).avatar;
  if (
    avatar !== null &&
    (typeof avatar !== "string" ||
      avatar.length > 1_000_000 ||
      !/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/]+=*$/.test(avatar))
  )
    invalid({
      avatar:
        "Envie PNG, JPEG ou WebP base64 de até 1 MB, ou null para remover.",
    });
  db.accounts[owner].profile.avatar = avatar;
  return db.accounts[owner].profile;
}
export function networkInput(value: unknown): Network {
  if (value !== "ethereum" && value !== "polygon" && value !== "solana")
    invalid({ network: "Rede inválida." });
  return value;
}
export function saveWallet(
  db: Database,
  owner: string,
  value: unknown,
  id?: string,
): Wallet {
  const input = objectInput(value);
  const wallets = (db.wallets[owner] ??= []);
  const current = id
    ? (wallets.find((wallet) => wallet.id === id) ?? missing())
    : undefined;
  if (!id && wallets.length >= 2)
    throw new MockError(
      409,
      "WALLET_LIMIT",
      "Cadastre no máximo duas carteiras.",
    );
  const network = networkInput(input.network ?? current?.network);
  const address = text(input.address ?? current?.address, "address", 100);
  if (
    !(network === "solana"
      ? /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address)
      : /^0x[a-fA-F0-9]{40}$/.test(address))
  )
    invalid({ address: "Endereço incompatível com a rede." });
  if (
    wallets.some(
      (wallet) =>
        wallet.id !== id &&
        wallet.network === network &&
        (network === "solana"
          ? wallet.address === address
          : wallet.address.toLowerCase() === address.toLowerCase()),
    )
  )
    throw new MockError(409, "WALLET_CONFLICT", "Carteira já cadastrada.");
  if (input.primary !== undefined && typeof input.primary !== "boolean")
    invalid({ primary: "Informe true ou false." });
  const wallet: Wallet = {
    id: id ?? nextId(db, "wallet"),
    label: text(input.label ?? current?.label, "label", 80),
    network,
    address,
    primary:
      wallets.length === 0 ||
      (input.primary as boolean | undefined) === true ||
      (input.primary === undefined && !!current?.primary),
  };
  if (wallet.primary)
    wallets.forEach((item) => {
      item.primary = false;
    });
  if (current) Object.assign(current, wallet);
  else wallets.push(wallet);
  if (!wallets.some((item) => item.primary)) wallets[0].primary = true;
  if (db.connections[owner]?.walletId === wallet.id)
    db.connections[owner] = null;
  return wallet;
}
