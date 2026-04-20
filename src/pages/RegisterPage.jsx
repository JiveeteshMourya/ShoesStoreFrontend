import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { useAppDispatch } from "../store/hooks";
import { registerThunk, loginThunk } from "../store/slices/authSlice";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import { validateRegister } from "../utils/validators";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Select from "../components/ui/Select";

export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const toast = useToast();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "buyer",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  if (isAuthenticated) return <Navigate to="/" replace />;

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    const errors = validateRegister(form);
    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      return;
    }
    setLoading(true);
    const result = await dispatch(registerThunk(form));
    if (registerThunk.fulfilled.match(result)) {
      await dispatch(loginThunk({ email: form.email, password: form.password }));
      toast.success("Account created! Welcome.");
      navigate("/");
    } else {
      setError(result.payload || "Registration failed");
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-(--color-background) px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-(--color-primary)">Create account</h1>
          <p className="mt-1 text-sm text-(--color-secondary)">Join Sole & Co. today</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 rounded-md) border border-(--color-border) bg-white p-8"
        >
          {error && (
            <p className="rounded-sm) bg-red-50 px-4 py-2.5 text-sm text-(--color-error)">
              {error}
            </p>
          )}
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="First name"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              placeholder="Bob"
              error={fieldErrors.firstName}
            />
            <Input
              label="Last name"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              placeholder="Smith"
              error={fieldErrors.lastName}
            />
          </div>
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
            placeholder="Min. 8 characters"
            autoComplete="new-password"
            error={fieldErrors.password}
          />
          <Select label="I want to" name="role" value={form.role} onChange={handleChange}>
            <option value="buyer">Buy shoes</option>
            <option value="seller">Sell shoes</option>
          </Select>
          <Button type="submit" loading={loading} className="mt-2 w-full justify-center">
            Create account
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-(--color-secondary)">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-(--color-primary) underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
