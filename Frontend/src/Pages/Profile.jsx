import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
 
          alert("You are not logged in!");
          setLoading(false);
          setTimeout(() => {
            navigate("/login");
          },0);
          return;
        }

        const response = await axios.get("http://localhost:2500/userrouter/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data.user);
        setLoading(false);

        
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to fetch profile data. Please login again.");
        setLoading(false);
        // localStorage.removeItem("token");
        setTimeout(() => {
          navigate("/login");
        }, 5000);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      const email = user?.email; 

      if (!token) {
        alert("You are already logged out!");
        navigate("/login");
        return;
      }

      await axios.post(
        "http://localhost:2500/userrouter/logout",
        { email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      localStorage.removeItem("token");
      alert("You have been logged out successfully.");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      alert(error.response?.data?.message || "Logout failed.");
    }
  };


  if (loading) {
    return <div style={styles.loading}>Loading profile pleese waite...</div>;
  }

  if (error) {
    return <h2 style={styles.error}>{error}</h2>;
  }

  return (
    <div style={styles.container}>
      <h2>pic:{user?.ProfilePicture}</h2>
      <h2>Welcome, {user?.username}!</h2>
      <p>Email: {user?.email}</p>
      <button onClick={handleLogout} style={styles.logoutButton}>
        Logout
      </button>
    </div>
  );
};

const styles = {
  container: {
    width: "400px",
    margin: "50px auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    textAlign: "center",
  },
  loading: {
    textAlign: "center",
    fontSize: "18px",
    marginTop: "50px",
    color:"green",
  },
  error: {
    textAlign: "center",
    color: "red",
    fontSize: "17px",
    marginTop: "20px",
  },
  logoutButton: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#FF5733",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginTop: "20px",
  },
};

export default Profile;
