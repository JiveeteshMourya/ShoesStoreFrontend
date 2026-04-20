import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { useAppDispatch } from "../store/hooks";
import { loginThunk } from "../store/slices/authSlice";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import { validateLogin } from "../utils/validators";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const toast = useToast();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  if (isAuthenticated) return <Navigate to="/" replace />;

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    const errors = validateLogin(form);
    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      return;
    }
    setLoading(true);
    const result = await dispatch(loginThunk(form));
    setLoading(false);
    if (loginThunk.fulfilled.match(result)) {
      toast.success("Welcome back!");
      navigate("/");
    } else {
      setError(result.payload || "Login failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-background)] px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-[var(--color-primary)]">Welcome back</h1>
          <p className="mt-1 text-sm text-[var(--color-secondary)]">Sign in to your account</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white p-8"
        >
          {error && (
            <p className="rounded-[var(--radius-sm)] bg-red-50 px-4 py-2.5 text-sm text-[var(--color-error)]">
              {error}
            </p>
          )}
          <Input
            label="Email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            autoComplete="email"
            error={fieldErrors.email}
          />
          <Input
            label="Password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
            autoComplete="current-password"
            error={fieldErrors.password}
          />
          <Button type="submit" loading={loading} className="mt-2 w-full justify-center">
            Sign in
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-[var(--color-secondary)]">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="font-medium text-[var(--color-primary)] underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
