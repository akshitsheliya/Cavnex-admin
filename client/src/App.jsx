import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// Layouts
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Pages
import Dashboard from "./pages/dashboard/Dashboard";
import LeadList from "./pages/leads/LeadList";
import LeadForm from "./pages/leads/LeadForm";
import LeadDetail from "./pages/leads/LeadDetail";
import ClientList from "./pages/clients/ClientList";
import ClientForm from "./pages/clients/ClientForm";
import ClientDetail from "./pages/clients/ClientDetail";
import ProjectList from "./pages/projects/ProjectList";
import ProjectForm from "./pages/projects/ProjectForm";
import ProjectDetail from "./pages/projects/ProjectDetail";
import ProposalList from "./pages/proposals/ProposalList";
import ProposalForm from "./pages/proposals/ProposalForm";
import ProposalView from "./pages/proposals/ProposalView";
import AgreementList from "./pages/agreements/AgreementList";
import AgreementForm from "./pages/agreements/AgreementForm";
import AgreementView from "./pages/agreements/AgreementView";
import InvoiceList from "./pages/invoices/InvoiceList";
import InvoiceForm from "./pages/invoices/InvoiceForm";
import InvoiceView from "./pages/invoices/InvoiceView";
import TemplateList from "./pages/templates/TemplateList";
import TemplateForm from "./pages/templates/TemplateForm";
import TemplateView from "./pages/templates/TemplateView";
import PricingCalculator from "./pages/pricing/PricingCalculator";
import Settings from "./pages/settings/Settings";

// 404 Component
const NotFound = () => (
  <div className="min-h-screen bg-black flex items-center justify-center p-6">
    <div className="text-center">
      <h1 className="text-[120px] font-bold leading-none bg-gradient-to-r from-neon-green to-neon-blue bg-clip-text text-transparent">
        404
      </h1>
      <p className="text-xl text-white mt-4">Page Not Found</p>
      <a
        href="/"
        className="inline-block mt-6 px-6 py-3 bg-neon-green text-black font-semibold rounded-xl"
      >
        Go to Dashboard
      </a>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Protected Routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/leads" element={<LeadList />} />
            <Route path="/leads/new" element={<LeadForm />} />
            <Route path="/leads/:id" element={<LeadDetail />} />
            <Route path="/leads/:id/edit" element={<LeadForm />} />

            <Route path="/clients" element={<ClientList />} />
            <Route path="/clients/new" element={<ClientForm />} />
            <Route path="/clients/:id" element={<ClientDetail />} />
            <Route path="/clients/:id/edit" element={<ClientForm />} />

            <Route path="/projects" element={<ProjectList />} />
            <Route path="/projects/new" element={<ProjectForm />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="/projects/:id/edit" element={<ProjectForm />} />

            <Route path="/proposals" element={<ProposalList />} />
            <Route path="/proposals/new" element={<ProposalForm />} />
            <Route path="/proposals/:id" element={<ProposalView />} />
            <Route path="/proposals/:id/edit" element={<ProposalForm />} />

            <Route path="/agreements" element={<AgreementList />} />
            <Route path="/agreements/new" element={<AgreementForm />} />
            <Route path="/agreements/:id" element={<AgreementView />} />
            <Route path="/agreements/:id/edit" element={<AgreementForm />} />

            <Route path="/invoices" element={<InvoiceList />} />
            <Route path="/invoices/new" element={<InvoiceForm />} />
            <Route path="/invoices/:id" element={<InvoiceView />} />
            <Route path="/invoices/:id/edit" element={<InvoiceForm />} />

            <Route path="/templates" element={<TemplateList />} />
            <Route path="/templates/new" element={<TemplateForm />} />
            <Route path="/templates/:id" element={<TemplateView />} />
            <Route path="/templates/:id/edit" element={<TemplateForm />} />

            <Route path="/pricing" element={<PricingCalculator />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
