import { Component } from "react";
import { LuArrowRight, LuRefreshCw, LuTriangleAlert } from "react-icons/lu";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error Boundary Caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-(--color-background) px-4 py-10 sm:px-6 lg:px-10">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(234,140,37,0.15),transparent_30%),radial-gradient(circle_at_82%_78%,rgba(87,16,32,0.12),transparent_36%)]" />
            <div className="absolute -left-16 top-12 h-40 w-40 rounded-full bg-(--color-text-highlight)/18 blur-3xl" />
            <div className="absolute -right-16 bottom-10 h-44 w-44 rounded-full bg-(--color-highlight)/14 blur-3xl" />
          </div>

          <div
            className="relative w-full max-w-2xl rounded-4xl border border-(--color-highlight)/15 bg-white/76 px-6 py-8 text-center shadow-[0_24px_50px_rgba(87,16,32,0.12)] backdrop-blur-sm sm:px-8 sm:py-10"
            role="alert"
            aria-live="assertive"
          >
            <img
              src="/belqees-logo.png"
              alt="Belqees logo"
              className="mx-auto h-16 w-16 rounded-full border-2 border-(--color-highlight)/20 object-cover shadow-sm sm:h-18 sm:w-18"
            />

            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-(--color-highlight)/12 bg-(--color-background)/75 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-(--color-highlight)">
              <LuTriangleAlert size={14} />
              Temporary issue
            </div>

            <h1 className="mt-5 text-3xl font-bold tracking-tight text-(--color-text-main) sm:text-4xl">
              We ran into a problem loading this page.
            </h1>

            <p className="mx-auto mt-4 max-w-[38ch] text-base leading-relaxed text-(--color-text-main)/80 sm:text-lg">
              Something did not load as expected. Refreshing usually fixes it, or you can head back
              home and continue from there.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-(--color-highlight) px-6 py-3.5 text-base font-semibold text-(--color-background) shadow-[0_14px_24px_rgba(87,16,32,0.24)] transition duration-200 hover:-translate-y-0.5 hover:bg-(--color-text-main)"
              >
                <LuRefreshCw size={18} />
                Refresh page
              </button>

              <button
                type="button"
                onClick={() => window.location.assign("/")}
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-(--color-highlight)/18 bg-(--color-background)/70 px-6 py-3.5 text-base font-semibold text-(--color-text-main) transition duration-200 hover:-translate-y-0.5 hover:border-(--color-highlight)/34 hover:bg-white"
              >
                Back to home
                <LuArrowRight size={18} />
              </button>
            </div>

            {import.meta.env.DEV && this.state.error?.message ? (
              <details className="mt-6 rounded-2xl border border-(--color-highlight)/12 bg-(--color-background)/55 px-4 py-3 text-left text-sm text-(--color-text-main)/72">
                <summary className="cursor-pointer font-semibold text-(--color-text-main)">
                  Technical details
                </summary>
                <p className="mt-3 wrap-break-word leading-relaxed">{this.state.error.message}</p>
              </details>
            ) : null}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
