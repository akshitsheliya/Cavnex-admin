export const projectTypes = [
  { id: "website", name: "Website", icon: "🌐", basePrice: 25000 },
  { id: "ecommerce", name: "E-Commerce", icon: "🛒", basePrice: 75000 },
  { id: "webapp", name: "Web Application", icon: "💻", basePrice: 100000 },
  { id: "mobile", name: "Mobile App", icon: "📱", basePrice: 150000 },
  {
    id: "enterprise",
    name: "Enterprise Solution",
    icon: "🏢",
    basePrice: 300000,
  },
];

export const features = {
  website: [
    { id: "responsive", name: "Responsive Design", price: 5000, default: true },
    { id: "seo", name: "SEO Optimization", price: 10000, default: true },
    { id: "cms", name: "Content Management", price: 15000, default: false },
    { id: "blog", name: "Blog Section", price: 8000, default: false },
    { id: "contact", name: "Contact Form", price: 3000, default: true },
    {
      id: "analytics",
      name: "Analytics Integration",
      price: 5000,
      default: false,
    },
  ],
  ecommerce: [
    { id: "products", name: "Product Management", price: 20000, default: true },
    { id: "cart", name: "Shopping Cart", price: 15000, default: true },
    { id: "payment", name: "Payment Gateway", price: 25000, default: true },
    {
      id: "inventory",
      name: "Inventory Management",
      price: 20000,
      default: false,
    },
    {
      id: "shipping",
      name: "Shipping Integration",
      price: 15000,
      default: false,
    },
    { id: "reviews", name: "Product Reviews", price: 10000, default: false },
  ],
  webapp: [
    { id: "auth", name: "User Authentication", price: 15000, default: true },
    { id: "dashboard", name: "Admin Dashboard", price: 25000, default: true },
    { id: "api", name: "REST API", price: 30000, default: true },
    {
      id: "realtime",
      name: "Real-time Features",
      price: 25000,
      default: false,
    },
    {
      id: "notifications",
      name: "Push Notifications",
      price: 15000,
      default: false,
    },
    {
      id: "reports",
      name: "Reports & Analytics",
      price: 20000,
      default: false,
    },
  ],
  mobile: [
    { id: "ios", name: "iOS App", price: 50000, default: true },
    { id: "android", name: "Android App", price: 50000, default: true },
    { id: "push", name: "Push Notifications", price: 15000, default: true },
    { id: "offline", name: "Offline Mode", price: 20000, default: false },
    { id: "gps", name: "GPS Integration", price: 15000, default: false },
    { id: "camera", name: "Camera Integration", price: 10000, default: false },
  ],
  enterprise: [
    { id: "multiuser", name: "Multi-user System", price: 50000, default: true },
    { id: "roles", name: "Role-based Access", price: 30000, default: true },
    {
      id: "workflow",
      name: "Workflow Automation",
      price: 50000,
      default: false,
    },
    {
      id: "integration",
      name: "Third-party Integrations",
      price: 40000,
      default: false,
    },
    { id: "security", name: "Advanced Security", price: 35000, default: true },
    { id: "backup", name: "Automated Backups", price: 20000, default: false },
  ],
};

export default { projectTypes, features };
