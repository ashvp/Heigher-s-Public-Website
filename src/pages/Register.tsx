import { useState } from "react";
import "../styles/register.css";
import { registerUser } from "@/lib/api";

const emailRegex = /^[0-9]{2}f[0-9]{7}@ds\.study\.iitm\.ac\.in$/;

export default function Register() {
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
      e.email = "Use IITM BS email format";
    if (!form.whatsapp) e.whatsapp = "WhatsApp number required";
    if (!form.discord) e.discord = "Discord ID required";
    if (!form.education) e.education = "Select education status";
    if (form.education === "Other" && !form.education_other)
      e.education_other = "Please specify";
    if (!form.level) e.level = "Select level";
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

    try {
      await registerUser(form);
      alert("Registration successful!");
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

          <div className="label">Discord ID *</div>
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
              <input type="radio" name="education" />
              <span>IITM BS</span>
            </label>

            <label className="option">
              <input type="radio" name="education" />
              <span>IITM BS + Other Degree</span>
            </label>

            <label className="option">
              <input type="radio" name="education" />
              <span>IITM On-campus</span>
            </label>

            <label className="option">
              <input type="radio" name="education" />
              <span>Working Professional</span>
            </label>

            <label className="option">
              <input type="radio" name="education" />
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
                  <input type="radio" name="level" />
                  <span>{level}</span>
                </label>
              )
            )}
          </div>

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
                  <input type="checkbox" />
                  <span>{game}</span>
                </label>
              )
            )}
          </div>
          {form.games === "Other" && (
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
              <input type="radio" name="volunteer" />
              <span>Yes</span>
            </label>

            <label className="option">
              <input type="radio" name="volunteer" />
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
