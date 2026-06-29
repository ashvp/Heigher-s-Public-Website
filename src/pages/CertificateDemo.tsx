import { useState, useEffect } from "react";

export default function CertificateDemo() {
  const [certificateId, setCertificateId] = useState("");
  const [verifyData, setVerifyData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const verifyCertificateById = async (idToVerify: string) => {
    if (!idToVerify.trim()) return;
    try {
      setLoading(true);
      setError("");
      setVerifyData(null);

      const res = await fetch(
        `${BASE_URL.replace(/\/$/, '')}/certificate/verify/${idToVerify.trim()}`
      );

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.detail || "Verification failed");
      }
      
      setVerifyData(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const idParam = params.get("id");
    if (idParam) {
      setCertificateId(idParam);
      verifyCertificateById(idParam);
    }
  }, []);

  const handleVerify = async () => {
    if (!certificateId.trim()) {
      setError("Certificate ID is required");
      return;
    }
    await verifyCertificateById(certificateId);
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12 flex flex-col items-center justify-center">
      <div className="max-w-3xl w-full text-center border border-primary/30 rounded-xl p-8 md:p-12 bg-secondary/10 backdrop-blur-sm">
        <h2 className="text-3xl md:text-5xl font-bold mb-4 font-heading uppercase">
          Verify <span className="text-primary">Certificate</span>
        </h2>

        <p className="text-gray-400 mb-8">
          Enter a certificate ID to check its authenticity and details.
        </p>

        <div className="text-left max-w-md mx-auto">
          <p className="mb-2 text-sm font-medium text-gray-300">
            Certificate ID <span className="text-primary">*</span>
          </p>

          <input
            value={certificateId}
            onChange={(e) => setCertificateId(e.target.value)}
            placeholder="e.g. CERT-A1B2C3D4-6"
            className="w-full p-4 mb-6 bg-black border border-primary/50 text-white rounded focus:border-primary outline-none transition-all"
          />

          <button
            onClick={handleVerify}
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/80 text-black px-6 py-4 rounded-lg font-bold uppercase tracking-widest transition-colors disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify Authenticity →"}
          </button>
        </div>

        {verifyData && (
          <div className="mt-10 text-sm border border-primary/30 rounded-lg p-6 text-left bg-black/50">
            {verifyData.is_valid ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-green-400">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <p className="font-bold uppercase tracking-wider">✔ Certificate Verified</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Certificate ID</p>
                    <p className="font-mono text-primary">{verifyData.certificate_id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">User Name</p>
                    <p className="font-semibold">{verifyData.user_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Event</p>
                    <p className="font-semibold">{verifyData.event_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Position</p>
                    <p className="font-semibold">{verifyData.position || "N/A"}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-xs text-gray-500 uppercase">Issued At</p>
                    <p>
                      {verifyData.issued_at && new Date(verifyData.issued_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-400">
                <div className="w-2 h-2 rounded-full bg-red-400" />
                <p className="font-bold uppercase tracking-wider">✖ Invalid or Revoked Certificate</p>
              </div>
            )}
          </div>
        )}

        {error && (
          <p className="mt-6 text-red-500 text-sm font-medium">{error}</p>
        )}
      </div>
    </div>
  );
}
