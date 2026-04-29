import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "../style.css";

function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const dummyData = useMemo(
    () => ({
      skills: ["C++"],
      learningGoals: ["Python"],
      completedSwaps: 0,
      rating: "N/A",

      progress: [
        { skill: "Python", percent: 20 },
      ],

      courses: [
        {
          title: "Python for Beginners – Full Course",
          level: "Beginner",
          provider: "freeCodeCamp",
        },
        {
          title: "Automate the Boring Stuff with Python",
          level: "Beginner",
          provider: "Udemy (Free)",
        },
        {
          title: "Python OOP Tutorial",
          level: "Intermediate",
          provider: "Corey Schafer",
        },
        {
          title: "Real Python – Intermediate Tutorials",
          level: "Intermediate",
          provider: "Real Python",
        },
        {
          title: "Python Advanced Concepts",
          level: "Advanced",
          provider: "Tech With Tim",
        },
        {
          title: "Python Official Documentation",
          level: "Advanced",
          provider: "Python.org",
        },
      ],

      trending: [
        "Python +24%",
        "React +18%",
        "Machine Learning +31%",
        "DSA +22%",
        "UI Design +15%",
        "Cybersecurity +28%",
      ],
    }),
    []
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      navigate("/login");
      return;
    }

    const parsedUser = JSON.parse(userData);

    setUser({
      ...parsedUser,
      ...dummyData,
    });
  }, [navigate, dummyData]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) return <div className="dashboard-loading">Loading...</div>;

  return (
    <div className="ai-dashboard">
      {/* Sidebar */}
      <aside className="ai-sidebar">
        <h2 className="brand">SkillBridge</h2>

        <ul>
          <li className="active">🏠 Dashboard</li>
          <li>👤 My Profile</li>
          <li onClick={() => navigate("/explore")}>🔍 Find Matches</li>
          <li>📩 Requests</li>
          <li>💬 Messages</li>
          <li>⚙️ Settings</li>
          <li className="logout-link" onClick={handleLogout}>
            🚪 Log Out
          </li>
        </ul>
      </aside>

      {/* Main */}
      <main className="ai-main">
        {/* Top */}
        <div className="top-bar">
          <div>
            <h1>
              Welcome back, <span>{user.name}</span>!
            </h1>
            <p>Here's your skill exchange overview</p>
          </div>

          <div className="profile-circle">
            {user.name?.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-box">
            <h3>📚 Skills Teaching</h3>
            <span>{user.skills?.length || 0}</span>
          </div>

          <div className="stat-box">
            <h3>🎯 Skills Learning</h3>
            <span>{user.learningGoals?.length || 0}</span>
          </div>

          <div className="stat-box">
            <h3>✅ Completed Swaps</h3>
            <span>{user.completedSwaps}</span>
          </div>

          <div className="stat-box">
            <h3>⭐ Rating</h3>
            <span>{user.rating}</span>
          </div>
        </div>

        {/* Skills */}
        <div className="two-grid">
          <div className="card">
            <h2>Your Skills</h2>
            <small>TEACHING</small>

            <div className="tag-wrap">
              {user.skills?.map((skill, index) => (
                <span className="green-tag" key={index}>
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="card">
            <h2>Your Skills</h2>
            <small>LEARNING</small>

            <div className="tag-wrap">
              {user.learningGoals?.map((goal, index) => (
                <span className="purple-tag" key={index}>
                  {goal}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="card">
          <h2>Learning Progress</h2>

          {user.progress.map((item, i) => (
            <div key={i} className="progress-block">
              <div className="progress-top">
                <span>{item.skill}</span>
                <span>{item.percent}%</span>
              </div>

              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${item.percent}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Courses */}
        <div className="card">
          <div className="course-head">
            <h2>📘 Recommended Courses</h2>
            <span>View All →</span>
          </div>

          <div className="courses-grid">
            {user.courses.map((course, index) => (
              <div className="course-card" key={index}>
                <button>{course.level}</button>
                <h4>{course.title}</h4>
                <p>{course.provider}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Trending */}
        <div className="card">
          <h2>🔥 Trending Skills</h2>

          <div className="trend-grid">
            {user.trending.map((item, index) => (
              <div className="trend-card" key={index}>
                {item}
              </div>
            ))}
            /* Dashboard.js me Trending Skills ke niche ye add karo */

<div className="card">
  <h2>🎯 Suggested Next Skills</h2>

  <div className="tag-wrap">
    <span className="next-tag">Data Science</span>
    <span className="next-tag">Machine Learning</span>
    <span className="next-tag">Django</span>
  </div>
</div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;