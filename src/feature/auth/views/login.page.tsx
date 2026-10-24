import { AuthScreen, type AuthScreenProps } from "./components/auth-screen";

export function LoginPage(props: Omit<AuthScreenProps, "mode">) {
  return <AuthScreen {...props} mode="login" />;
}
