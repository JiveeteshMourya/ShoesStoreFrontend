import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { updateUser } from "../../store/slices/authSlice";
import { useToast } from "../../hooks/useToast";
import { useAuth } from "../../hooks/useAuth";
import * as usersApi from "../../api/usersApi";
import { getImageUrl } from "../../utils/imageUrl";
import {
  validateProfileInfo,
  validateProfileAddress,
  validatePasswordChange,
} from "../../utils/validators";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import PageWrapper from "../../components/layout/PageWrapper";
import SectionTitle from "../../components/layout/SectionTitle";
import { LuCamera } from "react-icons/lu";

function InfoTab({ user }) {
  const dispatch = useAppDispatch();
  const toast = useToast();
  const [form, setForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phone: user?.phone || "",
    address: {
      street: user?.address?.street || "",
      city: user?.address?.city || "",
      state: user?.address?.state || "",
      zipCode: user?.address?.zipCode || "",
      country: user?.address?.country || "",
    },
  });
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const setAddr = (key, val) => setForm(f => ({ ...f, address: { ...f.address, [key]: val } }));

  const handleSubmit = async e => {
    e.preventDefault();
    setFieldErrors({});
    const errors = {
      ...validateProfileInfo(form),
      ...validateProfileAddress(form.address),
    };
    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      return;
    }
    setLoading(true);
    try {
      const res = await usersApi.updateMyProfile(form);
      dispatch(updateUser(res.data.data));
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-xl">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="First name"
          value={form.firstName}
          onChange={e => set("firstName", e.target.value)}
          error={fieldErrors.firstName}
        />
        <Input
          label="Last name"
          value={form.lastName}
          onChange={e => set("lastName", e.target.value)}
          error={fieldErrors.lastName}
        />
      </div>
      <Input
        label="Phone"
        value={form.phone}
        onChange={e => set("phone", e.target.value)}
        placeholder="+1-555-0100"
        error={fieldErrors.phone}
      />

      <div className="rounded-md border border-[var(--color-border)] p-4">
        <p className="mb-3 text-sm font-medium text-[var(--color-primary)]">Shipping address</p>
        <div className="flex flex-col gap-3">
          <Input
            label="Street"
            value={form.address.street}
            onChange={e => setAddr("street", e.target.value)}
            placeholder="123 Main St"
            error={fieldErrors.street}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="City"
              value={form.address.city}
              onChange={e => setAddr("city", e.target.value)}
              error={fieldErrors.city}
            />
            <Input
              label="State"
              value={form.address.state}
              onChange={e => setAddr("state", e.target.value)}
              error={fieldErrors.state}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="ZIP code"
              value={form.address.zipCode}
              onChange={e => setAddr("zipCode", e.target.value)}
              error={fieldErrors.zipCode}
            />
            <Input
              label="Country"
              value={form.address.country}
              onChange={e => setAddr("country", e.target.value)}
              error={fieldErrors.country}
            />
          </div>
        </div>
      </div>

      <div>
        <Button type="submit" loading={loading}>
          Save changes
        </Button>
      </div>
    </form>
  );
}

function SecurityTab() {
  const toast = useToast();
  const [form, setForm] = useState({ currentPassword: "", newPassword: "" });
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async e => {
    e.preventDefault();
    setFieldErrors({});
    const errors = validatePasswordChange(form);
    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      return;
    }
    setLoading(true);
    try {
      await usersApi.changePassword(form);
      toast.success("Password changed");
      setForm({ currentPassword: "", newPassword: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm">
      <Input
        label="Current password"
        type="password"
        value={form.currentPassword}
        onChange={e => set("currentPassword", e.target.value)}
        autoComplete="current-password"
        error={fieldErrors.currentPassword}
      />
      <Input
        label="New password"
        type="password"
        value={form.newPassword}
        onChange={e => set("newPassword", e.target.value)}
        autoComplete="new-password"
        error={fieldErrors.newPassword}
      />
      <div>
        <Button type="submit" loading={loading}>
          Change password
        </Button>
      </div>
    </form>
  );
}

export default function ProfilePage() {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const toast = useToast();
  const [tab, setTab] = useState("info");
  const [avatarLoading, setAvatarLoading] = useState(false);
  const avatarUrl = getImageUrl(user?.avatar);

  const handleAvatarChange = async e => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Avatar must be 5 MB or smaller");
      e.target.value = "";
      return;
    }
    const fd = new FormData();
    fd.append("avatar", file);
    setAvatarLoading(true);
    try {
      const res = await usersApi.updateAvatar(fd);
      dispatch(updateUser(res.data.data));
      toast.success("Avatar updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to upload avatar");
    } finally {
      setAvatarLoading(false);
    }
  };

  const tabs = [
    { id: "info", label: "Personal info" },
    { id: "security", label: "Security" },
  ];

  return (
    <PageWrapper>
      <SectionTitle title="Profile" />

      {/* Avatar */}
      <div className="mb-8 flex items-center gap-5">
        <div className="relative">
          <div className="h-16 w-16 overflow-hidden rounded-full bg-[var(--color-accent)]">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xl font-semibold text-white">
                {user?.firstName?.[0]?.toUpperCase()}
              </div>
            )}
          </div>
          <label className="absolute -bottom-1 -right-1 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border-2 border-[var(--color-background)] bg-[var(--color-primary)] text-[var(--color-background)] hover:bg-[var(--color-secondary)] transition-colors">
            {avatarLoading ? (
              <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <LuCamera size={11} />
            )}
            <input type="file" accept="image/*" className="sr-only" onChange={handleAvatarChange} />
          </label>
        </div>
        <div>
          <p className="font-medium text-[var(--color-primary)]">
            {user?.firstName} {user?.lastName}
          </p>
          <p className="text-sm text-[var(--color-secondary)]">{user?.email}</p>
          <p className="mt-0.5 text-xs text-[var(--color-accent)] capitalize">{user?.role}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex border-b border-[var(--color-border)]">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 pb-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
              tab === t.id
                ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                : "border-transparent text-[var(--color-secondary)] hover:text-[var(--color-primary)]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "info" && <InfoTab user={user} />}
      {tab === "security" && <SecurityTab />}
    </PageWrapper>
  );
}
