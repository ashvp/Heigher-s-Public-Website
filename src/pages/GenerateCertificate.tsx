import { useState, useEffect, useRef } from "react";
import { auth } from "@/lib/firebase";
import { Search, User, Award, CheckCircle2, Copy, X, Upload, Download, Settings, RefreshCw, Type, Eye } from "lucide-react";
import QRCode from "qrcode";

export default function GenerateCertificate() {
  const [generateData, setGenerateData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  
  // Decoupling states
  const [isManualUser, setIsManualUser] = useState(false);
  const [manualName, setManualName] = useState("");

  const [form, setForm] = useState({
    event_name: "",
    position: "",
  });

  // Certificate template state
  const [templateFile, setTemplateFile] = useState<File | null>(null);
  const [templateImage, setTemplateImage] = useState<HTMLImageElement | null>(null);
  const [qrImage, setQrImage] = useState<HTMLImageElement | null>(null);

  // Design controls
  const [design, setDesign] = useState({
    // Name controls
    nameX: 50, // in percentage
    nameY: 50,
    nameFontSize: 48, // in pixels
    nameColor: "#ffffff",
    nameAlign: "center", // left, center, right
    nameFontWeight: "bold",

    // Position controls
    posX: 50,
    posY: 60,
    posFontSize: 32,
    posColor: "#d1d5db",
    posAlign: "center",
    posFontWeight: "normal",

    // Event controls
    eventX: 50,
    eventY: 40,
    eventFontSize: 36,
    eventColor: "#e10600",
    eventAlign: "center",
    eventFontWeight: "bold",

    // QR Code controls
    qrX: 85, // in percentage
    qrY: 80,
    qrSize: 120, // in pixels
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const SAFE_BASE_URL = BASE_URL.replace(/\/$/, '');

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length >= 2 && !isManualUser) {
        handleSearch();
      } else {
        setSearchResults([]);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery, isManualUser]);

  const handleSearch = async () => {
    if (!searchQuery || searchQuery.length < 2) return;
    
    try {
      setSearchLoading(true);
      setError("");
      const url = `${SAFE_BASE_URL}/search?query=${encodeURIComponent(searchQuery)}`;
      
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
    if (!isManualUser && !selectedUser) {
      setError("Please search and select a registered user first, or check the Manual Entry box");
      return;
    }
    if (isManualUser && !manualName.trim()) {
      setError("Please enter the recipient's name");
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
          user_id: isManualUser ? null : selectedUser.id,
          user_name: isManualUser ? manualName.trim() : selectedUser.name,
          event_name: form.event_name.trim(),
          position: form.position.trim() || null,
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

  // Image Upload handler
  const handleTemplateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setTemplateFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          setTemplateImage(img);
        };
      };
      reader.readAsDataURL(file);
    }
  };

  // Load QR code when certificate generated
  useEffect(() => {
    if (generateData?.certificate_id) {
      const verifyUrl = `${window.location.origin}/certificate-verify?id=${encodeURIComponent(generateData.certificate_id)}`;
      QRCode.toDataURL(verifyUrl, { margin: 1, scale: 8 })
        .then((dataUrl) => {
          const img = new Image();
          img.src = dataUrl;
          img.onload = () => {
            setQrImage(img);
          };
        })
        .catch((err) => console.error("QR Code generation failed:", err));
    } else {
      setQrImage(null);
    }
  }, [generateData]);

  // Redraw Canvas whenever parameters change
  const drawCertificate = () => {
    const canvas = canvasRef.current;
    if (!canvas || !templateImage) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions to template's natural dimensions
    canvas.width = templateImage.naturalWidth;
    canvas.height = templateImage.naturalHeight;

    // Draw base template
    ctx.drawImage(templateImage, 0, 0);

    const w = canvas.width;
    const h = canvas.height;

    // Draw Event Name
    if (generateData?.event_name) {
      ctx.fillStyle = design.eventColor;
      ctx.font = `${design.eventFontWeight} ${design.eventFontSize}px Outfit, sans-serif`;
      ctx.textAlign = design.eventAlign as CanvasTextAlign;
      ctx.textBaseline = "middle";
      const evX = (design.eventX / 100) * w;
      const evY = (design.eventY / 100) * h;
      ctx.fillText(generateData.event_name, evX, evY);
    }

    // Draw Recipient Name
    if (generateData?.user_name) {
      ctx.fillStyle = design.nameColor;
      ctx.font = `${design.nameFontWeight} ${design.nameFontSize}px Outfit, sans-serif`;
      ctx.textAlign = design.nameAlign as CanvasTextAlign;
      ctx.textBaseline = "middle";
      const nX = (design.nameX / 100) * w;
      const nY = (design.nameY / 100) * h;
      ctx.fillText(generateData.user_name, nX, nY);
    }

    // Draw Position / Achievement
    if (generateData?.position) {
      ctx.fillStyle = design.posColor;
      ctx.font = `${design.posFontWeight} ${design.posFontSize}px Outfit, sans-serif`;
      ctx.textAlign = design.posAlign as CanvasTextAlign;
      ctx.textBaseline = "middle";
      const pX = (design.posX / 100) * w;
      const pY = (design.posY / 100) * h;
      ctx.fillText(generateData.position, pX, pY);
    }

    // Draw QR Code
    if (qrImage) {
      const qX = (design.qrX / 100) * w;
      const qY = (design.qrY / 100) * h;
      // Drawing QR Code centered at the coordinates, or top-left. Let's make it draw from coordinates as top-left
      ctx.drawImage(qrImage, qX, qY, design.qrSize, design.qrSize);
    }
  };

  useEffect(() => {
    drawCertificate();
  }, [templateImage, qrImage, design, generateData]);

  // Download logic
  const downloadCertificate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `Certificate_${generateData?.user_name?.replace(/\s+/g, "_") || "unnamed"}.png`;
    link.href = url;
    link.click();
  };

  const handleDesignChange = (key: string, value: any) => {
    setDesign(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 md:px-8 py-12 flex flex-col items-center">
      
      {/* Title */}
      <div className="max-w-5xl w-full text-center mb-10">
        <div className="inline-block p-3 rounded-2xl bg-primary/10 mb-4 border border-primary/20">
          <Award className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-3 font-heading uppercase tracking-tighter">
          Certificate <span className="text-primary">Pipeline</span>
        </h1>
        <p className="text-gray-400 text-lg">Generate verified credentials and overlay them onto your custom PNG designs.</p>
      </div>

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT PANEL: Generator Form & Design controls */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* STEP 1: Details and Generation */}
          <div className="bg-secondary/10 p-6 rounded-2xl border border-white/5 backdrop-blur-sm shadow-xl">
            <h2 className="text-xl font-bold mb-5 flex items-center gap-2 border-b border-white/10 pb-3 text-primary">
              <Settings className="w-5 h-5 text-primary" />
              1. Certificate Credentials
            </h2>

            {/* Manual Toggle */}
            <div className="flex items-center gap-3 mb-6 p-3 bg-white/5 rounded-xl border border-white/5">
              <input
                type="checkbox"
                id="manual-user-toggle"
                checked={isManualUser}
                onChange={(e) => {
                  setIsManualUser(e.target.checked);
                  setSelectedUser(null);
                  setSearchQuery("");
                }}
                className="w-5 h-5 rounded accent-primary bg-black border-white/20 focus:ring-primary"
              />
              <label htmlFor="manual-user-toggle" className="text-sm font-semibold select-none cursor-pointer">
                Recipient is not registered (Enter name manually)
              </label>
            </div>

            {/* Recipient Input/Search */}
            <div className="space-y-4 mb-4">
              {!isManualUser ? (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-gray-400">Search User *</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by student name or email..."
                      className="w-full p-4 bg-black border border-white/10 rounded-xl focus:border-primary outline-none transition-all pl-12"
                    />
                    <Search className="absolute left-4 top-4 w-5 h-5 text-gray-500" />
                  </div>

                  <div className="mt-3 space-y-2 max-h-[180px] overflow-y-auto custom-scrollbar">
                    {searchLoading && (
                      <div className="text-center py-4 text-gray-500 text-sm">Searching database...</div>
                    )}
                    
                    {!searchLoading && searchResults.map((usr) => (
                      <button
                        key={usr.id}
                        onClick={() => setSelectedUser(usr)}
                        className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between group ${
                          selectedUser?.id === usr.id 
                          ? 'bg-primary/20 border-primary text-white' 
                          : 'bg-white/5 border-white/5 hover:border-white/20 text-gray-300'
                        }`}
                      >
                        <div>
                          <p className="font-bold text-sm">{usr.name}</p>
                          <p className="text-xs text-gray-500">{usr.email}</p>
                        </div>
                        <User className={`w-4 h-4 ${selectedUser?.id === usr.id ? 'text-primary' : 'text-gray-600 group-hover:text-gray-400'}`} />
                      </button>
                    ))}

                    {searchQuery.length >= 2 && searchResults.length === 0 && !searchLoading && (
                      <div className="text-center py-4 text-gray-500 text-sm">No users found matching "{searchQuery}"</div>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-gray-400">Recipient Name *</label>
                  <input
                    type="text"
                    value={manualName}
                    onChange={(e) => setManualName(e.target.value)}
                    placeholder="Enter full name of recipient..."
                    className="w-full p-4 bg-black border border-white/10 rounded-xl focus:border-primary outline-none transition-all"
                  />
                </div>
              )}

              {/* Selected User Display */}
              {selectedUser && !isManualUser && (
                <div className="bg-primary/10 p-3 rounded-xl border border-primary/30 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-xs text-primary font-bold uppercase">Recipient Locked</p>
                      <p className="font-bold text-sm">{selectedUser.name}</p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedUser(null)} className="text-gray-500 hover:text-white transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Event Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-gray-400">Event Name *</label>
                <input
                  type="text"
                  value={form.event_name}
                  onChange={(e) => setForm({ ...form, event_name: e.target.value })}
                  placeholder="e.g. Heighers BGMI Invitational"
                  className="w-full p-4 bg-black border border-white/10 rounded-xl focus:border-primary outline-none transition-all"
                />
              </div>

              {/* Position */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-gray-400">Position / Achievement</label>
                <input
                  type="text"
                  value={form.position}
                  onChange={(e) => setForm({ ...form, position: e.target.value })}
                  placeholder="e.g. Winner, Runner Up, MVP (Optional)"
                  className="w-full p-4 bg-black border border-white/10 rounded-xl focus:border-primary outline-none transition-all"
                />
              </div>

              {/* Action Button */}
              <button
                onClick={handleGenerate}
                disabled={loading || (!selectedUser && !isManualUser)}
                className="w-full bg-primary hover:bg-primary/80 text-black px-6 py-4 rounded-xl font-bold uppercase tracking-widest transition-all disabled:opacity-30 disabled:cursor-not-allowed mt-4 shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
              >
                {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : "Generate ID & Verify Url →"}
              </button>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-medium">
                {error}
              </div>
            )}
          </div>

          {/* STEP 2: Certificate Design Layout Controls (Rendered only after generating Cert ID) */}
          {generateData && (
            <div className="bg-secondary/10 p-6 rounded-2xl border border-white/5 backdrop-blur-sm shadow-xl space-y-6 animate-in slide-in-from-bottom-5 duration-300">
              <h2 className="text-xl font-bold flex items-center gap-2 border-b border-white/10 pb-3 text-primary">
                <Type className="w-5 h-5 text-primary" />
                2. Overlay Customization
              </h2>

              {/* File Upload for Template */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400">Upload PNG Design Template</label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/15 rounded-xl cursor-pointer hover:bg-white/5 transition-all">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-300 font-semibold">Click to select certificate image</p>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG, or WEBP (Higher Resolution recommended)</p>
                    </div>
                    <input type="file" accept="image/*" className="hidden" onChange={handleTemplateUpload} />
                  </label>
                </div>
                {templateFile && (
                  <p className="text-xs text-green-400 font-medium">✓ Uploaded: {templateFile.name}</p>
                )}
              </div>

              {templateImage && (
                <div className="space-y-6 pt-4 border-t border-white/15">
                  
                  {/* Recipient Name Coordinates */}
                  <div>
                    <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wide mb-3">Recipient Name Coordinates</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-gray-500">X Coordinate (%): {design.nameX}%</label>
                        <input
                          type="range" min="0" max="100" value={design.nameX}
                          onChange={(e) => handleDesignChange("nameX", Number(e.target.value))}
                          className="w-full accent-primary bg-black"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Y Coordinate (%): {design.nameY}%</label>
                        <input
                          type="range" min="0" max="100" value={design.nameY}
                          onChange={(e) => handleDesignChange("nameY", Number(e.target.value))}
                          className="w-full accent-primary bg-black"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-3 items-center">
                      <div>
                        <label className="text-xs text-gray-500">Size (px)</label>
                        <input
                          type="number" value={design.nameFontSize}
                          onChange={(e) => handleDesignChange("nameFontSize", Number(e.target.value))}
                          className="w-full bg-black border border-white/10 rounded px-2 py-1 text-sm focus:border-primary outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Color</label>
                        <input
                          type="color" value={design.nameColor}
                          onChange={(e) => handleDesignChange("nameColor", e.target.value)}
                          className="w-full h-8 rounded bg-transparent cursor-pointer border border-white/10"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Align</label>
                        <select
                          value={design.nameAlign}
                          onChange={(e) => handleDesignChange("nameAlign", e.target.value)}
                          className="w-full bg-black border border-white/10 rounded px-2 py-1 text-sm text-gray-300 outline-none"
                        >
                          <option value="left">Left</option>
                          <option value="center">Center</option>
                          <option value="right">Right</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Position Coordinates */}
                  {generateData?.position && (
                    <div className="pt-4 border-t border-white/10">
                      <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wide mb-3">Position Coordinates</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-gray-500">X Coordinate (%): {design.posX}%</label>
                          <input
                            type="range" min="0" max="100" value={design.posX}
                            onChange={(e) => handleDesignChange("posX", Number(e.target.value))}
                            className="w-full accent-primary bg-black"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500">Y Coordinate (%): {design.posY}%</label>
                          <input
                            type="range" min="0" max="100" value={design.posY}
                            onChange={(e) => handleDesignChange("posY", Number(e.target.value))}
                            className="w-full accent-primary bg-black"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 mt-3 items-center">
                        <div>
                          <label className="text-xs text-gray-500">Size (px)</label>
                          <input
                            type="number" value={design.posFontSize}
                            onChange={(e) => handleDesignChange("posFontSize", Number(e.target.value))}
                            className="w-full bg-black border border-white/10 rounded px-2 py-1 text-sm focus:border-primary outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500">Color</label>
                          <input
                            type="color" value={design.posColor}
                            onChange={(e) => handleDesignChange("posColor", e.target.value)}
                            className="w-full h-8 rounded bg-transparent cursor-pointer border border-white/10"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500">Align</label>
                          <select
                            value={design.posAlign}
                            onChange={(e) => handleDesignChange("posAlign", e.target.value)}
                            className="w-full bg-black border border-white/10 rounded px-2 py-1 text-sm text-gray-300 outline-none"
                          >
                            <option value="left">Left</option>
                            <option value="center">Center</option>
                            <option value="right">Right</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Event Coordinates */}
                  <div className="pt-4 border-t border-white/10">
                    <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wide mb-3">Event Name Coordinates</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-gray-500">X Coordinate (%): {design.eventX}%</label>
                        <input
                          type="range" min="0" max="100" value={design.eventX}
                          onChange={(e) => handleDesignChange("eventX", Number(e.target.value))}
                          className="w-full accent-primary bg-black"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Y Coordinate (%): {design.eventY}%</label>
                        <input
                          type="range" min="0" max="100" value={design.eventY}
                          onChange={(e) => handleDesignChange("eventY", Number(e.target.value))}
                          className="w-full accent-primary bg-black"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-3 items-center">
                      <div>
                        <label className="text-xs text-gray-500">Size (px)</label>
                        <input
                          type="number" value={design.eventFontSize}
                          onChange={(e) => handleDesignChange("eventFontSize", Number(e.target.value))}
                          className="w-full bg-black border border-white/10 rounded px-2 py-1 text-sm focus:border-primary outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Color</label>
                        <input
                          type="color" value={design.eventColor}
                          onChange={(e) => handleDesignChange("eventColor", e.target.value)}
                          className="w-full h-8 rounded bg-transparent cursor-pointer border border-white/10"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Align</label>
                        <select
                          value={design.eventAlign}
                          onChange={(e) => handleDesignChange("eventAlign", e.target.value)}
                          className="w-full bg-black border border-white/10 rounded px-2 py-1 text-sm text-gray-300 outline-none"
                        >
                          <option value="left">Left</option>
                          <option value="center">Center</option>
                          <option value="right">Right</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* QR Code Coordinates */}
                  <div className="pt-4 border-t border-white/10">
                    <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wide mb-3">Verification QR Code</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs text-gray-500">X (%): {design.qrX}%</label>
                        <input
                          type="range" min="0" max="100" value={design.qrX}
                          onChange={(e) => handleDesignChange("qrX", Number(e.target.value))}
                          className="w-full accent-primary bg-black"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Y (%): {design.qrY}%</label>
                        <input
                          type="range" min="0" max="100" value={design.qrY}
                          onChange={(e) => handleDesignChange("qrY", Number(e.target.value))}
                          className="w-full accent-primary bg-black"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Size (px)</label>
                        <input
                          type="number" value={design.qrSize}
                          onChange={(e) => handleDesignChange("qrSize", Number(e.target.value))}
                          className="w-full bg-black border border-white/10 rounded px-2 py-1 text-sm focus:border-primary outline-none"
                        />
                      </div>
                    </div>
                  </div>

                </div>
              )}
            </div>
          )}

        </div>

        {/* RIGHT PANEL: Live Certificate Rendering & Preview */}
        <div className="lg:col-span-7 space-y-6">
          {generateData && (
            <div className="bg-green-500/10 p-6 rounded-2xl border border-green-500/30 shadow-lg text-center animate-in zoom-in-95">
              <p className="text-green-400 font-bold mb-3 flex items-center justify-center gap-2 uppercase tracking-widest text-sm">
                <CheckCircle2 className="w-5 h-5" />
                Certificate Generated Successfully
              </p>
              
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-black/40 p-4 rounded-xl border border-white/5">
                <div className="text-left">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Generated ID</p>
                  <p className="text-xl font-mono font-bold text-yellow-400">{generateData.certificate_id}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg hover:bg-white/10 border border-white/10 text-sm font-semibold transition-colors"
                  >
                    <Copy className="w-4 h-4" /> Copy ID
                  </button>
                  <a
                    href={`/certificate-verify?id=${encodeURIComponent(generateData.certificate_id)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-primary/20 hover:bg-primary/30 rounded-lg border border-primary/20 text-sm font-semibold text-primary transition-colors"
                  >
                    <Eye className="w-4 h-4" /> Open Verification
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Canvas Preview Box */}
          <div className="bg-secondary/10 p-6 rounded-2xl border border-white/5 backdrop-blur-sm shadow-xl flex flex-col items-center">
            <h2 className="text-xl font-bold mb-5 flex items-center gap-2 border-b border-white/10 pb-3 w-full text-primary">
              <Eye className="w-5 h-5 text-primary" />
              Certificate Render Preview
            </h2>

            {generateData ? (
              templateImage ? (
                <div className="w-full flex flex-col items-center gap-6">
                  {/* Scaled Responsive Canvas Container */}
                  <div className="border border-white/10 rounded-xl overflow-hidden bg-black/40 shadow-inner w-full max-w-[580px]">
                    <canvas ref={canvasRef} className="w-full h-auto block" />
                  </div>

                  <button
                    onClick={downloadCertificate}
                    className="flex items-center gap-2 bg-primary hover:bg-primary/80 text-black px-8 py-4 rounded-xl font-bold uppercase tracking-wider shadow-lg shadow-primary/10 hover:scale-102 transition-all"
                  >
                    <Download className="w-5 h-5" />
                    Download Final PNG
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center text-gray-500 border-2 border-dashed border-white/10 rounded-xl w-full max-w-[580px]">
                  <Upload className="w-12 h-12 text-gray-600 mb-3" />
                  <p className="font-semibold text-gray-400 mb-1">No Template Uploaded</p>
                  <p className="text-xs text-gray-600 px-4">Upload a certificate PNG template design under Section 2 to start customizing text overlays.</p>
                </div>
              )
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center text-gray-600 w-full">
                <Award className="w-16 h-16 text-gray-700 mb-3" />
                <p className="font-semibold text-gray-500 mb-1">Awaiting Certificate Credentials</p>
                <p className="text-xs text-gray-600 px-4 max-w-sm">Complete Step 1 on the left panel to register credentials and unlock the interactive canvas overlay system.</p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
