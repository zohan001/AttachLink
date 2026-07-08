import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-1 text-indigo-600 hover:underline text-sm mb-6">
          <ArrowLeft size={14} /> Back to home
        </Link>
        <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Terms of Service</h1>
          <p className="text-sm text-gray-400 mb-8">Last updated: July 2026</p>

          <Section title="Acceptance of Terms">
            By accessing or using AttachLink, you agree to be bound by these Terms of Service. If
            you do not agree, do not use the platform.
          </Section>

          <Section title="User Accounts">
            You are responsible for maintaining the confidentiality of your account credentials and
            for all activity under your account. Notify the administrator immediately of any
            unauthorized use.
          </Section>

          <Section title="Acceptable Use">
            You agree to use the platform only for lawful purposes related to internship management.
            Prohibited activities include uploading malware, attempting to breach security, or
            impersonating others.
          </Section>

          <Section title="Content Ownership">
            You retain ownership of content you submit. By submitting content, you grant the platform
            a license to store, display, and process it as necessary to provide the service.
          </Section>

          <Section title="Limitation of Liability">
            The platform is provided "as is" without warranties of any kind. We are not liable for
            damages arising from use or inability to use the platform.
          </Section>

          <Section title="Termination">
            We reserve the right to suspend or terminate accounts that violate these terms or
            applicable laws.
          </Section>

          <Section title="Changes">
            We may update these terms at any time. Continued use after changes constitutes acceptance
            of the new terms.
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-2">{title}</h2>
      <p className="text-gray-600 leading-relaxed">{children}</p>
    </div>
  );
}
