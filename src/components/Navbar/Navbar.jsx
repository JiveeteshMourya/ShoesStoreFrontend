import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  LuUser,
  LuLogOut,
  LuMenu,
  LuX,
  LuChevronDown,
  LuPackage,
  LuLayoutDashboard,
} from "react-icons/lu";
import { useAuth } from "../../hooks/useAuth";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { logoutThunk } from "../../store/slices/authSlice";
import { toggleMobileMenu, closeMobileMenu } from "../../store/slices/uiSlice";
import { useToast } from "../../hooks/useToast";

export default function Navbar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const { user, isAuthenticated, isSeller, isBuyer } = useAuth();
  const categories = useAppSelector(s => s.categories.items);
  const mobileMenuOpen = useAppSelector(s => s.ui.mobileMenuOpen);

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [catMenuOpen, setCatMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const catMenuRef = useRef(null);

  useEffect(() => {
    dispatch(closeMobileMenu());
    setUserMenuOpen(false);
    setCatMenuOpen(false);
  }, [location.pathname, dispatch]);

  useEffect(() => {
    const handleClick = e => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
      if (catMenuRef.current && !catMenuRef.current.contains(e.target)) setCatMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = async () => {
    await dispatch(logoutThunk());
    toast.success("Signed out successfully");
    navigate("/");
  };

  const navLink =
    "text-sm text-[var(--color-secondary)] hover:text-[var(--color-primary)] transition-colors";

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-background)]/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="text-lg font-semibold tracking-tight text-[var(--color-primary)]">
          Sole <span className="text-[var(--color-accent)]">&</span> Co.
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link to="/products" className={navLink}>
            All Products
          </Link>

          {categories.length > 0 && (
            <div className="relative" ref={catMenuRef}>
              <button
                onClick={() => setCatMenuOpen(v => !v)}
                className={`flex items-center gap-1 ${navLink}`}
              >
                Categories <LuChevronDown size={14} />
              </button>
              {catMenuOpen && (
                <div className="absolute left-0 top-full mt-2 min-w-[180px] rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-background)] py-2 shadow-lg">
                  {categories.map(c => (
                    <Link
                      key={c._id}
                      to={`/products?category=${c.slug}`}
                      className="block px-4 py-2 text-sm text-[var(--color-secondary)] hover:bg-[var(--color-surface)] hover:text-[var(--color-primary)]"
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(v => !v)}
                className="flex items-center gap-2 rounded-full border border-[var(--color-border)] px-3 py-1.5 text-sm text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-colors"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-accent)] text-xs font-semibold text-white">
                  {user?.firstName?.[0]?.toUpperCase()}
                </div>
                <span className="hidden sm:inline">{user?.firstName}</span>
                <LuChevronDown size={13} />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 min-w-[180px] rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-background)] py-2 shadow-lg">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--color-secondary)] hover:bg-[var(--color-surface)] hover:text-[var(--color-primary)]"
                  >
                    <LuUser size={14} /> Profile
                  </Link>
                  {isBuyer && (
                    <Link
                      to="/orders"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--color-secondary)] hover:bg-[var(--color-surface)] hover:text-[var(--color-primary)]"
                    >
                      <LuPackage size={14} /> My Orders
                    </Link>
                  )}
                  {isSeller && (
                    <Link
                      to="/seller"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--color-secondary)] hover:bg-[var(--color-surface)] hover:text-[var(--color-primary)]"
                    >
                      <LuLayoutDashboard size={14} /> Dashboard
                    </Link>
                  )}
                  <div className="my-1 border-t border-[var(--color-border)]" />
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-[var(--color-error)] hover:bg-red-50"
                  >
                    <LuLogOut size={14} /> Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-sm text-[var(--color-secondary)] hover:text-[var(--color-primary)] transition-colors"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="rounded-[var(--radius-sm)] bg-[var(--color-primary)] px-4 py-2 text-sm text-[var(--color-background)] hover:bg-[var(--color-secondary)] transition-colors"
              >
                Get started
              </Link>
            </div>
          )}

          <button
            className="flex items-center justify-center md:hidden"
            onClick={() => dispatch(toggleMobileMenu())}
          >
            {mobileMenuOpen ? (
              <LuX size={22} className="text-[var(--color-primary)]" />
            ) : (
              <LuMenu size={22} className="text-[var(--color-primary)]" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-[var(--color-border)] bg-[var(--color-background)] px-4 pb-4 pt-3 md:hidden">
          <nav className="flex flex-col gap-1">
            <Link
              to="/products"
              className="rounded-[var(--radius-sm)] px-3 py-2.5 text-sm text-[var(--color-primary)] hover:bg-[var(--color-surface)]"
            >
              All Products
            </Link>
            {categories.map(c => (
              <Link
                key={c._id}
                to={`/products?category=${c.slug}`}
                className="rounded-[var(--radius-sm)] px-3 py-2.5 text-sm text-[var(--color-secondary)] hover:bg-[var(--color-surface)]"
              >
                {c.name}
              </Link>
            ))}
            {isAuthenticated && (
              <>
                <div className="my-2 border-t border-[var(--color-border)]" />
                <Link
                  to="/profile"
                  className="rounded-[var(--radius-sm)] px-3 py-2.5 text-sm text-[var(--color-primary)] hover:bg-[var(--color-surface)]"
                >
                  Profile
                </Link>
                {isBuyer && (
                  <Link
                    to="/orders"
                    className="rounded-[var(--radius-sm)] px-3 py-2.5 text-sm text-[var(--color-primary)] hover:bg-[var(--color-surface)]"
                  >
                    My Orders
                  </Link>
                )}
                {isSeller && (
                  <Link
                    to="/seller"
                    className="rounded-[var(--radius-sm)] px-3 py-2.5 text-sm text-[var(--color-primary)] hover:bg-[var(--color-surface)]"
                  >
                    Seller Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="rounded-[var(--radius-sm)] px-3 py-2.5 text-left text-sm text-[var(--color-error)] hover:bg-red-50"
                >
                  Sign out
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
