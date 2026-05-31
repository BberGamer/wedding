import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./AuthPage.module.css";
import { API_URL } from "../config";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "customer",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          role: formData.role,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Đăng ký thất bại");
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
          <img className={styles.heroBg} alt="" src="/beatriz-perez-moya-M2T1j-6Fn8w-unsplash@2x.png" />
          <div className={styles.leftOverlay}>
            <div className={styles.brandArea}>
              <img className={styles.logoImg} alt="AN Wedding" src="/LOGO.svg" />
              <h2 className={styles.brandName}>
                AN<br />WEDDING
              </h2>
            </div>
            <div className={styles.leftQuote}>
              <p className={styles.quoteText}>
                "Hành trình bắt đầu<br />từ một lựa chọn đúng đắn"
              </p>
              <div className={styles.quoteDivider} />
              <p className={styles.quoteSubtext}>
                Tạo tài khoản để khám phá thế giới cưới hỏi
              </p>
            </div>
          </div>
        </div>

        {/* Right panel - Form */}
        <div className={styles.rightPanel}>
          <div className={styles.formWrapper}>
            <div className={styles.formHeader}>
              <p className={styles.formEyebrow}>JOIN US TODAY</p>
              <h1 className={styles.formTitle}>Đăng Ký</h1>
              <div className={styles.titleUnderline} />
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Họ và tên</label>
                <div className={styles.inputWrapper}>
                  <input
                    id="register-name"
                    className={styles.input}
                    type="text"
                    name="name"
                    placeholder="Nguyễn Văn A"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  <div className={styles.inputLine} />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Email</label>
                <div className={styles.inputWrapper}>
                  <input
                    id="register-email"
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
                <label className={styles.inputLabel}>Số điện thoại</label>
                <div className={styles.inputWrapper}>
                  <input
                    id="register-phone"
                    className={styles.input}
                    type="tel"
                    name="phone"
                    placeholder="0912345678"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                  <div className={styles.inputLine} />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Vai trò</label>
                <div className={styles.inputWrapper}>
                  <select
                    id="register-role"
                    className={`${styles.input} ${styles.selectInput}`}
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="customer">Khách hàng</option>
                    <option value="vendor">Nhà cung cấp (Vendor)</option>
                  </select>
                  <div className={styles.inputLine} />
                </div>
              </div>

              <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>Mật khẩu</label>
                  <div className={styles.inputWrapper}>
                    <input
                      id="register-password"
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
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>Xác nhận mật khẩu</label>
                  <div className={styles.inputWrapper}>
                    <input
                      id="register-confirm-password"
                      className={styles.input}
                      type="password"
                      name="confirmPassword"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                    <div className={styles.inputLine} />
                  </div>
                </div>
              </div>

              {error && <div className={styles.errorMsg}>{error}</div>}

              <button
                id="register-submit"
                className={styles.submitBtn}
                type="submit"
                disabled={loading}
              >
                <div className={styles.btnBg} />
                <span className={styles.btnText}>
                  {loading ? "ĐANG XỬ LÝ..." : "ĐĂNG KÝ"}
                </span>
              </button>
            </form>

            <div className={styles.formFooter}>
              <p className={styles.switchText}>
                Đã có tài khoản?{" "}
                <Link className={styles.switchLink} to="/login">
                  Đăng nhập
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

export default RegisterPage;
