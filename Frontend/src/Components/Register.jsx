import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const Navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUserDetailsSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!username.trim()) {
      setError("Please enter your username.");
      setLoading(false);
      return;
    }

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:2500/auth/register", { username, email });
      setLoading(false);
      setIsOtpSent(true);
      alert(response.data.message || "OTP sent successfully!");
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Failed to send OTP.");
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!otp) {
      setError("Please enter the OTP.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:2500/auth/verify-otp", { email, otp });
      setLoading(false);
      alert(`Sign-in successful! ${response.data.user.username}`);
      // Save the token in localStorage or redirect the user
      localStorage.setItem("token", response.data.token);
      Navigate("/my-acount")
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Failed to verify OTP.");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Sign In</h2>
      {!isOtpSent ? (
        <form onSubmit={handleUserDetailsSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              style={styles.input}
            />
          </div>
          {error && <p style={styles.error}>{error}</p>}
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleOtpSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label>OTP:</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              style={styles.input}
            />
          </div>
          {error && <p style={styles.error}>{error}</p>}
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Verifying OTP..." : "Verify OTP"}
          </button>
        </form>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "400px",
    margin: "50px auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
  input: {
    width:"10cm",
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
  button: {
    padding: "10px",
    fontSize: "16px",
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    fontSize: "14px",
  },
};

export default Register;
