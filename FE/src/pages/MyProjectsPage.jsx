import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./MyProjectsPage.module.css";
import { API_URL } from "../config";

const categoryIcons = {
  nha_hang: "🍽️",
  trang_diem: "💄",
  xe_hoa: "🚗",
  chup_anh: "📸",
  vay_cuoi: "👗",
};

const categoryLabels = {
  nha_hang: "Nhà hàng",
  trang_diem: "Trang điểm",
  xe_hoa: "Xe hoa",
  chup_anh: "Chụp ảnh",
  vay_cuoi: "Váy cưới",
};

const statusConfig = {
  active: { label: "Đang thực hiện", color: "#4C5637", bg: "rgba(76,86,55,0.10)", dot: "#4C5637" },
  completed: { label: "Hoàn thành", color: "#2e7d32", bg: "rgba(46,125,50,0.10)", dot: "#2e7d32" },
  paused: { label: "Tạm dừng", color: "#c3937c", bg: "rgba(195,147,124,0.12)", dot: "#c3937c" },
  cancelled: { label: "Đã huỷ", color: "#b0bec5", bg: "rgba(176,190,197,0.12)", dot: "#b0bec5" },
};

const calculateProgress = (milestones = []) => {
  if (!milestones.length) return 0;
  const done = milestones.filter((m) => m.status === "completed").length;
  return Math.round((done / milestones.length) * 100);
};

const formatDate = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
};

const formatCurrency = (n) =>
  n ? new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n) : "—";

export default function MyProjectsPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchProjects = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { state: { from: "/my-projects" } });
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/projects/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Lỗi tải dữ liệu");
      setProjects(data.projects || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const filtered = projects.filter((p) => {
    const matchFilter = filter === "all" || p.status === filter;
    const matchSearch =
      !searchTerm ||
      p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.service?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchFilter && matchSearch;
  });

  const stats = {
    total: projects.length,
    active: projects.filter((p) => p.status === "active").length,
    completed: projects.filter((p) => p.status === "completed").length,
  };

  return (
    <div className={styles.page}>
      {/* Decorative bg */}
      <div className={styles.bgOrb1} />
      <div className={styles.bgOrb2} />

      {/* ── Top Nav ──────────────────────── */}
      <nav className={styles.topNav}>
        <Link to="/" className={styles.navLogo}>
          <span className={styles.navLogoIcon}>💍</span>
          <span>AN Wedding</span>
        </Link>
        <div className={styles.navLinks}>
          <Link to="/profile" className={styles.navLink}>Hồ sơ</Link>
          <Link to="/" className={styles.navLink}>Trang chủ</Link>
        </div>
      </nav>

      {/* ── Hero Header ─────────────────── */}
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.heroEyebrow}>✦ AN Wedding Platform</p>
          <h1 className={styles.heroTitle}>Dự Án Của Tôi</h1>
          <p className={styles.heroSub}>
            Theo dõi tiến độ và các mốc quan trọng cho từng dịch vụ cưới của bạn
          </p>
        </div>
      </header>

      <main className={styles.main}>
        {/* ── Stats Bar ─────────────────── */}
        {!loading && !error && (
          <div className={styles.statsRow}>
            <div className={styles.statCard}>
              <span className={styles.statNum}>{stats.total}</span>
              <span className={styles.statLabel}>Tổng dự án</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statNum} style={{ color: "#4C5637" }}>{stats.active}</span>
              <span className={styles.statLabel}>Đang thực hiện</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statNum} style={{ color: "#2e7d32" }}>{stats.completed}</span>
              <span className={styles.statLabel}>Hoàn thành</span>
            </div>
          </div>
        )}

        {/* ── Filters & Search ──────────── */}
        <div className={styles.controls}>
          <div className={styles.searchWrap}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Tìm dự án theo tên dịch vụ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <div className={styles.filterTabs}>
            {[
              { key: "all", label: "Tất cả" },
              { key: "active", label: "Đang thực hiện" },
              { key: "completed", label: "Hoàn thành" },
              { key: "paused", label: "Tạm dừng" },
            ].map((f) => (
              <button
                key={f.key}
                className={`${styles.filterTab} ${filter === f.key ? styles.filterTabActive : ""}`}
                onClick={() => setFilter(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Content Area ──────────────── */}
        {loading && (
          <div className={styles.stateCenter}>
            <div className={styles.spinner} />
            <p className={styles.stateText}>Đang tải dự án của bạn...</p>
          </div>
        )}

        {error && (
          <div className={styles.stateCenter}>
            <div className={styles.stateIcon}>⚠️</div>
            <p className={styles.stateText}>{error}</p>
            <button className={styles.retryBtn} onClick={fetchProjects}>Thử lại</button>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className={styles.stateCenter}>
            <div className={styles.emptyIllustration}>
              <span>📋</span>
            </div>
            {projects.length === 0 ? (
              <>
                <h3 className={styles.emptyTitle}>Chưa có dự án nào</h3>
                <p className={styles.emptyDesc}>
                  Sau khi đặt dịch vụ và được xác nhận, dự án của bạn sẽ xuất hiện tại đây.
                </p>
                <Link to="/" className={styles.browseBtn}>Khám phá dịch vụ →</Link>
              </>
            ) : (
              <>
                <h3 className={styles.emptyTitle}>Không tìm thấy kết quả</h3>
                <p className={styles.emptyDesc}>Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.</p>
              </>
            )}
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className={styles.projectGrid}>
            {filtered.map((project) => {
              const progress = calculateProgress(project.milestones);
              const statusCfg = statusConfig[project.status] || statusConfig.active;
              const categoryIcon = categoryIcons[project.service?.category] || "💍";
              const categoryLabel = categoryLabels[project.service?.category] || project.service?.category;
              const milestonesDone = project.milestones?.filter((m) => m.status === "completed").length || 0;

              return (
                <div
                  key={project._id}
                  className={styles.projectCard}
                  onClick={() => navigate(`/my-projects/${project._id}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && navigate(`/my-projects/${project._id}`)}
                >
                  {/* Cover image / gradient */}
                  <div className={styles.cardCover}>
                    {project.service?.image ? (
                      <img src={project.service.image} alt={project.service?.name} className={styles.cardImg} />
                    ) : (
                      <div className={styles.cardCoverGrad}>
                        <span className={styles.cardCoverIcon}>{categoryIcon}</span>
                      </div>
                    )}
                    <div className={styles.cardCoverOverlay} />
                    <span className={styles.cardCategoryBadge}>{categoryIcon} {categoryLabel}</span>
                    <span
                      className={styles.cardStatusBadge}
                      style={{ background: statusCfg.bg, color: statusCfg.color }}
                    >
                      <span className={styles.statusDot} style={{ background: statusCfg.dot }} />
                      {statusCfg.label}
                    </span>
                  </div>

                  {/* Card body */}
                  <div className={styles.cardBody}>
                    <h3 className={styles.cardTitle}>{project.title}</h3>
                    <p className={styles.cardService}>{project.service?.name}</p>

                    {/* Progress */}
                    <div className={styles.progressSection}>
                      <div className={styles.progressHeader}>
                        <span className={styles.progressLabel}>Tiến độ tổng quan</span>
                        <span className={styles.progressPct}>{progress}%</span>
                      </div>
                      <div className={styles.progressBar}>
                        <div
                          className={styles.progressFill}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className={styles.milestoneSummary}>
                        <span>✓ {milestonesDone}/{project.milestones?.length || 0} mốc hoàn thành</span>
                      </div>
                    </div>

                    {/* Meta info */}
                    <div className={styles.cardMeta}>
                      <div className={styles.metaItem}>
                        <span className={styles.metaIcon}>📅</span>
                        <span>{formatDate(project.startDate)}</span>
                      </div>
                      <div className={styles.metaItem}>
                        <span className={styles.metaIcon}>💰</span>
                        <span>{formatCurrency(project.totalBudget)}</span>
                      </div>
                    </div>

                    <button className={styles.viewBtn}>
                      Xem chi tiết <span className={styles.viewBtnArrow}>→</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
