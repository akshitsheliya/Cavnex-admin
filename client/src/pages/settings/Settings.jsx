import React, { useState } from "react";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import useAuth from "../../hooks/useAuth";

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
      id: "notifications",
      label: "Notifications",
      icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",
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
              <div className="flex items-center gap-6 mb-8">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-neon-green to-neon-blue flex items-center justify-center shadow-lg">
                  <span className="text-3xl font-bold text-black">
                    {user?.name?.charAt(0).toUpperCase() || "A"}
                  </span>
                </div>
                <div>
                  <Button variant="outline" size="sm">
                    Change Avatar
                  </Button>
                  <p className="text-xs text-gray-500 mt-2">
                    JPG, PNG or GIF. Max 2MB
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  name="name"
                  defaultValue={user?.name || ""}
                  placeholder="Enter your name"
                />
                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  defaultValue={user?.email || ""}
                  placeholder="Enter your email"
                />
                <Input
                  label="Phone Number"
                  name="phone"
                  placeholder="+91 98765 43210"
                />
                <Input
                  label="Role"
                  name="role"
                  defaultValue={user?.role || "admin"}
                  disabled
                />
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-white/10">
                <Button variant="ghost">Cancel</Button>
                <Button variant="neon">Save Changes</Button>
              </div>
            </Card>
          )}

          {activeTab === "company" && (
            <Card
              title="Company Settings"
              subtitle="Update your company information"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Company Name"
                  name="companyName"
                  placeholder="Your Agency Name"
                />
                <Input
                  label="GST Number"
                  name="gst"
                  placeholder="22AAAAA0000A1Z5"
                />
                <Input
                  label="Website"
                  name="website"
                  placeholder="https://youragency.com"
                />
                <Input
                  label="Email"
                  name="companyEmail"
                  type="email"
                  placeholder="contact@youragency.com"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Address
                </label>
                <textarea
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-neon-green/50 resize-none"
                  rows={3}
                  placeholder="Enter company address"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-white/10">
                <Button variant="ghost">Cancel</Button>
                <Button variant="neon">Save Changes</Button>
              </div>
            </Card>
          )}

          {activeTab === "security" && (
            <Card
              title="Security Settings"
              subtitle="Manage your account security"
            >
              <div className="space-y-6">
                <div>
                  <h4 className="text-white font-medium mb-4">
                    Change Password
                  </h4>
                  <div className="space-y-4">
                    <Input
                      label="Current Password"
                      name="currentPassword"
                      type="password"
                      placeholder="••••••••"
                    />
                    <Input
                      label="New Password"
                      name="newPassword"
                      type="password"
                      placeholder="••••••••"
                    />
                    <Input
                      label="Confirm New Password"
                      name="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-white/10">
                  <Button variant="ghost">Cancel</Button>
                  <Button variant="neon">Update Password</Button>
                </div>
              </div>
            </Card>
          )}

          {activeTab === "notifications" && (
            <Card
              title="Notification Settings"
              subtitle="Manage your notification preferences"
            >
              <div className="space-y-4">
                {[
                  {
                    label: "Email Notifications",
                    description: "Receive email updates about your account",
                  },
                  {
                    label: "New Lead Alerts",
                    description: "Get notified when a new lead is received",
                  },
                  {
                    label: "Invoice Reminders",
                    description: "Receive reminders for pending invoices",
                  },
                  {
                    label: "Project Updates",
                    description: "Get updates about project milestones",
                  },
                  {
                    label: "Weekly Reports",
                    description: "Receive weekly summary reports",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5"
                  >
                    <div>
                      <p className="text-white font-medium">{item.label}</p>
                      <p className="text-sm text-gray-500">
                        {item.description}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        defaultChecked
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neon-green"></div>
                    </label>
                  </div>
                ))}
              </div>
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
