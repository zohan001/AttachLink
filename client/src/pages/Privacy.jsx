import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-1 text-indigo-600 hover:underline text-sm mb-6">
          <ArrowLeft size={14} /> Back to home
        </Link>
        <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Privacy Policy</h1>
          <p className="text-sm text-gray-400 mb-8">Last updated: July 2026</p>

          <Section title="Information We Collect">
            We collect personal information you provide during registration (name, email, role) and
            information generated through platform use (applications, logbook entries, evaluations).
          </Section>

          <Section title="How We Use Your Information">
            Your information is used to operate the platform: facilitate internships, match students
            with opportunities, track logbooks and evaluations, and generate reports.
          </Section>

          <Section title="Data Sharing">
            Data is shared only within the platform based on user roles. For example, supervisors
            see logbooks of students they supervise; companies see applications to their opportunities.
            We do not sell personal data.
          </Section>

          <Section title="Data Retention">
            Your data is retained for as long as your account is active. Deleted accounts result in
            anonymization of personal data within 30 days.
          </Section>

          <Section title="Security">
            We implement industry-standard security measures including encryption at rest and in
            transit, rate limiting, and access controls.
          </Section>

          <Section title="Your Rights">
            You may request access to, correction of, or deletion of your personal data by contacting
            the system administrator.
          </Section>

          <Section title="Contact">
            For privacy-related inquiries, contact the platform administrator.
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
