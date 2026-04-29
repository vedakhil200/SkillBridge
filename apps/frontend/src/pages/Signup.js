import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    college: "",
    location: "",
    teachSkills: [],
    learnSkills: [],
    availability: "Online",
  });

  const [teachInput, setTeachInput] = useState("");
  const [learnInput, setLearnInput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // normal inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // add teach skill
  const addTeachSkill = (e) => {
    e.preventDefault();

    if (!teachInput.trim()) return;

    setFormData((prev) => ({
      ...prev,
      teachSkills: [...prev.teachSkills, teachInput.trim()],
    }));

    setTeachInput("");
  };

  // add learn skill
  const addLearnSkill = (e) => {
    e.preventDefault();

    if (!learnInput.trim()) return;

    setFormData((prev) => ({
      ...prev,
      learnSkills: [...prev.learnSkills, learnInput.trim()],
    }));

    setLearnInput("");
  };

  // availability
  const setAvailability = (type) => {
    setFormData((prev) => ({
      ...prev,
      availability: type,
    }));
  };

  // signup submit
  const handleSignup = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await authAPI.signup(formData);

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <Link to="/" className="back">
          ← Back to home
        </Link>

        <div className="signup-card">
          <h2>Create your account</h2>

          <p className="subtitle">
            Join the skill exchange community
          </p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSignup}>
            {/* NAME + EMAIL */}
            <div className="row">
              <div className="field">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="field">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="you@uni.edu"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="field">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Min 6 characters"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              <small>Must be at least 6 characters</small>
            </div>

            {/* COLLEGE + LOCATION */}
            <div className="row">
              <div className="field">
                <label>College</label>
                <input
                  type="text"
                  name="college"
                  placeholder="MIT"
                  value={formData.college}
                  onChange={handleInputChange}
                />
              </div>

              <div className="field">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  placeholder="Boston, MA"
                  value={formData.location}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* TEACH */}
            <div className="field">
              <label>Skills You Can Teach</label>

              <div className="skill-row">
                <input
                  type="text"
                  placeholder="e.g. Python"
                  value={teachInput}
                  onChange={(e) => setTeachInput(e.target.value)}
                />

                <button onClick={addTeachSkill}>
                  Add
                </button>
              </div>

              <small>Add skills you can teach others</small>

              {formData.teachSkills.length > 0 && (
                <div className="tags-list">
                  {formData.teachSkills.map((item, index) => (
                    <span key={index} className="tag">
                      {item}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* LEARN */}
            <div className="field">
              <label>Skills You Want to Learn</label>

              <div className="skill-row">
                <input
                  type="text"
                  placeholder="e.g. React"
                  value={learnInput}
                  onChange={(e) => setLearnInput(e.target.value)}
                />

                <button onClick={addLearnSkill}>
                  Add
                </button>
              </div>

              <small>What do you want to learn?</small>

              {formData.learnSkills.length > 0 && (
                <div className="tags-list">
                  {formData.learnSkills.map((item, index) => (
                    <span key={index} className="tag">
                      {item}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* AVAILABILITY */}
            <div className="field">
              <label>Availability</label>

              <div className="availability">
                <button
                  type="button"
                  className={
                    formData.availability === "Online"
                      ? "active"
                      : ""
                  }
                  onClick={() => setAvailability("Online")}
                >
                  Online
                </button>

                <button
                  type="button"
                  className={
                    formData.availability === "Offline"
                      ? "active"
                      : ""
                  }
                  onClick={() => setAvailability("Offline")}
                >
                  Offline
                </button>

                <button
                  type="button"
                  className={
                    formData.availability === "Both"
                      ? "active"
                      : ""
                  }
                  onClick={() => setAvailability("Both")}
                >
                  Both
                </button>
              </div>

              <small>Select how you prefer to connect</small>
            </div>

            {/* SUBMIT */}
            <button
              className="signup-btn-main"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </button>
          </form>

          <p className="extra">
            Already have an account?{" "}
            <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;