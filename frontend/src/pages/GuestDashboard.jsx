import { useState, useEffect } from "react";
import api from "../api/client";

export default function GuestDashboard() {
  const [user, setUser] = useState(null);
  const [invites, setInvites] = useState([]);
  const [msg, setMsg] = useState("");

  // Fetch guest profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/guest/profile");
        setUser(res.data);
      } catch (err) {
        setMsg(err.response?.data?.msg || "Error fetching profile");
      }
    };
    fetchProfile();
  }, []);

  // Fetch guest invites
  const fetchInvites = async () => {
    try {
      const res = await api.get("/guest/invites");
      setInvites(res.data);
    } catch (err) {
      setMsg(err.response?.data?.msg || "Error fetching invites");
    }
  };

  useEffect(() => {
    fetchInvites();
  }, []);

  // Accept Invite
  const handleAccept = async (inviteId) => {
    try {
      await api.post(`/guest/invites/${inviteId}/accept`);
      setMsg("Invite accepted successfully!");
      fetchInvites(); // refresh invites after update
    } catch (err) {
      setMsg(err.response?.data?.msg || "Error accepting invite");
    }
  };

  // Decline Invite
  const handleDecline = async (inviteId) => {
    try {
      await api.post(`/guest/invites/${inviteId}/decline`);
      setMsg("Invite declined successfully!");
      fetchInvites();
    } catch (err) {
      setMsg(err.response?.data?.msg || "Error declining invite");
    }
  };

  if (msg && !user)
    return <p style={styles.message}>{msg}</p>;
  if (!user)
    return <p style={styles.loading}>Loading profile...</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Guest Dashboard</h2>

      {/* Profile Section */}
      <section style={styles.card}>
        <h3 style={styles.subHeading}>Your Profile</h3>
        <p style={styles.info}><strong>Username:</strong> {user.username}</p>
        <p style={styles.info}><strong>Email:</strong> {user.email}</p>
        <p style={styles.info}><strong>Role:</strong> {user.role}</p>
      </section>

      {/* Invites Section */}
      <section style={styles.card}>
        <h3 style={styles.subHeading}>Your Invites</h3>
        {invites.length === 0 ? (
          <p style={styles.info}>No invites yet.</p>
        ) : (
          <ul style={styles.list}>
            {invites.map((invite) => (
              <li key={invite.id} style={styles.listItem}>
                <h4 style={styles.inviteTitle}>{invite.title}</h4>
                <p>{invite.description}</p>
                <p><strong>Date:</strong> {new Date(invite.date).toLocaleString()}</p>
                <p><strong>Organizer:</strong> {invite.organizer_username || "Unknown"}</p>
                <p><strong>Status:</strong> {invite.status}</p>

                {/* Action Buttons */}
                {invite.status === "pending" && (
                  <div style={styles.buttonGroup}>
                    <button
                      style={{ ...styles.button, ...styles.acceptBtn }}
                      onClick={() => handleAccept(invite.id)}
                    >
                      Accept
                    </button>
                    <button
                      style={{ ...styles.button, ...styles.declineBtn }}
                      onClick={() => handleDecline(invite.id)}
                    >
                      Decline
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Optional Message Display */}
      {msg && <p style={styles.message}>{msg}</p>}
    </div>
  );
}

const styles = {
  container: {
    minHeight: "80vh",
    padding: "20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    background: "linear-gradient(135deg, #f6d365, #fda085)",
  },
  heading: {
    fontSize: "32px",
    fontWeight: "700",
    textAlign: "center",
    marginBottom: "30px",
    color: "#333",
  },
  subHeading: {
    fontSize: "24px",
    fontWeight: "600",
    marginBottom: "15px",
    color: "#444",
  },
  card: {
    background: "#fff",
    padding: "25px",
    borderRadius: "16px",
    boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
    marginBottom: "30px",
  },
  info: {
    fontSize: "16px",
    margin: "6px 0",
    color: "#555",
  },
  list: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  listItem: {
    background: "#f9f9f9",
    padding: "15px",
    borderRadius: "12px",
    marginBottom: "15px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
  },
  inviteTitle: {
    fontSize: "20px",
    fontWeight: "600",
    marginBottom: "8px",
    color: "#333",
  },
  message: {
    textAlign: "center",
    color: "#ff4d4f",
    fontWeight: "600",
    marginTop: "20px",
  },
  loading: {
    textAlign: "center",
    color: "#333",
    fontWeight: "500",
    marginTop: "20px",
  },
  buttonGroup: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  },
  button: {
    padding: "8px 16px",
    borderRadius: "8px",
    fontSize: "14px",
    cursor: "pointer",
    border: "none",
    transition: "all 0.3s ease",
  },
  acceptBtn: {
    backgroundColor: "#4CAF50",
    color: "white",
  },
  declineBtn: {
    backgroundColor: "#f44336",
    color: "white",
  },
};
