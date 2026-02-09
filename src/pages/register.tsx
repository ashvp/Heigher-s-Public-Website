import { useState, useEffect } from "react";
import "../styles/register.css";
import { registerUser, checkUserExists } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup, signOut, onAuthStateChanged, User } from "firebase/auth";

const emailRegex = /^[^\s@]+@([a-z0-9-]+\.)*iitm\.ac\.in$/i;

export default function Register() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);

  const [form, setForm] = useState<any>({
    full_name: "",
    age: "",
    gender: "",
    gender_other: "",
    email: "",
    whatsapp: "",
    alternate: "",
    discord: "",
    education: "",
    education_other: "",
    level: "",
    house: "",
    games: [],
    volunteer: "",
    suggestions: "",
    acknowledged: false,
  });

  const [errors, setErrors] = useState<any>({});
  const update = (k: string, v: any) => setForm({ ...form, [k]: v });

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        if (!emailRegex.test(currentUser.email || "")) {
          alert("Please sign in with your IITM student email (@*.iitm.ac.in).");
          signOut(auth);
          setLoading(false);
          return;
        }
        
        try {
          // Check if already registered
          const status = await checkUserExists(currentUser.uid);
          if (status.exists) {
            setIsRegistered(true);
          }
        } catch (error) {
          console.error("Failed to check registration status", error);
        }

        setUser(currentUser);
        // Pre-fill form
        setForm((prev: any) => ({
          ...prev,
          full_name: currentUser.displayName || "",
          email: currentUser.email || "",
        }));
      } else {
        setUser(null);
        setIsRegistered(false);
      }
      setLoading(false);
    }, (error) => {
      console.error("Auth State Error:", error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      console.error("Login failed", error);
      alert("Login failed: " + error.message);
    }
  };

  const handleHomePageNavigation = () => {
    navigate("/");
  };

  const handleLogout = async () => {
    await signOut(auth);
    setIsRegistered(false);
    setForm({
      full_name: "",
      age: "",
      gender: "",
      gender_other: "",
      email: "",
      whatsapp: "",
      alternate: "",
      discord: "",
      education: "",
      education_other: "",
      level: "",
      house: "",
      games: [],
      volunteer: "",
      suggestions: "",
      acknowledged: false,
    });
  };

  const validate = () => {
    const e: any = {};

    if (!form.full_name) e.full_name = "Full name is required";
    if (!form.age) e.age = "Age is required";
    if (!form.gender) e.gender = "Select gender";
    if (form.gender === "Other" && !form.gender_other)
      e.gender_other = "Please specify";
    // Email is validated by Auth, but double check
    if (!form.email || !emailRegex.test(form.email))
      e.email = "Invalid IITM email";
    if (!form.whatsapp) e.whatsapp = "WhatsApp number required";
    if (!form.education) e.education = "Select education status";
    if (form.education === "Other" && !form.education_other)
      e.education_other = "Please specify";
    if (!form.level) e.level = "Select level";
    if (form.level === "Other" && !form.level_other)
      e.level_other = "Please specify";
    
    if (!form.house) e.house = "House required";
    if (form.games.length === 0)
      e.games = "Select at least one game";
    if (!form.volunteer) e.volunteer = "Required";
    if (!form.acknowledged) e.acknowledged = "You must agree";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    if (!user) {
      alert("You must be signed in to register.");
      return;
    }

    if (!validate()) {
      document
        .querySelector(".error, .warning")
        ?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    const payload = {
      name: form.full_name,
      age: Number(form.age),
      gender: form.gender === "Other" ? form.gender_other : form.gender,
      phone_number: form.whatsapp,
      alternate_phone_number: form.alternate || null,
      email: form.email,
      firebase_uid: user.uid, // Use actual UID from Auth
      ...(form.discord && { discord_id: form.discord }),
      professional_info: {
        education_status: form.education,
        other_college_name:
          form.education === "Other" ? form.education_other : "",
        current_level_in_IITM: form.level === "Other" ? form.level_other : form.level,
        house_name: form.house,
      },
      additional_info: {
        willing_to_volunteer: form.volunteer === "yes",
        suggestions: form.suggestions || "",
        accepted_terms: form.acknowledged,
      },
      games: form.games,
    };

    try {
      await registerUser(payload);
      alert("Registration successful!");
      setIsRegistered(true); // Update local state so they see the success message
    } catch (err: any) {
      console.error(err);
      alert(err?.message || "Submission failed");
    }
  };

  const [houseOpen, setHouseOpen] = useState(false);

  if (loading) return <div className="register-page flex items-center justify-center min-h-[60vh]"><div className="text-xl">Loading...</div></div>;

  if (!user) {
    return (
      <div className="register-page flex items-center justify-center min-h-[60vh]">
        <div className="form-wrapper text-center flex flex-col items-center max-w-md w-full p-8">
          <h1 className="form-title">
            Heighers eSports Society <span>Membership</span>
          </h1>
          <p className="form-sub mb-8 text-muted-foreground">
            Please sign in with your IITM Student Email to continue.
          </p>
          <button 
            className="submit-btn flex items-center justify-center gap-3 w-full max-w-xs hover:scale-105 transition-transform duration-200" 
            onClick={handleGoogleLogin}
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5 bg-white rounded-full p-0.5" />
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  if (isRegistered) {
    return (
      <div className="register-page flex items-center justify-center min-h-[60vh]">
        <div className="form-wrapper text-center flex flex-col items-center max-w-md w-full p-8">
          <h1 className="form-title text-green-500 mb-4">
            Registration Complete!
          </h1>
          <p className="form-sub mb-8 text-lg">
            You are already a registered member of Heighers eSports Society.
          </p>
          <div className="bg-secondary/20 p-4 rounded-lg mb-6 w-full">
            <p className="text-sm text-muted-foreground">Signed in as:</p>
            <p className="font-bold text-primary">{user.email}</p>
          </div>
          <button onClick={handleHomePageNavigation} className="submit-btn w-full mb-4">
            Back to Website
          </button>
          <button onClick={handleLogout} className="text-red-400 hover:underline text-sm">
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="register-page">
      <div className="form-wrapper">
        <div className="flex justify-between items-center mb-6">
          <h1 className="form-title mb-0">
            Heighers eSports <span>Membership</span>
          </h1>
          <button onClick={handleLogout} className="text-sm text-red-400 hover:underline">
            Sign Out
          </button>
        </div>
        
        <p className="form-sub">
          Welcome, <strong>{user.displayName}</strong>! <br/>
          Fill this form to become a member of Heighers eSports Club.
        </p>
        <p className="form-link">Our Socials: <a href=" https://linktr.ee/heighers.esports_iitm">https://linktr.ee/heighers.esports_iitm</a></p>
        <p className="required-note">* Indicates required question</p>

        {/* PERSONAL INFO */}
        <div className="form-card">
          <div className="label">Full Name *</div>
          <input
            className={`input ${errors.full_name && "warning"}`}
            value={form.full_name}
            onChange={(e) => update("full_name", e.target.value)}
          />
          {errors.full_name && (
            <p className="warning-text">{errors.full_name}</p>
          )}

          <div className="label">Age *</div>
          <input
            className={`input ${errors.age && "warning"}`}
            type="number"
            value={form.age}
            onChange={(e) => update("age", e.target.value)}
          />

          <div className="label">Gender *</div>
          <div className="radio-group">
            {["Male", "Female", "Prefer not to say", "Other"].map((g) => (
              <label key={g}>
                <input
                  type="radio"
                  name="gender"
                  checked={form.gender === g}
                  onChange={() => update("gender", g)}
                />{" "}
                {g}
              </label>
            ))}
          </div>

          {form.gender === "Other" && (
            <input
              className="input"
              placeholder="Specify"
              value={form.gender_other}
              onChange={(e) =>
                update("gender_other", e.target.value)
              }
            />
          )}
        </div>

        {/* CONTACT */}
        <div className="form-card">
          <div className="label">Email *</div>
          <input
            className="input disabled"
            value={form.email}
            disabled
            title="Signed in via Google"
          />
          <p className="text-xs text-muted-foreground mt-1"> verified via Google</p>

          <div className="label">WhatsApp Number *</div>
          <input
            className={`input ${errors.whatsapp && "warning"}`}
            value={form.whatsapp}
            onChange={(e) => update("whatsapp", e.target.value)}
          />

          <div className="label">Alternate Number</div>
          <input
            className="input"
            value={form.alternate}
            onChange={(e) => update("alternate", e.target.value)}
          />

          <div className="label">Discord ID </div>
          <input
            className={`input ${errors.discord && "warning"}`}
            value={form.discord}
            onChange={(e) => update("discord", e.target.value)}
          />
        </div>

        {/* EDUCATION */}
        <div className="form-card">
          <div className="label">Education Status *</div>

          <div className="option-group">
            {["IITM BS", "IITM BS + Other Degree", "IITM On-campus", "Working Professional", "Other"].map(opt => (
               <label key={opt} className="option">
               <input 
                 type="radio" 
                 name="education" 
                 checked={form.education === opt}
                 onChange={() => update("education", opt)} 
               />
               <span>{opt}</span>
             </label>
            ))}
          </div>
          {form.education === "Other" && (
            <input
              className="input"
              placeholder="Specify"
              value={form.education_other}
              onChange={(e) =>
                update("education_other", e.target.value)
              }
            />
          )}
        </div>

        {/* CURRENT IITM LEVEL */}
        <div className="form-card">
          <div className="label">
            Current IITM Level <span className="required">*</span>
          </div>

          <div className="option-group vertical">
            {["Foundation", "Diploma", "Degree", "BS", "Other"].map(
              (level) => (
                <label key={level} className="option">
                  <input 
                    type="radio" 
                    name="level" 
                    checked={form.level === level}
                    onChange={() => update("level", level)}
                  />
                  <span>{level}</span>
                </label>
              )
            )}
          </div>
          {form.level === "Other" && (
            <>
              <input
                type="text"
                className="input"
                placeholder="Specify your IITM level"
                value={form.level_other}
                onChange={(e) => update("level_other", e.target.value)}
              />
              {errors.level_other && (
                <p className="warning-text">{errors.level_other}</p>
              )}
            </>
          )}

          {errors.level && (
            <p className="warning-text">{errors.level}</p>
          )}
        </div>

        {/* HOUSE */}
       
        <div className="form-card">
          <div className="label">House *</div>
          <p className="form-sub">Fill up below form to know your House and then choose accordingly. </p>
          <p className="form-link">Form Link: <a href="https://forms.gle/nPNwKNwDyFXbquJL9" target="_blank" rel="noreferrer">https://forms.gle/nPNwKNwDyFXbquJL9</a></p>
          <div
            className="custom-select"
            onClick={() => setHouseOpen(!houseOpen)}
          >
            {form.house || "Select House"}
          </div>

          {houseOpen && (
            <div className="custom-options">
              {["Bandipur","Corbett","Gir","Kanha","Kaziranga","Namdapha","Nallamala","Nilgiri","Pichavaram","Wayand","Sundarban","Saranda","House not allotted yet","Not Applicable"].map(h => (
                <div
                  key={h}
                  className="custom-option"
                  onClick={() => {
                    update("house", h);
                    setHouseOpen(false);
                  }}
                >
                  {h}
                </div>
              ))}
            </div>
          )}

          {errors.house && (
            <p className="warning-text">{errors.house}</p>
          )}
        </div>

        {/* GAMES */}
        <div className="form-card">
          <div className="label">
            Games of Interest <span className="required">*</span>
          </div>

          <div className="option-group">
            {["BGMI", "Brawl Stars","Call of Duty Mobile","Clash Of Clans","Clash Royale","Free Fire","Scribbl.io","Smash Karts","Rocket League","Stumble/Fall Guys","Valorant","Other"].map(
              (game) => (
                <label key={game} className="option">
                  <input 
                    type="checkbox" 
                    checked={form.games.includes(game)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        update("games", [...form.games, game]);
                      } else {
                        update(
                          "games",
                          form.games.filter((g: string) => g !== game)
                        );
                      }
                    }}
                  />
                  <span>{game}</span>
                </label>
              )
            )}
          </div>
          {form.games.includes("Other") && (
            <input
              className="input"
              placeholder="Specify"
              onChange={(e) =>
                update("games_other", e.target.value)
              }
            />
          )}
        </div>

        {/* VOLUNTEER */}
        <div className="form-card">
          <div className="label">
            Interested in Volunteering?{" "}
            <span className="required">*</span>
          </div>

          <div className="option-group">
            <label className="option">
              <input 
                type="radio" 
                name="volunteer" 
                checked={form.volunteer === "yes"}
                onChange={() => update("volunteer", "yes")}
              />
              <span>Yes</span>
            </label>

            <label className="option">
              <input 
                type="radio" 
                name="volunteer" 
                checked={form.volunteer === "no"}
                onChange={() => update("volunteer", "no")}
              />
              <span>No</span>
            </label>
          </div>

          <div className="label">
            Suggestions / Expectations
          </div>
          <textarea
            className="input"
            rows={3}
            value={form.suggestions}
            onChange={(e) =>
              update("suggestions", e.target.value)
            }
          />
        </div>

        {/* ACK */}
        <div className="form-card">
          <div className="label">
            ACKNOWLEDGEMENT<span className="required">*</span>
          </div>
          <p className="form-link">Heighers Code of Conduct: <a href="https://bit.ly/he-code-of-conduct" target="_blank" rel="noreferrer">https://bit.ly/he-code-of-conduct</a></p>
          <label>
            <input
              type="checkbox"
              checked={form.acknowledged}
              onChange={(e) =>
                update("acknowledged", e.target.checked)
              }
            />
            &nbsp; I agree to the Heighers Code of Conduct
          </label>
        </div>

        <button className="submit-btn" onClick={submit}>
          Submit Registration
        </button>
      </div>
    </div>
  );
}
