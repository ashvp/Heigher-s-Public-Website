import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { Search, User, Award, CheckCircle2, Copy, X } from "lucide-react";

export default function GenerateCertificate() {
  const [generateData, setGenerateData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  
  const [form, setForm] = useState({
    event_name: "",
    position: "",
  });

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const SAFE_BASE_URL = BASE_URL.replace(/\/$/, '');

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length >= 2) {
        handleSearch();
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearch = async () => {
    if (!searchQuery || searchQuery.length < 2) return;
    
    try {
      setSearchLoading(true);
      setError("");
      console.log("Searching for:", searchQuery);
      const url = `${SAFE_BASE_URL}/search?query=${encodeURIComponent(searchQuery)}`;
      console.log("Fetching from:", url);
      
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Accept": "application/json",
        },
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ detail: "Search failed" }));
        throw new Error(errorData.detail || `Error: ${res.status}`);
      }
      
      const data = await res.json();
      console.log("Search results:", data);
      setSearchResults(data);
    } catch (err: any) {
      console.error("Search failed:", err);
      setError(err.message || "Failed to search users");
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!selectedUser) {
      setError("Please search and select a user first");
      return;
    }
    if (!form.event_name) {
      setError("Please enter an event name");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setGenerateData(null);

      const currentUser = auth.currentUser;
      if (!currentUser || !currentUser.email) {
        throw new Error("You must be logged in to generate certificates");
      }

      const res = await fetch(`${SAFE_BASE_URL}/certificate/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          user_id: selectedUser.id,
          user_name: selectedUser.name,
          event_name: form.event_name,
          position: form.position || null,
          requester_email: currentUser.email,
        }),
      });

      const data = await res.json().catch(() => ({ detail: "Failed to parse response" }));

      if (!res.ok) {
        throw new Error(data.detail || "Failed to generate certificate");
      }

      setGenerateData(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to generate certificate");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (generateData?.certificate_id) {
      navigator.clipboard.writeText(generateData.certificate_id);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12 flex flex-col items-center">
      <div className="max-w-4xl w-full text-center mb-12">
        <div className="inline-block p-3 rounded-2xl bg-primary/10 mb-4 border border-primary/20">
          <Award className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-4 font-heading uppercase tracking-tighter">
          Admin <span className="text-primary">Portal</span>
        </h1>
        <p className="text-gray-400 text-lg">Issue official tournament certificates to verified members.</p>
      </div>

      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: User Search */}
        <div className="space-y-6">
          <div className="bg-secondary/10 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Search className="w-5 h-5 text-primary" />
              Step 1: Find User
            </h2>
            
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full p-4 bg-black border border-white/10 rounded-xl focus:border-primary outline-none transition-all pl-12"
              />
              <Search className="absolute left-4 top-4.5 w-5 h-5 text-gray-500" />
            </div>

            <div className="mt-4 space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
              {searchLoading && (
                <div className="text-center py-4 text-gray-500 text-sm">Searching database...</div>
              )}
              
              {!searchLoading && searchResults.map((user) => (
                <button
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between group ${
                    selectedUser?.id === user.id 
                    ? 'bg-primary/20 border-primary text-white' 
                    : 'bg-white/5 border-white/5 hover:border-white/20 text-gray-300'
                  }`}
                >
                  <div>
                    <p className="font-bold">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <User className={`w-5 h-5 ${selectedUser?.id === user.id ? 'text-primary' : 'text-gray-600 group-hover:text-gray-400'}`} />
                </button>
              ))}

              {searchQuery.length >= 2 && searchResults.length === 0 && !searchLoading && (
                <div className="text-center py-4 text-gray-500 text-sm">No users found matching "{searchQuery}"</div>
              )}
            </div>
          </div>

          {selectedUser && (
            <div className="bg-primary/10 p-4 rounded-xl border border-primary/30 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-3">
                <div className="bg-primary text-black p-2 rounded-lg">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-primary font-bold uppercase tracking-wider">Selected Recipient</p>
                  <p className="font-bold">{selectedUser.name}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedUser(null)}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Event Details */}
        <div className="space-y-6">
          <div className="bg-secondary/10 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              Step 2: Event Details
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-gray-500">Event Name</label>
                <input
                  type="text"
                  value={form.event_name}
                  onChange={(e) => setForm({ ...form, event_name: e.target.value })}
                  placeholder="e.g. BGMI Tournament"
                  className="w-full p-4 bg-black border border-white/10 rounded-xl focus:border-primary outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-gray-500">Position / Achievement</label>
                <input
                  type="text"
                  value={form.position}
                  onChange={(e) => setForm({ ...form, position: e.target.value })}
                  placeholder="e.g. Winner, MVP (Optional)"
                  className="w-full p-4 bg-black border border-white/10 rounded-xl focus:border-primary outline-none transition-all"
                />
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading || !selectedUser}
                className="w-full bg-primary hover:bg-primary/80 text-black px-6 py-4 rounded-xl font-bold uppercase tracking-widest transition-all disabled:opacity-30 disabled:cursor-not-allowed mt-4 shadow-lg shadow-primary/20"
              >
                {loading ? "Processing..." : "Generate Certificate →"}
              </button>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-medium">
                {error}
              </div>
            )}
          </div>

          {generateData && (
            <div className="bg-green-500/10 p-6 rounded-2xl border border-green-500/30 text-center animate-in zoom-in-95">
              <p className="text-green-400 font-bold mb-4 flex items-center justify-center gap-2 uppercase tracking-widest">
                <CheckCircle2 className="w-5 h-5" />
                Success
              </p>
              <p className="text-xs text-gray-500 mb-1 uppercase tracking-widest">Unique Certificate ID</p>
              <div className="flex items-center justify-center gap-3">
                <p className="text-2xl font-mono font-bold text-yellow-400">{generateData.certificate_id}</p>
                <button
                  onClick={handleCopy}
                  className="p-2 bg-white/5 rounded-lg hover:bg-white/10 border border-white/10 transition-colors"
                  title="Copy ID"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
