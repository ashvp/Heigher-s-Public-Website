import { useState } from "react";
import "../styles/register.css";
import { registerUser } from "@/lib/api";
import { useNavigate} from "react-router-dom";
import { useEffect,useRef } from "react";




const emailRegex = /^[^\s@]+@([a-z0-9-]+\.)*iitm\.ac\.in$/i;

export default function Register() {
  const navigate = useNavigate();
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

  const validate = () => {
    const e: any = {};

    if (!form.full_name) e.full_name = "Full name is required";
    if (!form.age) e.age = "Age is required";
    if (!form.gender) e.gender = "Select gender";
    if (form.gender === "Other" && !form.gender_other)
      e.gender_other = "Please specify";
    if (!emailRegex.test(form.email))
      e.email = "Use IITM email ";
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

  // Auth not implemented yet
  firebase_uid: "",

  // Discord is optional
  ...(form.discord && { discord_id: form.discord }),

  professional_info: {
    education_status: form.education,
    other_college_name:
      form.education === "Other" ? form.education_other : "",
    current_level_in_IITM: form.level==="Other" ? form.level_other : form.level,
    
  },

  hostel_info: {
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
      navigate("/");
    } catch (err: any) {
      alert(err?.message || "Submission failed");
    }
  };
const [houseOpen, setHouseOpen] = useState(false);
  return (
    <div className="register-page">
      <div className="form-wrapper">
        <h1 className="form-title">
          Heighers eSports Society <span>Membership Form</span>
        </h1>
        <p className="form-sub">
          Fill this form to become a member of Heighers eSports Club, IITM BS.
          
        </p>
        <p className="form-link">Our Socials: <a href=" https://linktr.ee/heighers.esports_iitm">https://linktr.ee/heighers.esports_iitm</a></p>
        <p className="required-note">* Indicates required question</p>

        {/* PERSONAL INFO */}
        <div className="form-card">
          <div className="label">Full Name *</div>
          <input
            className={`input ${errors.full_name && "warning"}`}
            onChange={(e) => update("full_name", e.target.value)}
          />
          {errors.full_name && (
            <p className="warning-text">{errors.full_name}</p>
          )}

          <div className="label">Age *</div>
          <input
            className={`input ${errors.age && "warning"}`}
            type="number"
            onChange={(e) => update("age", e.target.value)}
          />

          <div className="label">Gender *</div>
          <div className="radio-group">
            {["Male", "Female", "Prefer not to say", "Other"].map((g) => (
              <label key={g}>
                <input
                  type="radio"
                  name="gender"
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
            className={`input ${errors.email && "error"}`}
            onChange={(e) => update("email", e.target.value)}
          />
          {errors.email && (
            <p className="error-text">{errors.email}</p>
          )}

          <div className="label">WhatsApp Number *</div>
          <input
            className={`input ${errors.whatsapp && "warning"}`}
            onChange={(e) => update("whatsapp", e.target.value)}
          />

          <div className="label">Alternate Number</div>
          <input
            className="input"
            onChange={(e) => update("alternate", e.target.value)}
          />

          <div className="label">Discord ID </div>
          <input
            className={`input ${errors.discord && "warning"}`}
            onChange={(e) => update("discord", e.target.value)}
          />
        </div>

        {/* EDUCATION */}
        <div className="form-card">
          <div className="label">Education Status *</div>

          <div className="option-group">
            <label className="option">
              <input type="radio" name="education"  onChange={() => update("education", "IITM BS")} />
              <span>IITM BS</span>
            </label>

            <label className="option">
              <input type="radio" name="education"  onChange={() => update("education", "IITM BS + Other Degree")} />
              <span>IITM BS + Other Degree</span>
            </label>

            <label className="option">
              <input type="radio" name="education"  onChange={() => update("education", "IITM On-campus")} />
              <span>IITM On-campus</span>
            </label>

            <label className="option">
              <input type="radio" name="education"  onChange={() => update("education", "Working Professional")} />
              <span>Working Professional</span>
            </label>

            <label className="option">
              <input type="radio" name="education" onChange={() => update("education", "Other")} />
              <span>Other</span>
            </label>
            
          </div>
          {form.education === "Other" && (
            <input
              className="input"
              placeholder="Specify"
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
                  <input type="radio" name="level" onChange={() => update("level", level)}/>
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
<p className="form-sub">FIll up below form to know your House and then choose accordingly. </p>
<p className="form-link">Form Link<a href="https://forms.gle/nPNwKNwDyFXbquJL9">https://forms.gle/nPNwKNwDyFXbquJL9</a></p>
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
                  <input type="checkbox" onChange={(e) => {
    if (e.target.checked) {
      update("games", [...form.games, game]);
    } else {
      update(
        "games",
        form.games.filter((g: string) => g !== game)
      );
    }
  }}/>
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
              <input type="radio" name="volunteer" onChange={() => update("volunteer", "yes")}/>
              <span>Yes</span>
            </label>

            <label className="option">
              <input type="radio" name="volunteer" onChange={() => update("volunteer", "no")}/>
              <span>No</span>
            </label>
          </div>

          <div className="label">
            Suggestions / Expectations
          </div>
          <textarea
            className="input"
            rows={3}
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
          <p className="form-link">Heighers Code of Conduct: <a href="https://bit.ly/he-code-of-conduct">https://bit.ly/he-code-of-conduct</a></p>
          <label>
            <input
              type="checkbox"
              onChange={(e) =>
                update("acknowledged", e.target.checked)
              }
            />
            &nbsp; I agree to the Heighers Code of Conduct
          </label>
        </div>

        <button className="submit-btn" onClick={submit}>
          Submit
        </button>
      </div>
    </div>
  );
}
