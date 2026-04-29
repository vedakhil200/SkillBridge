import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Dummy data for demonstration
  const dummyData = useMemo(() => ({
    skills: ["JavaScript", "React", "Node.js", "Python", "UI/UX Design"],
    learningGoals: ["Machine Learning", "Cloud Computing", "Data Structures"],
    totalConnections: 12,
    skillExchanges: 5,
    badges: [
      { name: "First Connection", icon: "🤝" },
      { name: "Skill Sharer", icon: "📚" },
      { name: "Active Learner", icon: "🎯" }
    ],
    recentActivity: [
      { type: "connection", message: "Connected with Sarah Chen", time: "2 hours ago" },
      { type: "exchange", message: "Completed skill exchange: JavaScript → Python", time: "1 day ago" },
      { type: "badge", message: "Earned 'Skill Sharer' badge", time: "3 days ago" }
    ],
    suggestedSkills: ["TypeScript", "Docker", "AWS", "GraphQL", "Vue.js"],
    upcomingExchanges: [
      { partner: "Mike Johnson", skill: "React", date: "Tomorrow, 3:00 PM" },
      { partner: "Emma Davis", skill: "Python", date: "Friday, 2:00 PM" }
    ]
  }), []);

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

  if (!user) {
    return <div className="dashboard-loading">Loading...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {user.name}! 👋</h1>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Your Skills</h3>
          <p className="stat-number">{user.skills?.length || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Learning Goals</h3>
          <p className="stat-number">{user.learningGoals?.length || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Connections</h3>
          <p className="stat-number">{user.totalConnections || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Skill Exchanges</h3>
          <p className="stat-number">{user.skillExchanges || 0}</p>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="content-section">
          <h2>Your Skills</h2>
          <div className="skills-list">
            {user.skills?.map((skill, index) => (
              <span key={index} className="skill-tag">{skill}</span>
            ))}
          </div>
        </div>

        <div className="content-section">
          <h2>Learning Goals</h2>
          <div className="goals-list">
            {user.learningGoals?.map((goal, index) => (
              <span key={index} className="goal-tag">{goal}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="content-section">
          <h2>🎖️ Your Badges</h2>
          <div className="badges-list">
            {user.badges?.map((badge, index) => (
              <div key={index} className="badge-item">
                <span className="badge-icon">{badge.icon}</span>
                <span className="badge-name">{badge.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="content-section">
          <h2>📅 Upcoming Exchanges</h2>
          <div className="exchanges-list">
            {user.upcomingExchanges?.map((exchange, index) => (
              <div key={index} className="exchange-item">
                <strong>{exchange.partner}</strong>
                <p>Teaching: {exchange.skill}</p>
                <span className="exchange-date">{exchange.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="content-section recent-activity">
        <h2>📝 Recent Activity</h2>
        <div className="activity-list">
          {user.recentActivity?.map((activity, index) => (
            <div key={index} className="activity-item">
              <p>{activity.message}</p>
              <span className="activity-time">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="content-section">
        <h2>💡 Suggested Skills to Learn</h2>
        <div className="skills-list">
          {user.suggestedSkills?.map((skill, index) => (
            <span key={index} className="suggested-skill-tag">{skill}</span>
          ))}
        </div>
      </div>

      <div className="dashboard-actions">
        <button className="action-btn" onClick={() => navigate("/explore")}>
          Explore Skills →
        </button>

        <button className="action-btn" onClick={() => navigate("/resources")}>
          View Resources →
        </button>
      </div>
    </div>
  );
}

export default Dashboard;