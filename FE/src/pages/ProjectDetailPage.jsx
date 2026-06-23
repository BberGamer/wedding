import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import styles from "./ProjectDetailPage.module.css";
import { API_URL } from "../config";

/* ─── Helpers ────────────────────────────────────────────────────── */
const formatDate = (d, opts) => {
  if (!d) return "—";
  const options = opts || { day: "2-digit", month: "2-digit", year: "numeric" };
  return new Date(d).toLocaleDateString("vi-VN", options);
};

const formatCurrency = (n) =>
  n ? new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n) : "—";

const calculateProgress = (milestones = []) => {
  if (!milestones.length) return 0;
  const done = milestones.filter((m) => m.status === "completed").length;
  return Math.round((done / milestones.length) * 100);
};

const milestoneStatusConfig = {
  pending: {
    label: "Chờ thực hiện",
    color: "#888",
    bg: "rgba(136,136,136,0.08)",
    icon: "⏳",
    borderColor: "rgba(136,136,136,0.2)",
  },
  in_progress: {
    label: "Đang thực hiện",
    color: "#c3937c",
    bg: "rgba(195,147,124,0.10)",
    icon: "🔄",
    borderColor: "rgba(195,147,124,0.35)",
  },
  completed: {
    label: "Hoàn thành",
    color: "#2e7d32",
    bg: "rgba(46,125,50,0.08)",
    icon: "✅",
    borderColor: "rgba(46,125,50,0.3)",
  },
  rejected: {
    label: "Từ chối",
    color: "#c62828",
    bg: "rgba(198,40,40,0.08)",
    icon: "❌",
    borderColor: "rgba(198,40,40,0.2)",
  },
};

const projectStatusConfig = {
  active: { label: "Đang thực hiện", color: "#4C5637", bg: "rgba(76,86,55,0.10)" },
  completed: { label: "Hoàn thành", color: "#2e7d32", bg: "rgba(46,125,50,0.10)" },
  paused: { label: "Tạm dừng", color: "#c3937c", bg: "rgba(195,147,124,0.12)" },
  cancelled: { label: "Đã huỷ", color: "#b0bec5", bg: "rgba(176,190,197,0.12)" },
};

const categoryLabels = {
  nha_hang: "Nhà hàng",
  trang_diem: "Trang điểm cô dâu",
  xe_hoa: "Xe hoa cưới",
  chup_anh: "Chụp ảnh cưới",
  vay_cuoi: "Váy cưới thiết kế",
};

const categoryIcons = {
  nha_hang: "🍽️",
  trang_diem: "💄",
  xe_hoa: "🚗",
  chup_anh: "📸",
  vay_cuoi: "👗",
};

/* ─── Main Component ─────────────────────────────────────────────── */
export default function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("timeline");
  const [expandedMilestone, setExpandedMilestone] = useState(null);

  const token = localStorage.getItem("token");

  const fetchProject = useCallback(async () => {
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Không thể tải dự án");
      setProject(data.project);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id, token, navigate]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  if (loading) {
    return (
      <div className={styles.loadingPage}>
        <div className={styles.spinner} />
        <p>Đang tải dự án...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className={styles.errorPage}>
        <span className={styles.errorIcon}>⚠️</span>
        <h2>Không thể tải dự án</h2>
        <p>{error || "Dự án không tồn tại hoặc bạn không có quyền xem."}</p>
        <button onClick={() => navigate("/my-projects")} className={styles.backBtn}>
          ← Quay lại danh sách
        </button>
      </div>
    );
  }

  const progress = calculateProgress(project.milestones);
  const projectStatus = projectStatusConfig[project.status] || projectStatusConfig.active;
  const categoryIcon = categoryIcons[project.service?.category] || "💍";
  const categoryLabel = categoryLabels[project.service?.category] || project.service?.category;
  const sortedMilestones = [...(project.milestones || [])].sort((a, b) => a.order - b.order);
  const completedCount = project.milestones?.filter((m) => m.status === "completed").length || 0;
  const inProgressCount = project.milestones?.filter((m) => m.status === "in_progress").length || 0;

  return (
    <div className={styles.page}>
      <div className={styles.bgOrb1} />
      <div className={styles.bgOrb2} />

      {/* ── Top Nav ──────────────────── */}
      <nav className={styles.topNav}>
        <button onClick={() => navigate("/my-projects")} className={styles.backNavBtn}>
          ← Dự án của tôi
        </button>
        <Link to="/" className={styles.navLogo}>
          <span>💍</span> AN Wedding
        </Link>
        <Link to="/profile" className={styles.navRight}>Hồ sơ</Link>
      </nav>

      {/* ── Hero Banner ──────────────── */}
      <div className={styles.heroBanner}>
        {project.service?.image && (
          <img src={project.service.image} alt="" className={styles.heroBg} />
        )}
        <div className={styles.heroBgOverlay} />
        <div className={styles.heroContent}>
          <span className={styles.heroCategoryBadge}>
            {categoryIcon} {categoryLabel}
          </span>
          <h1 className={styles.heroTitle}>{project.title}</h1>
          <p className={styles.heroService}>{project.service?.name}</p>
          <span
            className={styles.heroStatusBadge}
            style={{ background: projectStatus.bg, color: projectStatus.color }}
          >
            {projectStatus.label}
          </span>
        </div>
      </div>

      <div className={styles.contentWrapper}>
        {/* ── Overall Progress Card ──── */}
        <div className={styles.progressCard}>
          <div className={styles.progressCardLeft}>
            <div className={styles.progressCircleWrap}>
              <svg viewBox="0 0 80 80" className={styles.progressCircle}>
                <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(195,147,124,0.15)" strokeWidth="8" />
                <circle
                  cx="40" cy="40" r="34"
                  fill="none"
                  stroke="url(#progGrad)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 34}`}
                  strokeDashoffset={`${2 * Math.PI * 34 * (1 - progress / 100)}`}
                  style={{ transition: "stroke-dashoffset 0.8s ease", transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
                />
                <defs>
                  <linearGradient id="progGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#c3937c" />
                    <stop offset="100%" stopColor="#d6a663" />
                  </linearGradient>
                </defs>
              </svg>
              <div className={styles.progressCircleLabel}>
                <span className={styles.progressPct}>{progress}%</span>
                <span className={styles.progressSubText}>Tiến độ</span>
              </div>
            </div>
          </div>
          <div className={styles.progressCardRight}>
            <h2 className={styles.progressCardTitle}>Tổng quan dự án</h2>
            <div className={styles.progressStats}>
              <div className={styles.progStat}>
                <span className={styles.progStatNum} style={{ color: "#2e7d32" }}>{completedCount}</span>
                <span className={styles.progStatLabel}>Mốc hoàn thành</span>
              </div>
              <div className={styles.progStatDivider} />
              <div className={styles.progStat}>
                <span className={styles.progStatNum} style={{ color: "#c3937c" }}>{inProgressCount}</span>
                <span className={styles.progStatLabel}>Đang thực hiện</span>
              </div>
              <div className={styles.progStatDivider} />
              <div className={styles.progStat}>
                <span className={styles.progStatNum} style={{ color: "#3a3226" }}>
                  {project.milestones?.length || 0}
                </span>
                <span className={styles.progStatLabel}>Tổng mốc</span>
              </div>
            </div>
            <div className={styles.progressBarFull}>
              <div className={styles.progressBarFillFull} style={{ width: `${progress}%` }} />
            </div>
            <div className={styles.progressMeta}>
              <span>📅 Bắt đầu: {formatDate(project.startDate)}</span>
              <span>🏁 Kết thúc: {formatDate(project.endDate)}</span>
              <span>💰 Ngân sách: {formatCurrency(project.totalBudget)}</span>
            </div>
          </div>
        </div>

        {/* ── Tab Navigation ───────────── */}
        <div className={styles.tabs}>
          {[
            { key: "timeline", label: "📋 Tiến trình", },
            { key: "info", label: "ℹ️ Thông tin dự án" },
            { key: "service", label: "🔍 Chi tiết dịch vụ" },
          ].map((tab) => (
            <button
              key={tab.key}
              className={`${styles.tab} ${activeTab === tab.key ? styles.tabActive : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Tab: Timeline ─────────────── */}
        {activeTab === "timeline" && (
          <div className={styles.timelineContainer}>
            {sortedMilestones.length === 0 ? (
              <div className={styles.emptyTimeline}>
                <span>📋</span>
                <p>Chưa có mốc tiến độ nào được tạo</p>
              </div>
            ) : (
              <div className={styles.timeline}>
                {sortedMilestones.map((milestone, idx) => {
                  const cfg = milestoneStatusConfig[milestone.status] || milestoneStatusConfig.pending;
                  const isExpanded = expandedMilestone === milestone._id;
                  const isLast = idx === sortedMilestones.length - 1;

                  return (
                    <div key={milestone._id} className={styles.timelineItem}>
                      {/* Connector line */}
                      {!isLast && (
                        <div
                          className={styles.timelineConnector}
                          style={{
                            background: milestone.status === "completed"
                              ? "linear-gradient(to bottom, #d6a663, rgba(195,147,124,0.3))"
                              : "rgba(195,147,124,0.15)"
                          }}
                        />
                      )}

                      {/* Node icon */}
                      <div
                        className={styles.timelineNode}
                        style={{ background: cfg.bg, border: `2px solid ${cfg.borderColor}` }}
                      >
                        <span className={styles.timelineNodeIcon}>{cfg.icon}</span>
                        <span className={styles.timelineNodeNum}>{idx + 1}</span>
                      </div>

                      {/* Card */}
                      <div
                        className={`${styles.milestoneCard} ${isExpanded ? styles.milestoneCardExpanded : ""}`}
                        style={{ borderColor: cfg.borderColor }}
                        onClick={() => setExpandedMilestone(isExpanded ? null : milestone._id)}
                      >
                        <div className={styles.milestoneCardHeader}>
                          <div className={styles.milestoneCardLeft}>
                            <h3 className={styles.milestoneTitle}>{milestone.title}</h3>
                            {milestone.dueDate && (
                              <span className={styles.milestoneDue}>
                                📅 Hạn: {formatDate(milestone.dueDate)}
                              </span>
                            )}
                          </div>
                          <div className={styles.milestoneCardRight}>
                            <span
                              className={styles.milestoneStatus}
                              style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.borderColor}` }}
                            >
                              {cfg.icon} {cfg.label}
                            </span>
                            <span className={styles.expandChevron}>{isExpanded ? "▲" : "▼"}</span>
                          </div>
                        </div>

                        {/* Expanded content */}
                        {isExpanded && (
                          <div className={styles.milestoneDetail}>
                            {milestone.description && (
                              <div className={styles.milestoneDetailSection}>
                                <h4 className={styles.milestoneDetailLabel}>Mô tả</h4>
                                <p className={styles.milestoneDetailText}>{milestone.description}</p>
                              </div>
                            )}
                            {milestone.notes && (
                              <div className={styles.milestoneDetailSection}>
                                <h4 className={styles.milestoneDetailLabel}>Ghi chú từ nhà cung cấp</h4>
                                <div className={styles.milestoneNoteBox}>
                                  <span className={styles.milestoneNoteIcon}>📝</span>
                                  <p className={styles.milestoneNoteText}>{milestone.notes}</p>
                                </div>
                              </div>
                            )}
                            {milestone.completedAt && (
                              <div className={styles.milestoneDetailSection}>
                                <h4 className={styles.milestoneDetailLabel}>Ngày hoàn thành</h4>
                                <p className={styles.milestoneDetailText} style={{ color: "#2e7d32" }}>
                                  ✅ {formatDate(milestone.completedAt, {
                                    day: "2-digit",
                                    month: "long",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit"
                                  })}
                                </p>
                              </div>
                            )}
                            {milestone.attachments?.length > 0 && (
                              <div className={styles.milestoneDetailSection}>
                                <h4 className={styles.milestoneDetailLabel}>Tài liệu đính kèm</h4>
                                <div className={styles.attachmentList}>
                                  {milestone.attachments.map((att, i) => (
                                    <a
                                      key={i}
                                      href={att.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className={styles.attachmentItem}
                                    >
                                      <span>📎</span>
                                      <span>{att.filename || `Tài liệu ${i + 1}`}</span>
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}
                            {!milestone.description && !milestone.notes && !milestone.completedAt && (
                              <p className={styles.noDetailText}>Chưa có thông tin chi tiết cho mốc này.</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── Tab: Project Info ───────────── */}
        {activeTab === "info" && (
          <div className={styles.infoGrid}>
            {/* Order Info */}
            <div className={styles.infoCard}>
              <h3 className={styles.infoCardTitle}>📦 Thông tin đơn hàng</h3>
              <div className={styles.infoRows}>
                <div className={styles.infoRow}>
                  <span className={styles.infoKey}>Mã giao dịch</span>
                  <span className={styles.infoVal} style={{ fontFamily: "monospace", fontSize: "0.82rem" }}>
                    {project.order?.txnRef || "—"}
                  </span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoKey}>Trạng thái thanh toán</span>
                  <span className={styles.infoVal}>
                    {project.order?.status === "completed" ? "✅ Đã thanh toán" : "⏳ Chờ xử lý"}
                  </span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoKey}>Tổng giá trị</span>
                  <span className={styles.infoVal} style={{ color: "#c3937c", fontWeight: 700 }}>
                    {formatCurrency(project.order?.amount)}
                  </span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoKey}>Ngày thanh toán</span>
                  <span className={styles.infoVal}>{formatDate(project.order?.paymentDate)}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoKey}>Ngày sự kiện</span>
                  <span className={styles.infoVal}>{formatDate(project.order?.eventDate)}</span>
                </div>
                {project.order?.eventLocation && (
                  <div className={styles.infoRow}>
                    <span className={styles.infoKey}>Địa điểm</span>
                    <span className={styles.infoVal}>{project.order.eventLocation}</span>
                  </div>
                )}
                {project.order?.customerName && (
                  <div className={styles.infoRow}>
                    <span className={styles.infoKey}>Khách hàng</span>
                    <span className={styles.infoVal}>{project.order.customerName}</span>
                  </div>
                )}
                {project.order?.customerPhone && (
                  <div className={styles.infoRow}>
                    <span className={styles.infoKey}>Số điện thoại</span>
                    <span className={styles.infoVal}>{project.order.customerPhone}</span>
                  </div>
                )}
                {project.order?.note && (
                  <div className={styles.infoRow}>
                    <span className={styles.infoKey}>Ghi chú</span>
                    <span className={styles.infoVal}>{project.order.note}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Vendor Info */}
            {project.vendor && (
              <div className={styles.infoCard}>
                <h3 className={styles.infoCardTitle}>🏢 Nhà cung cấp</h3>
                <div className={styles.vendorProfile}>
                  {project.vendor.avatar ? (
                    <img src={project.vendor.avatar} alt={project.vendor.name} className={styles.vendorAvatar} />
                  ) : (
                    <div className={styles.vendorAvatarPlaceholder}>
                      {project.vendor.name?.charAt(0) || "V"}
                    </div>
                  )}
                  <div>
                    <p className={styles.vendorName}>{project.vendor.name}</p>
                    <p className={styles.vendorEmail}>{project.vendor.email}</p>
                  </div>
                </div>
                <div className={styles.infoRows} style={{ marginTop: 16 }}>
                  {project.vendor.phone && (
                    <div className={styles.infoRow}>
                      <span className={styles.infoKey}>Điện thoại</span>
                      <span className={styles.infoVal}>
                        <a href={`tel:${project.vendor.phone}`} className={styles.infoLink}>
                          {project.vendor.phone}
                        </a>
                      </span>
                    </div>
                  )}
                  {project.vendor.description && (
                    <div className={styles.infoRow} style={{ flexDirection: "column", gap: 4 }}>
                      <span className={styles.infoKey}>Giới thiệu</span>
                      <span className={styles.infoVal} style={{ lineHeight: 1.5 }}>
                        {project.vendor.description}
                      </span>
                    </div>
                  )}
                  {project.vendor.facebook && (
                    <div className={styles.infoRow}>
                      <span className={styles.infoKey}>Facebook</span>
                      <a href={project.vendor.facebook} target="_blank" rel="noopener noreferrer" className={styles.infoLink}>
                        Xem trang
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Project Notes */}
            {project.notes && (
              <div className={styles.infoCard} style={{ gridColumn: "1 / -1" }}>
                <h3 className={styles.infoCardTitle}>📝 Ghi chú dự án</h3>
                <p className={styles.projectNotesText}>{project.notes}</p>
              </div>
            )}

            {/* Booked Packages */}
            {project.order?.items?.length > 0 && (
              <div className={styles.infoCard} style={{ gridColumn: "1 / -1" }}>
                <h3 className={styles.infoCardTitle}>🎁 Gói dịch vụ đã đặt</h3>
                <div className={styles.packageList}>
                  {project.order.items.map((item, i) => (
                    <div key={i} className={styles.packageItem}>
                      <div className={styles.packageInfo}>
                        <span className={styles.packageName}>{item.name}</span>
                        {item.desc && <span className={styles.packageDesc}>{item.desc}</span>}
                      </div>
                      <span className={styles.packagePrice}>{formatCurrency(item.price)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Tab: Service Detail ─────────── */}
        {activeTab === "service" && project.service && (
          <div className={styles.serviceTab}>
            <div className={styles.serviceHeroCard}>
              {project.service.image && (
                <img src={project.service.image} alt={project.service.name} className={styles.serviceImg} />
              )}
              <div className={styles.serviceHeroBody}>
                <span className={styles.serviceCategoryBadge}>
                  {categoryIcon} {categoryLabel}
                </span>
                <h3 className={styles.serviceName}>{project.service.name}</h3>
                {project.service.priceLabel && (
                  <p className={styles.servicePrice}>{project.service.priceLabel}</p>
                )}
                {project.service.address && (
                  <p className={styles.serviceAddress}>📍 {project.service.address}</p>
                )}
                {project.service.description && (
                  <p className={styles.serviceDesc}>{project.service.description}</p>
                )}
                <div className={styles.serviceActions}>
                  <Link
                    to={`/service/${project.service._id}`}
                    className={styles.serviceViewBtn}
                  >
                    Xem trang dịch vụ →
                  </Link>
                  {project.service.phone && (
                    <a href={`tel:${project.service.phone}`} className={styles.serviceCallBtn}>
                      📞 Liên hệ
                    </a>
                  )}
                  {project.service.website && (
                    <a
                      href={project.service.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.serviceWebBtn}
                    >
                      🌐 Website
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
