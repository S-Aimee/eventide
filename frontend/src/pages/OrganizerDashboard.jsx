import { useState, useEffect } from "react";
import api from "../api/client";

export default function OrganizerDashboard() {
  const [profile, setProfile] = useState(null);
  const [invites, setInvites] = useState([]);
  const [editingInvite, setEditingInvite] = useState(null);
  const [refresh, setRefresh] = useState(false);

  // --- Fetch Organizer Profile ---
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/organizer/profile");
        setProfile(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  // --- Fetch Invites ---
  useEffect(() => {
    const fetchInvites = async () => {
      try {
        const res = await api.get("/organizer/invites");
        setInvites(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchInvites();
  }, [refresh]);

  // --- Handle Invite Form ---
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    guestUsername: "",
  });

  useEffect(() => {
    if (editingInvite) {
      setForm({
        title: editingInvite.title,
        description: editingInvite.description,
        date: editingInvite.date.split("T")[0],
        guestUsername: editingInvite.guest_username,
      });
    }
  }, [editingInvite]);

  const handleFormChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingInvite) {
        await api.put(`/organizer/invites/${editingInvite.id}`, form);
        setEditingInvite(null);
      } else {
        await api.post("/organizer/invites", form);
      }
      setForm({ title: "", description: "", date: "", guestUsername: "" });
      setRefresh(!refresh);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || "Error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this invite?")) return;
    try {
      await api.delete(`/organizer/invites/${id}`);
      setInvites(invites.filter((inv) => inv.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const resetStatus = async (id) => {
    try {
      await api.put(`/organizer/invites/${id}/reset`);
      setRefresh(!refresh);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || "Failed to reset status");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Organizer Dashboard</h2>

      {/* Profile */}
      <section style={styles.card}>
        <h3 style={styles.subHeading}>Profile</h3>
        {profile ? (
          <div>
            <p style={styles.info}>
              <strong>Username:</strong> {profile.username}
            </p>
            <p style={styles.info}>
              <strong>Email:</strong> {profile.email}
            </p>
            <p style={styles.info}>
              <strong>Role:</strong> {profile.role}
            </p>
          </div>
        ) : (
          <p style={styles.info}>Loading profile...</p>
        )}
      </section>

      {/* Invite Form */}
      <section style={styles.card}>
        <h3 style={styles.subHeading}>
          {editingInvite ? "Edit" : "Create"} Invite
        </h3>
        <form onSubmit={handleFormSubmit} style={styles.form}>
          <input
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleFormChange}
            required
            style={styles.input}
          />
          <input
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleFormChange}
            required
            style={styles.input}
          />
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleFormChange}
            required
            style={styles.input}
          />
          <input
            name="guestUsername"
            placeholder="Guest Username"
            value={form.guestUsername}
            onChange={handleFormChange}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            {editingInvite ? "Update" : "Create"} Invite
          </button>
        </form>
      </section>

      {/* Invite List */}
      <section style={styles.card}>
        <h3 style={styles.subHeading}>Your Invites</h3>
        {invites.length === 0 ? (
          <p style={styles.info}>No invites yet.</p>
        ) : (
          invites.map((invite) => (
            <div key={invite.id} style={styles.inviteCard}>
              <h4 style={styles.inviteTitle}>{invite.title}</h4>
              <p>{invite.description}</p>
              <p>
                <strong>Date:</strong> {invite.date.split("T")[0]}
              </p>
              <p>
                <strong>Guest:</strong> {invite.guest_username}
              </p>
              <p>
                <strong>Status: </strong>
                <span
                  style={{
                    color:
                      invite.status === "accepted"
                        ? "green"
                        : invite.status === "declined"
                        ? "red"
                        : "#eab308",
                    fontWeight: "600",
                  }}
                >
                  {invite.status.charAt(0).toUpperCase() +
                    invite.status.slice(1)}
                </span>
              </p>

              <div style={styles.btnGroup}>
                <button
                  onClick={() => setEditingInvite(invite)}
                  style={styles.editBtn}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(invite.id)}
                  style={styles.deleteBtn}
                >
                  Delete
                </button>
                {invite.status !== "pending" && (
                  <button
                    onClick={() => resetStatus(invite.id)}
                    style={styles.resetBtn}
                  >
                    Reset Status
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "80vh",
    padding: "25px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    background: "linear-gradient(135deg, #a1c4fd, #c2e9fb)",
  },
  heading: {
    fontSize: "32px",
    fontWeight: "700",
    textAlign: "center",
    marginBottom: "30px",
    color: "#222",
  },
  subHeading: {
    fontSize: "22px",
    fontWeight: "600",
    marginBottom: "15px",
    color: "#333",
  },
  card: {
    background: "#fff",
    padding: "25px",
    borderRadius: "16px",
    boxShadow: "0 15px 35px rgba(0,0,0,0.15)",
    marginBottom: "30px",
  },
  form: { display: "flex", flexDirection: "column" },
  input: {
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  button: {
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    backgroundColor: "#4facfe",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "0.3s",
  },
  inviteCard: {
    background: "#f9f9f9",
    padding: "15px",
    borderRadius: "12px",
    marginBottom: "15px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
  },
  inviteTitle: { fontSize: "20px", fontWeight: "600", marginBottom: "8px" },
  btnGroup: { display: "flex", gap: "10px", marginTop: "10px" },
  editBtn: {
    flex: 1,
    padding: "8px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#facc15",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "600",
  },
  deleteBtn: {
    flex: 1,
    padding: "8px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#ef4444",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "600",
  },
  resetBtn: {
    flex: 1,
    padding: "8px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#60a5fa",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "600",
  },
  info: { fontSize: "16px", margin: "5px 0", color: "#555" },
};
