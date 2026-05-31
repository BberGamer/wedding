import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./AuthPage.module.css";
import { API_URL } from "../config";

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Đăng nhập thất bại");
      } else {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data));
        navigate("/");
      }
    } catch {
      setError("Không thể kết nối đến server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authPage}>
      {/* Decorative background elements */}
      <div className={styles.bgCircle1} />
      <div className={styles.bgCircle2} />
      <img className={styles.bgLeaf} alt="" src="/Layer-1.svg" />

      <div className={styles.authContainer}>
        {/* Left panel */}
        <div className={styles.leftPanel}>
          <img className={styles.heroBg} alt="" src="/Frame-1321317488@2x.png" />
          <div className={styles.leftOverlay}>
            <div className={styles.brandArea}>
              <img className={styles.logoImg} alt="AN Wedding" src="/LOGO.svg" />
              <h2 className={styles.brandName}>
                AN<br />WEDDING
              </h2>
            </div>
            <div className={styles.leftQuote}>
              <p className={styles.quoteText}>
                "Cùng nhau tạo nên<br />một kỷ niệm trọn vẹn"
              </p>
              <div className={styles.quoteDivider} />
              <p className={styles.quoteSubtext}>
                Nền tảng cưới hỏi hàng đầu Việt Nam
              </p>
            </div>
          </div>
        </div>

        {/* Right panel - Form */}
        <div className={styles.rightPanel}>
          <div className={styles.formWrapper}>
            <div className={styles.formHeader}>
              <p className={styles.formEyebrow}>WELCOME BACK</p>
              <h1 className={styles.formTitle}>Đăng Nhập</h1>
              <div className={styles.titleUnderline} />
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Email</label>
                <div className={styles.inputWrapper}>
                  <input
                    id="login-email"
                    className={styles.input}
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <div className={styles.inputLine} />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Mật khẩu</label>
                <div className={styles.inputWrapper}>
                  <input
                    id="login-password"
                    className={styles.input}
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <div className={styles.inputLine} />
                </div>
              </div>

              {error && <div className={styles.errorMsg}>{error}</div>}

              <button
                id="login-submit"
                className={styles.submitBtn}
                type="submit"
                disabled={loading}
              >
                <div className={styles.btnBg} />
                <span className={styles.btnText}>
                  {loading ? "ĐANG XỬ LÝ..." : "ĐĂNG NHẬP"}
                </span>
              </button>
            </form>

            <div className={styles.formFooter}>
              <p className={styles.switchText}>
                Chưa có tài khoản?{" "}
                <Link className={styles.switchLink} to="/register">
                  Đăng ký ngay
                </Link>
              </p>
              <Link className={styles.backLink} to="/">
                ← Quay lại trang chủ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
