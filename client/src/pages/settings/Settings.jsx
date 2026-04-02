import React, { useState } from "react";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import PhoneInput from "../../components/common/PhoneInput";
import useAuth from "../../hooks/useAuth";
import useFormValidation from "../../hooks/useFormValidation";
import { profileSchema, changePasswordSchema, companySchema } from "../../validations";

// ─── Profile Sub-form ─────────────────────────────────────────────────────────

const ProfileForm = ({ user }) => {
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");

  const { values, errors, handleChange, handleBlur, validate, isSubmitDisabled } =
    useFormValidation(
      {
        name: user?.name || "",
        email: user?.email || "",
        phone: "",
      },
      profileSchema
    );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    const isValid = await validate();
    if (!isValid) return;
    // TODO: wire up to API
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSuccess("Profile updated successfully");
    }, 800);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="flex items-center gap-6 mb-8">
        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-neon-green to-neon-blue flex items-center justify-center shadow-lg">
          <span className="text-3xl font-bold text-black">
            {user?.name?.charAt(0).toUpperCase() || "A"}
          </span>
        </div>
        <div>
          <Button variant="outline" size="sm" type="button">
            Change Avatar
          </Button>
          <p className="text-xs text-gray-500 mt-2">JPG, PNG or GIF. Max 2MB</p>
        </div>
      </div>

      {success && (
        <p className="mb-4 text-sm text-neon-green">{success}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Full Name"
          name="name"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Enter your name"
          error={errors.name}
          required
        />
        <Input
          label="Email Address"
          name="email"
          type="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Enter your email"
          error={errors.email}
          required
        />
        <PhoneInput
          label="Phone Number"
          name="phone"
          value={values.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.phone}
          placeholder="98765 43210"
        />
        <Input
          label="Role"
          name="role"
          defaultValue={user?.role || "admin"}
          disabled
        />
      </div>

      <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-white/10">
        <Button variant="ghost" type="button">Cancel</Button>
        <Button
          variant="neon"
          type="submit"
          loading={saving}
          disabled={isSubmitDisabled(saving)}
        >
          Save Changes
        </Button>
      </div>
    </form>
  );
};

// ─── Company Sub-form ─────────────────────────────────────────────────────────

const CompanyForm = () => {
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");

  const { values, errors, handleChange, handleBlur, validate, isSubmitDisabled } =
    useFormValidation(
      {
        companyName: "",
        gst: "",
        website: "",
        companyEmail: "",
        address: "",
      },
      companySchema
    );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    const isValid = await validate();
    if (!isValid) return;
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSuccess("Company info updated successfully");
    }, 800);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {success && <p className="mb-4 text-sm text-neon-green">{success}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Company Name"
          name="companyName"
          value={values.companyName}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Cavnex"
          error={errors.companyName}
        />
        <Input
          label="GST Number"
          name="gst"
          value={values.gst}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="22AAAAA0000A1Z5"
          error={errors.gst}
        />
        <Input
          label="Website"
          name="website"
          value={values.website}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="https://cavnex.in"
          error={errors.website}
        />
        <Input
          label="Email"
          name="companyEmail"
          type="email"
          value={values.companyEmail}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="contact@cavnex.com"
          error={errors.companyEmail}
        />
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Address
        </label>
        <textarea
          name="address"
          value={values.address}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-neon-green/50 resize-none"
          rows={3}
          placeholder="Enter company address"
        />
      </div>

      <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-white/10">
        <Button variant="ghost" type="button">Cancel</Button>
        <Button
          variant="neon"
          type="submit"
          loading={saving}
          disabled={isSubmitDisabled(saving)}
        >
          Save Changes
        </Button>
      </div>
    </form>
  );
};

// ─── Security / Change Password Sub-form ─────────────────────────────────────

const SecurityForm = () => {
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [apiError, setApiError] = useState("");

  const { values, errors, handleChange, handleBlur, validate, isSubmitDisabled, reset } =
    useFormValidation(
      {
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      },
      changePasswordSchema
    );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    setSuccess("");

    const isValid = await validate();
    if (!isValid) return;

    setSaving(true);
    try {
      // TODO: wire up to API — e.g. await api.post('/auth/change-password', { currentPassword: values.currentPassword, newPassword: values.newPassword })
      await new Promise((r) => setTimeout(r, 800));
      setSuccess("Password updated successfully");
      reset();
    } catch (err) {
      setApiError(err.response?.data?.message || "Failed to update password");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-white font-medium mb-4">Change Password</h4>

        {success && <p className="mb-4 text-sm text-neon-green">{success}</p>}
        {apiError && <p className="mb-4 text-sm text-red-400">{apiError}</p>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="space-y-4">
            <Input
              label="Current Password"
              name="currentPassword"
              type="password"
              value={values.currentPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="••••••••"
              error={errors.currentPassword}
              required
            />
            <Input
              label="New Password"
              name="newPassword"
              type="password"
              value={values.newPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="••••••••"
              error={errors.newPassword}
              required
            />
            {/* Password strength hint */}
            {values.newPassword && !errors.newPassword && (
              <p className="text-xs text-neon-green/70 -mt-2 px-1">✓ Strong password</p>
            )}
            {values.newPassword && errors.newPassword && (
              <p className="text-xs text-amber-400/80 -mt-2 px-1">
                Must be 8+ chars with uppercase, lowercase, number & special character
              </p>
            )}
            <Input
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              value={values.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="••••••••"
              error={errors.confirmPassword}
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-white/10 mt-6">
            <Button variant="ghost" type="button" onClick={reset}>Cancel</Button>
            <Button
              variant="neon"
              type="submit"
              loading={saving}
              disabled={isSubmitDisabled(saving)}
            >
              Update Password
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Main Settings Page ───────────────────────────────────────────────────────

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    {
      id: "profile",
      label: "Profile",
      icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    },
    {
      id: "company",
      label: "Company",
      icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
    },
    {
      id: "billing",
      label: "Billing",
      icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
    },
    {
      id: "security",
      label: "Security",
      icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-gray-400 mt-1">
          Manage your account and preferences
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-64 flex-shrink-0">
          <div className="glass-card p-4">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-neon-green/10 text-neon-green border border-neon-green/30"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d={tab.icon}
                    />
                  </svg>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="flex-1">
          {activeTab === "profile" && (
            <Card
              title="Profile Settings"
              subtitle="Update your personal information"
            >
              <ProfileForm user={user} />
            </Card>
          )}

          {activeTab === "company" && (
            <Card
              title="Company Settings"
              subtitle="Update your company information"
            >
              <CompanyForm />
            </Card>
          )}

          {activeTab === "security" && (
            <Card
              title="Security Settings"
              subtitle="Manage your account security"
            >
              <SecurityForm />
            </Card>
          )}

          {activeTab === "billing" && (
            <Card
              title="Billing Settings"
              subtitle="Manage your billing information"
            >
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                </div>
                <p className="text-gray-400">Billing features coming soon</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
