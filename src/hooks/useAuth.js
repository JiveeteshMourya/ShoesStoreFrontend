import { useAppSelector } from "../store/hooks";

export function useAuth() {
  const { user, isAuthenticated, loading, initDone } = useAppSelector(state => state.auth);
  return {
    user,
    isAuthenticated,
    loading,
    initDone,
    role: user?.role ?? null,
    isBuyer: user?.role === "buyer",
    isSeller: user?.role === "seller",
    isAdmin: user?.role === "admin",
  };
}
