import { useEffect, useState } from "react";
import api from "../api/client";

export default function Profile({ role }) {
  const [user, setUser] = useState(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get(`/${role}/profile`);
        setUser(res.data);
      } catch (err) {
        setMsg(err.response?.data?.msg || "Error fetching profile");
      }
    };
    fetchProfile();
  }, [role]);

  if (msg)
    return <p style={styles.message}>{msg}</p>;

  if (!user)
    return <p style={styles.loading}>Loading profile...</p>;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>{role.charAt(0).toUpperCase() + role.slice(1)} Profile</h2>
        <p style={styles.info}><strong>Username:</strong> {user.username}</p>
        <p style={styles.info}><strong>Email:</strong> {user.email}</p>
        <p style={styles.info}><strong>Role:</strong> {user.role}</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "80vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #89f7fe, #66a6ff)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: "20px",
  },
  card: {
    background: "#fff",
    padding: "30px",
    borderRadius: "16px",
    boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
    width: "400px",
    textAlign: "center",
  },
  heading: {
    fontSize: "28px",
    fontWeight: "700",
    marginBottom: "24px",
    color: "#333",
  },
  info: {
    fontSize: "18px",
    margin: "10px 0",
    color: "#555",
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
};
