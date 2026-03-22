import { useState } from "react";

export default function CertificateDemo() {
  const [certificateId, setCertificateId] = useState("");
  const [generateData, setGenerateData] = useState<any>(null);
  const [verifyData, setVerifyData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  
  const handleGenerate = async () => {
    try {
      setLoading(true);
      setError("");
      setGenerateData(null);

      let res = await fetch(`${BASE_URL}/certificate/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: 6,
          user_name: "PlayerOne",
          event_name: "BGMI Tournament",
          position: "Winner",
        }),
      });

      if (!res.ok) {
        res = await fetch(`${BASE_URL}/certificate/generate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: 61,
            user_name: "PlayerOne",
            event_name: "BGMI Tournament",
            position: "Winner",
          }),
        });
      }

      const data = await res.json();
      setGenerateData(data);

     
      if (data.certificate_id) {
        setCertificateId(data.certificate_id);
      }

    } catch (err) {
      console.error(err);
      setError("Failed to generate certificate");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!certificateId.trim()) {
      setError("Certificate ID is required");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setVerifyData(null);

      const res = await fetch(
        `${BASE_URL}/certificate/verify/${certificateId}`
      );

      const data = await res.json();
      setVerifyData(data);
    } catch (err) {
      console.error(err);
      setError("Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(certificateId);
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12">

      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">
          Generate Your <span className="text-red-500">Certificate</span>
        </h1>

        <p className="text-gray-400 mb-6">
          Instantly generate your certificate from events.
        </p>

        <button
          onClick={handleGenerate}
          className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-semibold"
        >
          {loading ? "Generating..." : "Generate Now →"}
        </button>

        {generateData && (
          <div className="mt-6 p-4 border border-red-500/30 rounded-lg">
            <p className="text-green-400 mb-2">
              ✅ Certificate Generated Successfully
            </p>

            <p className="text-sm text-gray-400">Certificate ID:</p>

            <div className="flex items-center justify-center gap-3 mt-2">
              <p className="text-lg font-bold text-yellow-400 break-all">
                {generateData.certificate_id}
              </p>

              <button
                onClick={handleCopy}
                className="text-xs bg-gray-800 px-2 py-1 rounded hover:bg-gray-700"
              >
                Copy
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="max-w-3xl mx-auto text-center border border-red-500/30 rounded-xl p-8">
        <h2 className="text-2xl md:text-4xl font-bold mb-4">
          Verify <span className="text-red-500">Certificate</span>
        </h2>

        <p className="text-gray-400 mb-6">
          Enter certificate ID to check authenticity.
        </p>

        <p className="text-left mb-1 text-sm">
          Certificate ID <span className="text-red-500">*</span>
        </p>

        <input
          value={certificateId}
          onChange={(e) => setCertificateId(e.target.value)}
          placeholder="Enter Certificate ID"
          className="w-full p-3 mb-4 bg-black border border-red-500/50 text-white rounded"
        />

        <button
          onClick={handleVerify}
          className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-semibold"
        >
          {loading ? "Checking..." : "Verify →"}
        </button>

    
        {verifyData && (
          <div className="mt-6 text-sm border border-red-500/30 rounded-lg p-4 text-left">
            {verifyData.is_valid ? (
              <div className="text-green-400 space-y-1">
                <p className="font-semibold">✔ Certificate Verified</p>

                <div className="text-gray-300 mt-2 space-y-1">
                  <p><span className="text-gray-400">Certificate ID:</span> {verifyData.certificate_id}</p>
                  <p><span className="text-gray-400">User Name:</span> {verifyData.user_name}</p>
                  <p><span className="text-gray-400">Event:</span> {verifyData.event_name}</p>
                  <p><span className="text-gray-400">Position:</span> {verifyData.position}</p>

                  {verifyData.issued_at && (
                    <p>
                      <span className="text-gray-400">Issued At:</span>{" "}
                      {new Date(verifyData.issued_at).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-red-400">✖ Invalid Certificate</p>
            )}
          </div>
        )}

        {error && (
          <p className="mt-4 text-red-400 text-sm">{error}</p>
        )}
      </div>

    </div>
  );
}