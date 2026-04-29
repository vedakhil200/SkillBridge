import React, { useEffect, useState } from "react";
import { userAPI } from "../services/userApi";
import "../style.css";

const dummyUsers = [
  {
    name: "Alex Chen",
    college: "MIT",
    location: "Boston, MA",
    rating: "4.8",
    teaches: ["React", "JavaScript", "Node.js"],
    learns: ["Python", "Machine Learning"],
    img: "https://i.pravatar.cc/100?img=1",
  },
  {
    name: "Maya Patel",
    college: "Stanford",
    location: "Palo Alto, CA",
    rating: "4.9",
    teaches: ["Python", "ML", "SQL"],
    learns: ["React", "UI Design"],
    img: "https://i.pravatar.cc/100?img=5",
  },
  {
    name: "Jordan Rivera",
    college: "UCLA",
    location: "Los Angeles, CA",
    rating: "4.7",
    teaches: ["UI Design", "Figma", "Graphic Design"],
    learns: ["Node.js", "Python"],
    img: "https://i.pravatar.cc/100?img=8",
  },
  {
    name: "Priya Sharma",
    college: "Georgia Tech",
    location: "Atlanta, GA",
    rating: "4.6",
    teaches: ["Flutter", "Dart", "Firebase"],
    learns: ["React", "AWS"],
    img: "https://i.pravatar.cc/100?img=12",
  },
  {
    name: "Sam Wilson",
    college: "Carnegie Mellon",
    location: "Pittsburgh, PA",
    rating: "4.5",
    teaches: ["Cybersecurity", "Linux", "Networking"],
    learns: ["UI Design", "Web Dev"],
    img: "https://i.pravatar.cc/100?img=15",
  },
  {
    name: "Luna Zhang",
    college: "UC Berkeley",
    location: "Berkeley, CA",
    rating: "4.9",
    teaches: ["Machine Learning", "TensorFlow", "Python"],
    learns: ["Graphic Design"],
    img: "https://i.pravatar.cc/100?img=20",
  },
  {
    name: "Carlos Mendez",
    college: "UT Austin",
    location: "Austin, TX",
    rating: "4.4",
    teaches: ["Unity", "C#", "Game Dev"],
    learns: ["ML", "React"],
    img: "https://i.pravatar.cc/100?img=25",
  },
  {
    name: "Aisha Johnson",
    college: "Howard University",
    location: "Washington, DC",
    rating: "4.7",
    teaches: ["SEO", "Content Writing", "Marketing"],
    learns: ["JavaScript", "HTML"],
    img: "https://i.pravatar.cc/100?img=30",
  },
];

function Explore() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);

    try {
      const res = await userAPI.getAll();
      setUsers(res.data.users?.length ? res.data.users : dummyUsers);
    } catch (err) {
      console.error(err);
      setUsers(dummyUsers);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await userAPI.getAll({ search });
      setUsers(res.data.users?.length ? res.data.users : dummyUsers);
    } catch (err) {
      console.error(err);
      setUsers(dummyUsers);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="explore-page">
      <div className="explore-hero">
        <h1>
          Explore <span>Skills</span>
        </h1>
        <p>Discover students and skills available for exchange</p>
      </div>

      <div className="explore-controls">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search by name or college..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="card-grid">
          {users.map((user, index) => (
            <div className="card" key={user._id || index}>
              <div className="card-header">
                <img
                  src={
                    user.profileImage ||
                    user.img ||
                    `https://i.pravatar.cc/100?img=${index + 1}`
                  }
                  alt="user"
                />

                <div>
                  <h3>{user.name}</h3>
                  <p>
                    {user.college} • {user.location} • ⭐ {user.rating}
                  </p>
                </div>
              </div>

              <div className="section">
                <h4>TEACHES</h4>
                <div className="tags blue">
                  {(user.skills || user.teaches || []).map((skill, i) => (
                    <span key={i}>{skill.name || skill}</span>
                  ))}
                </div>
              </div>

              <div className="section">
                <h4>WANTS TO LEARN</h4>
                <div className="tags light">
                  {(user.learningGoals || user.learns || []).map(
                    (goal, i) => (
                      <span key={i}>{goal.name || goal}</span>
                    )
                  )}
                </div>
              </div>

              <div className="btns">
                <button className="view">View Profile</button>
                <button className="connect">Connect</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="footer">
        <div className="footer-grid">
          <div>
            <h2>SkillBridge</h2>
            <p>
              Empowering students to learn from each other through skill
              exchange.
            </p>
          </div>

          <div>
            <h4>Platform</h4>
            <p>Explore Skills</p>
            <p>Join Now</p>
            <p>How It Works</p>
          </div>

          <div>
            <h4>Company</h4>
            <p>About Us</p>
            <p>Blog</p>
            <p>Careers</p>
          </div>

          <div>
            <h4>Connect</h4>
            <p>GitHub</p>
            <p>LinkedIn</p>
            <p>Email</p>
          </div>
        </div>

        <div className="copyright">
          © 2026 SkillBridge. All rights reserved.
        </div>
      </div>
    </div>
  );
}

export default Explore; 