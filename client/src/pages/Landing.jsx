import { Link } from "react-router-dom";
import { ArrowRight, Building2, GraduationCap, School, UserCheck, Shield } from "lucide-react";

const features = [
  { icon: Building2, title: "For Companies", desc: "Post opportunities, review applicants, and manage attachments." },
  { icon: GraduationCap, title: "For Students", desc: "Browse opportunities, apply, submit logbooks, and track evaluations." },
  { icon: School, title: "For Schools", desc: "Oversee student placements and supervisor assignments." },
  { icon: UserCheck, title: "For Supervisors", desc: "Review logbooks, submit evaluations, and monitor progress." },
  { icon: Shield, title: "For Admins", desc: "Full system oversight, analytics, and user management." },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-50">
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-indigo-600">AttachLink</h1>
          <div className="flex gap-3">
            <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">Sign In</Link>
            <Link to="/register" className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Get Started</Link>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 pt-20 pb-16 text-center">
        <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
          Internship Management<br />
          <span className="text-indigo-600">Made Simple</span>
        </h2>
        <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
          AttachLink connects students, companies, schools, and supervisors in a single platform
          to manage internships, logbooks, evaluations, and reporting.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link to="/register" className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 inline-flex items-center gap-2">
            Get Started <ArrowRight size={18} />
          </Link>
          <Link to="/login" className="px-6 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50">
            Sign In
          </Link>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <f.icon size={32} className="text-indigo-600 mb-3" />
              <h3 className="font-semibold text-gray-900">{f.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-gray-200 py-8 text-center text-sm text-gray-400">
        AttachLink &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
