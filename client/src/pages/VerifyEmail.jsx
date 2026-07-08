import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../api/client";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const token = searchParams.get("token");
    const email = searchParams.get("email");
    if (!token || !email) {
      setStatus("invalid");
      return;
    }
    api
      .post("/auth/verify-email", { token, email })
      .then(() => setStatus("verified"))
      .catch(() => setStatus("error"));
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 text-center">
        {status === "loading" && (
          <>
            <Loader2 className="animate-spin text-indigo-600 mx-auto mb-4" size={48} />
            <h1 className="text-xl font-bold text-gray-800">Verifying your email...</h1>
          </>
        )}
        {status === "verified" && (
          <>
            <CheckCircle className="text-green-500 mx-auto mb-4" size={48} />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Email Verified!</h1>
            <p className="text-gray-500 text-sm mb-6">Your email has been successfully verified.</p>
            <Link
              to="/login"
              className="inline-block bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700"
            >
              Sign In
            </Link>
          </>
        )}
        {(status === "error" || status === "invalid") && (
          <>
            <XCircle className="text-red-500 mx-auto mb-4" size={48} />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Verification Failed</h1>
            <p className="text-gray-500 text-sm mb-6">
              {status === "invalid" ? "Missing verification token." : "The link may be expired or invalid."}
            </p>
            <Link to="/login" className="text-indigo-600 hover:underline">
              Back to login
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
