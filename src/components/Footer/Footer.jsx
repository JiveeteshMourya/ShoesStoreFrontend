import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-background)]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <p className="text-lg font-semibold text-[var(--color-primary)]">
              Sole <span className="text-[var(--color-accent)]">&</span> Co.
            </p>
            <p className="mt-2 text-sm text-[var(--color-secondary)] leading-relaxed">
              Curated footwear for every stride.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-secondary)]">
              Shop
            </p>
            <ul className="mt-3 space-y-2">
              {[
                { label: "All Products", to: "/products" },
                { label: "New Arrivals", to: "/products?sort=newest" },
                { label: "Top Rated", to: "/products?sort=rating" },
              ].map(l => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-sm text-[var(--color-secondary)] hover:text-[var(--color-primary)] transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-secondary)]">
              Account
            </p>
            <ul className="mt-3 space-y-2">
              {[
                { label: "Sign In", to: "/login" },
                { label: "Register", to: "/register" },
                { label: "My Orders", to: "/orders" },
                { label: "Profile", to: "/profile" },
              ].map(l => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-sm text-[var(--color-secondary)] hover:text-[var(--color-primary)] transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-secondary)]">
              Sell
            </p>
            <ul className="mt-3 space-y-2">
              {[
                { label: "Become a Seller", to: "/register" },
                { label: "Seller Dashboard", to: "/seller" },
                { label: "Manage Products", to: "/seller/products" },
              ].map(l => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-sm text-[var(--color-secondary)] hover:text-[var(--color-primary)] transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-[var(--color-border)] pt-6 text-center text-xs text-[var(--color-secondary)]">
          © {new Date().getFullYear()} Sole &amp; Co. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
