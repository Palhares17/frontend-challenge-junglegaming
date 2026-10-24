import { AuthScreen, type AuthScreenProps } from "./components/auth-screen";

export function RegisterPage(props: Omit<AuthScreenProps, "mode">) {
  return <AuthScreen {...props} mode="register" />;
}
