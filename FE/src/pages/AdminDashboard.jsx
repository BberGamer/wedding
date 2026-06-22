import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { io } from "socket.io-client";
import SharedHeader from "../components/SharedHeader";
import Footer1 from "../components/Footer1";
import styles from "./AdminDashboard.module.css";
import { API_URL } from "../config";

let adminSocket = null;

const categoryLabels = {
  nha_hang: "Nhà hàng tiệc cưới",
  trang_diem: "Trang điểm cô dâu",
  xe_hoa: "Xe hoa ngày cưới",
  chup_anh: "Chụp ảnh cưới",
  vay_cuoi: "Váy cưới thiết kế"
};

const categoryIcons = {
  nha_hang: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginRight: 6, verticalAlign: "middle", display: "inline-block" }}>
      <path d="M3 21h18M3 7v14M21 7v14M12 3v18M12 7h9M3 7h9M7 11h2M7 15h2M15 11h2M15 15h2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  trang_diem: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginRight: 6, verticalAlign: "middle", display: "inline-block" }}>
      <path d="M12 2a6 6 0 0 0-6 6v8a6 6 0 0 0 12 0V8a6 6 0 0 0-6-6zM12 18v3M9 21h6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  xe_hoa: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginRight: 6, verticalAlign: "middle", display: "inline-block" }}>
      <rect x="2" y="10" width="20" height="8" rx="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 10V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v5M6 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM18 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  chup_anh: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginRight: 6, verticalAlign: "middle", display: "inline-block" }}>
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="13" r="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  vay_cuoi: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginRight: 6, verticalAlign: "middle", display: "inline-block" }}>
      <path d="M12 2L4 9v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9zM12 2v20M8 9h8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
};

const statusLabels = {
  pending: "Đang chờ thanh toán",
  completed: "Thanh toán thành công",
  failed: "Giao dịch thất bại"
};

const statusColors = {
  pending: "#e2a93b",
  completed: "#4d5637",
  failed: "#b85c5c"
};

const monthNames = [
  "Th1", "Th2", "Th3", "Th4", "Th5", "Th6", 
  "Th7", "Th8", "Th9", "Th10", "Th11", "Th12"
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState(null);
  const [token, setToken] = useState("");
  
  // Dashboard overall stats
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState("");
  const [toast, setToast] = useState(null);

  // Tab views
  const [activeTab, setActiveTab] = useState("analytics"); // analytics, users, services, orders, chat

  // Chat states
  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatConnected, setChatConnected] = useState(false);
  const [chatUnread, setChatUnread] = useState(0);
  const chatEndRef = useRef(null);

  // List data states
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);

  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(false);

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Filter & Search states
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("all");

  const [serviceSearch, setServiceSearch] = useState("");
  const [serviceCategoryFilter, setServiceCategoryFilter] = useState("all");

  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");

  // Actions states
  const [actionLoading, setActionLoading] = useState(false);

  // Order detail modal
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (!storedUser || !storedToken) {
      navigate("/login");
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.role !== "admin") {
      alert("Bạn không có quyền truy cập trang quản trị hệ thống.");
      navigate("/");
      return;
    }

    setAdminUser(parsedUser);
    setToken(storedToken);
    
    // Initial fetch
    fetchStats(storedToken);
  }, [navigate]);

  // Sync tab loading
  useEffect(() => {
    if (!token) return;
    if (activeTab === "analytics") {
      fetchStats(token);
    } else if (activeTab === "users") {
      fetchUsers(token);
    } else if (activeTab === "services") {
      fetchServices(token);
    } else if (activeTab === "orders") {
      fetchOrders(token);
    } else if (activeTab === "chat") {
      fetchConversations(token);
    }
  }, [activeTab, token]);

  // Auto polling to check for new successful transactions in the background
  useEffect(() => {
    if (!token) return;
    const interval = setInterval(() => {
      // Poll stats silently
      fetchStats(token, true);
      // Poll orders silently
      fetchOrders(token, true);
    }, 10000); // 10 seconds
    return () => clearInterval(interval);
  }, [token, orders]);

  // Load chat conversations from REST
  const fetchConversations = useCallback(async (tok) => {
    try {
      const res = await fetch(`${API_URL}/api/chat/conversations`, {
        headers: { Authorization: `Bearer ${tok}` },
      });
      const data = await res.json();
      setConversations(Array.isArray(data) ? data : []);
    } catch (_) {}
  }, []);

  // Load chat history for a conversation
  const loadChatHistory = useCallback(async (customerId) => {
    try {
      const res = await fetch(`${API_URL}/api/chat/history/${customerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setChatMessages(Array.isArray(data) ? data : []);
      // Mark as read
      await fetch(`${API_URL}/api/chat/read/${customerId}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      setConversations((prev) =>
        prev.map((c) => (c.customerId === customerId ? { ...c, unreadCount: 0 } : c))
      );
    } catch (_) {}
  }, [token]);

  // Connect socket when admin mounts
  useEffect(() => {
    if (!token) return;
    if (!adminSocket) {
      adminSocket = io(API_URL, {
        auth: { token },
        transports: ["websocket"],
      });
    }
    adminSocket.on("connect", () => setChatConnected(true));
    adminSocket.on("disconnect", () => setChatConnected(false));
    adminSocket.on("message:new", (msg) => {
      // Update the conversation list
      setConversations((prev) => {
        const exists = prev.find((c) => c.customerId === msg.customerId);
        if (exists) {
          return prev.map((c) =>
            c.customerId === msg.customerId
              ? {
                  ...c,
                  lastMessage: msg.text,
                  lastTime: msg.createdAt,
                  unreadCount:
                    msg.senderRole === "customer" && selectedConv?.customerId !== msg.customerId
                      ? (c.unreadCount || 0) + 1
                      : c.unreadCount,
                }
              : c
          );
        }
        // New conversation from a new customer
        fetchConversations(token);
        return prev;
      });

      // If this message belongs to the currently selected conversation, append it
      setSelectedConv((sel) => {
        if (sel && sel.customerId === msg.customerId) {
          setChatMessages((prev) => {
            if (prev.some((m) => m._id === msg._id)) return prev;
            return [...prev, msg];
          });
        }
        return sel;
      });

      // Badge update if not on chat tab
      if (msg.senderRole === "customer") {
        setActiveTab((tab) => {
          if (tab !== "chat") setChatUnread((u) => u + 1);
          return tab;
        });
      }
    });
    return () => {
      adminSocket?.off("message:new");
    };
  }, [token, fetchConversations]);

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Send admin reply
  const handleAdminSend = (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !selectedConv || !adminSocket) return;
    adminSocket.emit("admin:send", {
      customerId: selectedConv.customerId,
      text: chatInput.trim(),
    });
    setChatInput("");
  };

  const handleSelectConversation = (conv) => {
    setSelectedConv(conv);
    loadChatHistory(conv.customerId);
    setChatUnread(0);
  };

  const fetchStats = async (authToken, silent = false) => {
    if (!silent) setStatsLoading(true);
    setStatsError("");
    try {
      const res = await fetch(`${API_URL}/api/admin/stats`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
      } else {
        const errData = await res.json().catch(() => ({}));
        setStatsError(errData.message || "Không thể lấy thống kê admin");
        console.error("Không thể lấy thống kê admin");
      }
    } catch (err) {
      setStatsError("Lỗi kết nối API: " + err.message);
      console.error("Lỗi kết nối API:", err);
    } finally {
      if (!silent) setStatsLoading(false);
    }
  };

  const fetchUsers = async (authToken) => {
    setUsersLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/users`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      } else {
        console.error("Không thể lấy danh sách người dùng");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchServices = async (authToken) => {
    setServicesLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/services`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setServices(data);
      } else {
        console.error("Không thể lấy danh sách dịch vụ");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setServicesLoading(false);
    }
  };

  const fetchOrders = async (authToken, silent = false) => {
    if (!silent) setOrdersLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/orders`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        
        // Smart Check: Detect any newly completed orders in real-time
        if (orders.length > 0) {
          const newlyCompleted = data.find(newOrder => 
            newOrder.status === "completed" && 
            !orders.some(oldOrder => oldOrder._id === newOrder._id && oldOrder.status === "completed")
          );
          if (newlyCompleted) {
            setToast(newlyCompleted);
            setTimeout(() => {
              setToast(null);
            }, 8000); // dismiss after 8s
          }
        }
        
        setOrders(data);
      } else {
        console.error("Không thể lấy danh sách đơn hàng");
      }
    } catch (err) {
      console.error(err);
    } finally {
      if (!silent) setOrdersLoading(false);
    }
  };

  // User Actions
  const handleUpdateUserRole = async (userId, userName, newRole) => {
    if (userId === adminUser?._id) {
      alert("Bạn không thể tự thay đổi vai trò của chính mình!");
      return;
    }
    
    if (window.confirm(`Xác nhận chuyển vai trò của "${userName}" thành "${newRole === 'vendor' ? 'Nhà cung cấp' : newRole === 'admin' ? 'Quản trị viên' : 'Khách hàng'}"?`)) {
      setActionLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/admin/users/${userId}/role`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ role: newRole })
        });
        const data = await res.json();
        if (res.ok) {
          alert("Cập nhật vai trò thành công!");
          fetchUsers(token);
        } else {
          alert(data.message || "Lỗi khi cập nhật");
        }
      } catch (err) {
        alert("Lỗi kết nối máy chủ");
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (userId === adminUser?._id) {
      alert("Bạn không thể tự xoá tài khoản của chính mình!");
      return;
    }

    if (window.confirm(`CẢNH BÁO: Bạn có chắc chắn muốn xoá vĩnh viễn tài khoản "${userName}"? Thao tác này không thể hoàn tác!`)) {
      setActionLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/admin/users/${userId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (res.ok) {
          alert("Xoá tài khoản thành công!");
          fetchUsers(token);
        } else {
          alert(data.message || "Lỗi khi xoá tài khoản");
        }
      } catch (err) {
        alert("Lỗi kết nối máy chủ");
      } finally {
        setActionLoading(false);
      }
    }
  };

  // Service Actions
  const handleDeleteService = async (serviceId, serviceName) => {
    if (window.confirm(`Xác nhận xoá bỏ dịch vụ "${serviceName}" khỏi hệ thống?`)) {
      setActionLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/services/${serviceId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (res.ok) {
          alert("Xoá dịch vụ thành công!");
          fetchServices(token);
        } else {
          alert("Lỗi khi xoá dịch vụ");
        }
      } catch (err) {
        alert("Lỗi kết nối máy chủ");
      } finally {
        setActionLoading(false);
      }
    }
  };

  // Order Actions
  const handleUpdateOrderStatus = async (orderId, currentStatus, newStatus) => {
    if (window.confirm(`Xác nhận thay đổi trạng thái đơn đặt từ "${statusLabels[currentStatus]}" thành "${statusLabels[newStatus]}"?`)) {
      setActionLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/admin/orders/${orderId}/status`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ status: newStatus })
        });
        const data = await res.json();
        if (res.ok) {
          alert("Cập nhật trạng thái đơn book thành công!");
          fetchOrders(token);
        } else {
          alert(data.message || "Lỗi khi cập nhật trạng thái");
        }
      } catch (err) {
        alert("Lỗi kết nối máy chủ");
      } finally {
        setActionLoading(false);
      }
    }
  };

  const formatPrice = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // Filtering Lists
  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(userSearch.toLowerCase()) || 
                          u.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = userRoleFilter === "all" || u.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  const filteredServices = services.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(serviceSearch.toLowerCase()) || 
                          s.address.toLowerCase().includes(serviceSearch.toLowerCase());
    const matchesCategory = serviceCategoryFilter === "all" || s.category === serviceCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  const filteredOrders = orders.filter((o) => {
    const clientName = o.user?.name || "";
    const clientEmail = o.user?.email || "";
    const svcName = o.service?.name || "";
    const refId = o.txnRef || "";

    const matchesSearch = clientName.toLowerCase().includes(orderSearch.toLowerCase()) ||
                          clientEmail.toLowerCase().includes(orderSearch.toLowerCase()) ||
                          svcName.toLowerCase().includes(orderSearch.toLowerCase()) ||
                          refId.toLowerCase().includes(orderSearch.toLowerCase());
                          
    const matchesStatus = orderStatusFilter === "all" || o.status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Render Stats & Charts
  const renderStatsPane = () => {
    if (statsLoading) {
      return (
        <div className={styles.loadingWrapper}>
          <div className={styles.spinner}></div>
          <p>Đang tải số liệu thống kê...</p>
        </div>
      );
    }

    if (statsError || !stats) {
      return (
        <div className={styles.loadingWrapper}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
          <p style={{ color: "#b85c5c", fontWeight: 600 }}>{statsError || "Không thể tải số liệu thống kê"}</p>
          <button 
            onClick={() => fetchStats(token)} 
            style={{ 
              marginTop: 16, 
              padding: "8px 16px", 
              background: "#4d5637", 
              color: "#fff", 
              border: "none", 
              borderRadius: 4, 
              cursor: "pointer",
              fontFamily: "Raleway, sans-serif",
              fontWeight: 600
            }}
          >
            Thử lại
          </button>
        </div>
      );
    }

    // Prepare chart limits
    const maxMonthlyRevenue = Math.max(...stats.monthlyRevenue.map((m) => m.amount), 10000000);
    const maxQuarterlyRevenue = Math.max(...stats.quarterlyRevenue.map((q) => q.amount), 30000000);

    return (
      <div className={styles.statsPane}>
        {/* Top Mini cards */}
        <div className={styles.analyticsStatsGrid}>
          <div className={styles.statsPanelCard}>
            <div className={styles.cardAccent} style={{ background: "#4d5637" }} />
            <div className={styles.cardFlexRow}>
              <div>
                <span className={styles.panelCardLabel}>Doanh Thu Nền Tảng (Admin)</span>
                <h3 className={styles.panelCardValue}>{formatPrice(stats.totalRevenue)}</h3>
                <span className={styles.panelCardSubtext}>100% Giao dịch thanh toán trực tiếp</span>
              </div>
              <div className={styles.panelCardIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 8h-6a2 2 0 0 0 0 4h4a2 2 0 0 1 0 4H8M12 6v12" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>

          <div className={styles.statsPanelCard}>
            <div className={styles.cardAccent} style={{ background: "#c3937c" }} />
            <div className={styles.cardFlexRow}>
              <div>
                <span className={styles.panelCardLabel}>Lượt Truy Cập Website</span>
                <h3 className={styles.panelCardValue}>{stats.websiteVisits.toLocaleString()}</h3>
                <span className={styles.panelCardSubtext}>Tăng trưởng 15% tuần qua</span>
              </div>
              <div className={styles.panelCardIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>

          <div className={styles.statsPanelCard}>
            <div className={styles.cardAccent} style={{ background: "#e2a93b" }} />
            <div className={styles.cardFlexRow}>
              <div>
                <span className={styles.panelCardLabel}>Tổng Đơn Book Lịch</span>
                <h3 className={styles.panelCardValue}>{stats.totalOrders}</h3>
                <span className={styles.panelCardSubtext}>Tỉ lệ chuyển đổi cao 85%</span>
              </div>
              <div className={styles.panelCardIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="16" y1="2" x2="16" y2="6" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="8" y1="2" x2="8" y2="6" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="3" y1="10" x2="21" y2="10" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>

          <div className={styles.statsPanelCard}>
            <div className={styles.cardAccent} style={{ background: "#9d7236" }} />
            <div className={styles.cardFlexRow}>
              <div>
                <span className={styles.panelCardLabel}>Thành Viên Đăng Ký</span>
                <h3 className={styles.panelCardValue}>{stats.totalUsers}</h3>
                <span className={styles.panelCardSubtext}>Khách hàng: {stats.userBreakdown.customer} | Vendor: {stats.userBreakdown.vendor}</span>
              </div>
              <div className={styles.panelCardIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="9" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className={styles.chartsGrid}>
          {/* Monthly Bar Chart */}
          <div className={styles.chartBlock}>
            <div className={styles.chartHeader}>
              <h4 className={styles.chartTitle}>Doanh thu chi tiết theo Tháng (Năm {new Date().getFullYear()})</h4>
              <span className={styles.chartSubtitle}>Đơn vị: VNĐ</span>
            </div>
            
            <div className={styles.monthlyChartContainer}>
              {stats.monthlyRevenue.map((m, idx) => {
                const percent = (m.amount / maxMonthlyRevenue) * 100;
                return (
                  <div key={idx} className={styles.chartCol}>
                    <div className={styles.chartBarWrapper}>
                      <div 
                        className={styles.chartBar} 
                        style={{ height: `${Math.max(percent, 3)}%` }}
                        title={`${monthNames[idx]}: ${formatPrice(m.amount)}`}
                      >
                        {m.amount > 0 && (
                          <div className={styles.chartBarTooltip}>
                            {formatPrice(m.amount)}
                          </div>
                        )}
                      </div>
                    </div>
                    <span className={styles.chartBarLabel}>{monthNames[idx]}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quarterly & Roles breakdown */}
          <div className={styles.sideChartsContainer}>
            {/* Quarterly Revenue bars */}
            <div className={styles.chartBlock} style={{ marginBottom: 24 }}>
              <h4 className={styles.chartTitle} style={{ marginBottom: 20 }}>Doanh thu theo Quý</h4>
              <div className={styles.quarterlyRows}>
                {stats.quarterlyRevenue.map((q, idx) => {
                  const percent = (q.amount / maxQuarterlyRevenue) * 100;
                  return (
                    <div key={idx} className={styles.quarterRow}>
                      <div className={styles.quarterRowInfo}>
                        <span className={styles.quarterLabel}>Quý {q.quarter}</span>
                        <strong className={styles.quarterValue}>{formatPrice(q.amount)}</strong>
                      </div>
                      <div className={styles.quarterProgressBarBG}>
                        <div 
                          className={styles.quarterProgressBar} 
                          style={{ width: `${percent}%`, backgroundColor: idx % 2 === 0 ? "#4d5637" : "#c3937c" }} 
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Roles breakdown */}
            <div className={styles.chartBlock}>
              <h4 className={styles.chartTitle} style={{ marginBottom: 20 }}>Cơ cấu người dùng website</h4>
              <div className={styles.userRoleDistribution}>
                <div className={styles.roleDistributionRow}>
                  <div className={styles.roleDistributionLabel}>
                    <span className={styles.roleCircle} style={{ background: "#c3937c" }} />
                    Khách Hàng (Customers)
                  </div>
                  <strong>{stats.userBreakdown.customer} người ({((stats.userBreakdown.customer / stats.totalUsers) * 100 || 0).toFixed(0)}%)</strong>
                </div>
                <div className={styles.roleDistributionRow}>
                  <div className={styles.roleDistributionLabel}>
                    <span className={styles.roleCircle} style={{ background: "#4d5637" }} />
                    Nhà Cung Cấp (Vendors)
                  </div>
                  <strong>{stats.userBreakdown.vendor} người ({((stats.userBreakdown.vendor / stats.totalUsers) * 100 || 0).toFixed(0)}%)</strong>
                </div>
                <div className={styles.roleDistributionRow}>
                  <div className={styles.roleDistributionLabel}>
                    <span className={styles.roleCircle} style={{ background: "#9d7236" }} />
                    Quản Trị Viên (Admins)
                  </div>
                  <strong>{stats.userBreakdown.admin} người ({((stats.userBreakdown.admin / stats.totalUsers) * 100 || 0).toFixed(0)}%)</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.adminDashboardPage}>
      <SharedHeader theme="light" />

      {/* Decorative patterns */}
      <div className={styles.bgCircle1} />
      <div className={styles.bgCircle2} />
      <img className={styles.bgLeaf} alt="" src="/Layer-1.svg" />

      <main className={styles.container}>
        {/* Banner Section */}
        <section className={styles.heroSection}>
          <div className={styles.heroOverlay} />
          <div className={styles.heroContent}>
            <span className={styles.eyebrow}>HỆ THỐNG QUẢN TRỊ VIÊN</span>
            <h1 className={styles.heroTitle}>AN Wedding Administrator</h1>
            <p className={styles.heroSubtitle}>
              Chào mừng trở lại Quản trị viên <strong style={{ color: "#ede3d9" }}>{adminUser?.name}</strong>. Cổng theo dõi doanh thu và giám sát chất lượng hệ thống giao dịch, thành viên, và các dịch vụ tiệc cưới đối tác.
            </p>
          </div>
        </section>

        {/* Vendor Link Card for Admin bypass */}
        <div className={styles.vendorLinkCard}>
          <div className={styles.vendorLinkText}>
            <h3>Quản lý Dịch vụ với Vai trò Vendor (Đăng/Sửa bài)</h3>
            <p>Admin có toàn quyền đăng mới dịch vụ tiệc cưới, chỉnh sửa hoặc bổ sung các gói báo giá trực tiếp thông qua cổng Dashboard dành riêng cho Nhà cung cấp.</p>
          </div>
          <Link to="/vendor/dashboard" className={styles.btnVendorGo}>
            Đi tới Dashboard Vendor →
          </Link>
        </div>

        {/* Dashboard Section Controls - Sub Header Tabs */}
        <section className={styles.dashboardTabsWrapper}>
          <div className={styles.tabsContainer}>
            <button 
              className={`${styles.tabLink} ${activeTab === "analytics" ? styles.tabLinkActive : ""}`}
              onClick={() => setActiveTab("analytics")}
            >
              Báo cáo Thống kê
            </button>
            <button 
              className={`${styles.tabLink} ${activeTab === "users" ? styles.tabLinkActive : ""}`}
              onClick={() => setActiveTab("users")}
            >
              Quản lý Thành viên
            </button>
            <button 
              className={`${styles.tabLink} ${activeTab === "services" ? styles.tabLinkActive : ""}`}
              onClick={() => setActiveTab("services")}
            >
              Quản lý Dịch vụ
            </button>
            <button 
              className={`${styles.tabLink} ${activeTab === "orders" ? styles.tabLinkActive : ""}`}
              onClick={() => setActiveTab("orders")}
            >
              Quản lý Đơn book VNPay
            </button>
            <button
              className={`${styles.tabLink} ${activeTab === "chat" ? styles.tabLinkActive : ""}`}
              onClick={() => { setActiveTab("chat"); setChatUnread(0); }}
              style={{ position: "relative" }}
            >
              💬 Hộp thư hỗ trợ
              {chatUnread > 0 && (
                <span style={{
                  position: "absolute", top: 2, right: 2,
                  background: "#e53935", color: "#fff",
                  fontSize: 10, fontWeight: 700,
                  width: 16, height: 16, borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>{chatUnread}</span>
              )}
            </button>
          </div>
        </section>

        {/* Pane Contents */}
        <section className={styles.paneContentArea}>
          {/* TAB 1: ANALYTICS & CHARTS */}
          {activeTab === "analytics" && renderStatsPane()}

          {/* TAB 5: CHAT */}
          {activeTab === "chat" && (
            <div style={{ display: "flex", gap: 0, height: 580, background: "#fff", borderRadius: 12, overflow: "hidden", border: "1px solid #ede8e2", boxShadow: "0 4px 24px rgba(0,0,0,0.07)" }}>
              {/* Conversations sidebar */}
              <div style={{ width: 280, borderRight: "1px solid #f0ece6", display: "flex", flexDirection: "column", background: "#faf9f7" }}>
                <div style={{ padding: "18px 16px 12px", borderBottom: "1px solid #f0ece6" }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 700, color: "#4d5637" }}>Hộp thư hỗ trợ</div>
                  <div style={{ fontSize: 12, color: chatConnected ? "#4caf50" : "#9e9e9e", marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: chatConnected ? "#4caf50" : "#9e9e9e", display: "inline-block" }} />
                    {chatConnected ? "Đang kết nối" : "Mất kết nối"}
                  </div>
                </div>
                <div style={{ flex: 1, overflowY: "auto" }}>
                  {conversations.length === 0 && (
                    <div style={{ padding: 24, textAlign: "center", color: "#aaa", fontSize: 14 }}>Chưa có cuộc hội thoại nào</div>
                  )}
                  {conversations.map((conv) => (
                    <div
                      key={conv.conversationId}
                      onClick={() => handleSelectConversation(conv)}
                      style={{
                        padding: "14px 16px",
                        cursor: "pointer",
                        background: selectedConv?.customerId === conv.customerId ? "#fff" : "transparent",
                        borderBottom: "1px solid #f5f0ea",
                        borderLeft: selectedConv?.customerId === conv.customerId ? "3px solid #c3937c" : "3px solid transparent",
                        transition: "all 0.2s",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div style={{ fontWeight: 600, fontSize: 14, color: "#333" }}>{conv.customer?.name || `Khách hàng ${conv.customerId.slice(-4)}`}</div>
                        {conv.unreadCount > 0 && (
                          <span style={{ background: "#e53935", color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 10 }}>{conv.unreadCount}</span>
                        )}
                      </div>
                      <div style={{ fontSize: 12, color: "#888", marginTop: 3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{conv.lastMessage || ""}</div>
                      <div style={{ fontSize: 11, color: "#bbb", marginTop: 2 }}>
                        {conv.lastTime ? new Date(conv.lastTime).toLocaleString("vi-VN", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit" }) : ""}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chat area */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                {!selectedConv ? (
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#aaa" }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>💬</div>
                    <div style={{ fontSize: 15, fontWeight: 600 }}>Chọn một cuộc hội thoại để bắt đầu</div>
                    <div style={{ fontSize: 13, marginTop: 6 }}>Tin nhắn từ khách hàng sẽ xuất hiện ở đây</div>
                  </div>
                ) : (
                  <>
                    {/* Chat header */}
                    <div style={{ padding: "14px 20px", borderBottom: "1px solid #f0ece6", display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #c3937c, #a0725c)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 15 }}>
                        {(selectedConv.customer?.name || "K")[0].toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 14, color: "#333" }}>{selectedConv.customer?.name || `Khách hàng`}</div>
                        <div style={{ fontSize: 12, color: "#888" }}>{selectedConv.customer?.email || ""}</div>
                      </div>
                    </div>

                    {/* Messages */}
                    <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 10, background: "#faf9f7" }}>
                      {chatMessages.map((msg, idx) => {
                        const isAdmin = msg.senderRole === "admin";
                        const senderLabel = isAdmin
                          ? (msg.senderName || "Admin AN Wedding")
                          : (msg.senderName || selectedConv.customer?.name || "Khách hàng");
                        return (
                          <div
                            key={msg._id || idx}
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: isAdmin ? "flex-end" : "flex-start",
                              maxWidth: "75%",
                              alignSelf: isAdmin ? "flex-end" : "flex-start",
                            }}
                          >
                            {/* Sender label for EVERY message so it's always clear who sent it */}
                            <div style={{
                              fontSize: 11,
                              color: isAdmin ? "#6a8060" : "#a07060",
                              marginBottom: 3,
                              fontWeight: 700,
                              letterSpacing: "0.2px",
                            }}>
                              {senderLabel}
                            </div>
                            <div style={{
                              padding: "10px 14px",
                              borderRadius: isAdmin ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                              background: isAdmin ? "linear-gradient(135deg, #4d5637, #3a4129)" : "#fff",
                              color: isAdmin ? "#fff" : "#333",
                              fontSize: 14,
                              border: isAdmin ? "none" : "1px solid #ede8e2",
                              boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                              wordBreak: "break-word",
                            }}>
                              {msg.text}
                            </div>
                            <div style={{ fontSize: 10, color: "#aaa", marginTop: 3 }}>
                              {new Date(msg.createdAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                            </div>
                          </div>
                        );
                      })}
                      <div ref={chatEndRef} />
                    </div>

                    {/* Input */}
                    <form
                      onSubmit={handleAdminSend}
                      style={{ display: "flex", gap: 10, padding: "12px 16px", borderTop: "1px solid #f0ece6", background: "#fff" }}
                    >
                      <input
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder={`Trả lời ${selectedConv.customer?.name || "khách hàng"}...`}
                        maxLength={500}
                        style={{
                          flex: 1, border: "1.5px solid #e8e0d8", borderRadius: 24, padding: "9px 16px",
                          fontSize: 14, outline: "none", fontFamily: "inherit", background: "#faf9f7",
                        }}
                      />
                      <button
                        type="submit"
                        disabled={!chatInput.trim()}
                        style={{
                          width: 42, height: 42, borderRadius: "50%",
                          background: "linear-gradient(135deg, #4d5637, #3a4129)",
                          color: "#fff", border: "none", cursor: chatInput.trim() ? "pointer" : "not-allowed",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          opacity: chatInput.trim() ? 1 : 0.4, flexShrink: 0,
                          transition: "opacity 0.2s",
                        }}
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                        </svg>
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: USER MANAGEMENT */}
          {activeTab === "users" && (
            <div className={styles.listPane}>
              {/* Controls */}
              <div className={styles.listFilterRow}>
                <div className={styles.listSearchWrapper}>
                  <span className={styles.listSearchIcon}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                  </span>
                  <input 
                    type="text" 
                    placeholder="Tìm tên, email thành viên..."
                    className={styles.listSearchInput}
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                  />
                </div>
                <div className={styles.listSelectWrapper}>
                  <select 
                    className={styles.listFilterSelect}
                    value={userRoleFilter}
                    onChange={(e) => setUserRoleFilter(e.target.value)}
                  >
                    <option value="all">Tất cả vai trò</option>
                    <option value="customer">Khách hàng</option>
                    <option value="vendor">Nhà cung cấp</option>
                    <option value="admin">Quản trị viên</option>
                  </select>
                </div>
              </div>

              {/* Table */}
              {usersLoading ? (
                <div className={styles.loadingWrapper}>
                  <div className={styles.spinner}></div>
                  <p>Đang tải danh sách thành viên...</p>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className={styles.emptyTableState}>
                  <p>Không tìm thấy thành viên nào khớp với điều kiện tìm kiếm.</p>
                </div>
              ) : (
                <div className={styles.tableResponsive}>
                  <table className={styles.adminTable}>
                    <thead>
                      <tr>
                        <th>Tên Thành Viên</th>
                        <th>Địa Chỉ Email</th>
                        <th>Vai Trò</th>
                        <th>Ngày Đăng Ký</th>
                        <th style={{ textAlign: "center" }}>Hành Động Quản Trị</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((u) => {
                        const isSelf = u._id === adminUser?._id;
                        return (
                          <tr key={u._id} className={isSelf ? styles.tableSelfRow : ""}>
                            <td>
                              <div className={styles.userNameCell}>
                                <div className={styles.userAvatarDot}>
                                  {u.name?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <strong>{u.name}</strong> {isSelf && <span className={styles.selfLabel}>(Bạn)</span>}
                                </div>
                              </div>
                            </td>
                            <td>{u.email}</td>
                            <td>
                              <span 
                                className={styles.roleBadge}
                                style={{ 
                                  backgroundColor: u.role === "admin" ? "#9d723622" : u.role === "vendor" ? "#4d563722" : "#c3937c22",
                                  color: u.role === "admin" ? "#9d7236" : u.role === "vendor" ? "#4d5637" : "#c3937c"
                                }}
                              >
                                {u.role === "admin" ? "Quản trị viên" : u.role === "vendor" ? "Nhà cung cấp" : "Khách hàng"}
                              </span>
                            </td>
                            <td>{formatDate(u.createdAt)}</td>
                            <td>
                              <div className={styles.tableActionsGroup}>
                                <select 
                                  className={styles.roleChangeSelect}
                                  value={u.role}
                                  onChange={(e) => handleUpdateUserRole(u._id, u.name, e.target.value)}
                                  disabled={isSelf || actionLoading}
                                  title={isSelf ? "Không thể tự thay đổi vai trò của mình" : "Thay đổi vai trò"}
                                >
                                  <option value="customer">Khách hàng</option>
                                  <option value="vendor">Nhà cung cấp</option>
                                  <option value="admin">Quản trị viên</option>
                                </select>
                                <button 
                                  className={styles.btnTableDelete}
                                  onClick={() => handleDeleteUser(u._id, u.name)}
                                  disabled={isSelf || actionLoading}
                                  title={isSelf ? "Không thể tự xoá chính mình" : "Xoá người dùng"}
                                >
                                  Xoá
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SERVICES MANAGEMENT */}
          {activeTab === "services" && (
            <div className={styles.listPane}>
              {/* Controls */}
              <div className={styles.listFilterRow}>
                <div className={styles.listSearchWrapper}>
                  <span className={styles.listSearchIcon}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                  </span>
                  <input 
                    type="text" 
                    placeholder="Tìm tên dịch vụ, địa điểm..."
                    className={styles.listSearchInput}
                    value={serviceSearch}
                    onChange={(e) => setServiceSearch(e.target.value)}
                  />
                </div>
                <div className={styles.listSelectWrapper}>
                  <select 
                    className={styles.listFilterSelect}
                    value={serviceCategoryFilter}
                    onChange={(e) => setServiceCategoryFilter(e.target.value)}
                  >
                    <option value="all">Tất cả dịch vụ</option>
                    {Object.entries(categoryLabels).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Table */}
              {servicesLoading ? (
                <div className={styles.loadingWrapper}>
                  <div className={styles.spinner}></div>
                  <p>Đang tải danh sách dịch vụ...</p>
                </div>
              ) : filteredServices.length === 0 ? (
                <div className={styles.emptyTableState}>
                  <p>Không tìm thấy dịch vụ nào khớp với điều kiện tìm kiếm.</p>
                </div>
              ) : (
                <div className={styles.tableResponsive}>
                  <table className={styles.adminTable}>
                    <thead>
                      <tr>
                        <th>Dịch Vụ Cưới</th>
                        <th>Danh Mục</th>
                        <th>Chủ Sở Hữu (Vendor)</th>
                        <th>Giá Khởi Điểm</th>
                        <th>Đánh Giá</th>
                        <th style={{ textAlign: "center" }}>Hành Động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredServices.map((s) => (
                        <tr key={s._id}>
                          <td>
                            <div className={styles.serviceNameCell}>
                              <img src={s.image} alt={s.name} className={styles.tableServiceImg} />
                              <div>
                                <strong className={styles.svcNameText}>{s.name}</strong>
                                <span className={styles.svcAddressText}>
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginRight: 4, verticalAlign: "middle" }}>
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                    <circle cx="12" cy="10" r="3" />
                                  </svg>
                                  {s.address}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span>{categoryIcons[s.category]} {categoryLabels[s.category] || s.category}</span>
                          </td>
                          <td>
                            {s.vendor ? (
                              <div className={styles.vendorInfoCell}>
                                <strong>{s.vendor.name}</strong>
                                <span>{s.vendor.email}</span>
                              </div>
                            ) : (
                              <span className={styles.systemCreatedLabel}>Hệ thống</span>
                            )}
                          </td>
                          <td style={{ color: "#c3937c", fontWeight: 700 }}>{s.priceLabel || formatPrice(s.price)}</td>
                          <td>
                            <span style={{ color: "#e2a93b" }}>★</span> <strong>{s.rating || "5.0"}</strong> ({s.reviewsCount || 0} đánh giá)
                          </td>
                          <td>
                            <div className={styles.tableActionsGroup} style={{ justifyContent: "center" }}>
                              <Link 
                                to={`/service/${s._id}`} 
                                className={styles.btnTableView} 
                                title="Xem trang chi tiết"
                              >
                                Xem chi tiết
                              </Link>
                              <button 
                                className={styles.btnTableDelete}
                                onClick={() => handleDeleteService(s._id, s.name)}
                                disabled={actionLoading}
                                title="Xoá bỏ dịch vụ"
                              >
                                Gỡ bỏ
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: ORDERS MANAGEMENT (VNPAY REVIEW) */}
          {activeTab === "orders" && (
            <div className={styles.listPane}>
              {/* Informative Security banner */}
              <div className={styles.securityBanner}>
                <span className={styles.securityBannerIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </span>
                <div>
                  <strong>GIAO DỊCH AN TOÀN TRỰC TIẾP CHO ADMIN</strong>
                  <p>Mọi khoản thanh toán trên website AN Wedding sẽ được chuyển thẳng vào tài khoản của Admin (Platform Owner) thay vì Vendor. Chỉ sau khi Admin phê duyệt hoặc xác nhận dịch vụ được thực hiện thành công, giao dịch mới được chuyển đổi trạng thái hoàn tất để đảm bảo an toàn tối đa cho khách hàng.</p>
                </div>
              </div>

              {/* Controls */}
              <div className={styles.listFilterRow}>
                <div className={styles.listSearchWrapper}>
                  <span className={styles.listSearchIcon}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                  </span>
                  <input 
                    type="text" 
                    placeholder="Tìm tên KH, email, tên dịch vụ hoặc VNPay Ref ID..."
                    className={styles.listSearchInput}
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                  />
                </div>
                <div className={styles.listSelectWrapper}>
                  <select 
                    className={styles.listFilterSelect}
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                  >
                    <option value="all">Tất cả giao dịch</option>
                    <option value="completed">Thành công</option>
                    <option value="pending">Đang chờ duyệt</option>
                    <option value="failed">Thất bại</option>
                  </select>
                </div>
              </div>

              {/* Table */}
              {ordersLoading ? (
                <div className={styles.loadingWrapper}>
                  <div className={styles.spinner}></div>
                  <p>Đang tải danh sách đơn đặt cưới...</p>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className={styles.emptyTableState}>
                  <p>Không tìm thấy đơn đặt nào khớp với điều kiện tìm kiếm.</p>
                </div>
              ) : (
                <div className={styles.tableResponsive}>
                  <table className={styles.adminTable}>
                    <thead>
                      <tr>
                        <th>Khách Hàng</th>
                        <th>Dịch Vụ Cưới</th>
                        <th>Tổng Tiền</th>
                        <th>Mã Giao Dịch VNPay</th>
                        <th>Trạng Thái</th>
                        <th>Hành Động Quản Trị</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((o) => (
                        <tr key={o._id}>
                          <td>
                            {o.user ? (
                              <div className={styles.vendorInfoCell}>
                                <strong>{o.user.name}</strong>
                                <span>{o.user.email}</span>
                              </div>
                            ) : (
                              <span style={{ color: "#787878" }}>Khách vãng lai</span>
                            )}
                          </td>
                          <td>
                            {o.service ? (
                              <div className={styles.serviceNameCell}>
                                <img src={o.service.image} alt={o.service.name} className={styles.tableServiceImgMini} />
                                <div>
                                  <strong className={styles.svcNameTextMini}>{o.service.name}</strong>
                                  <span className={styles.svcCategoryMini}>{categoryIcons[o.service.category]} {categoryLabels[o.service.category]}</span>
                                </div>
                              </div>
                            ) : (
                              <span style={{ color: "#b85c5c" }}>Dịch vụ đã gỡ bỏ</span>
                            )}
                          </td>
                          <td>
                            <div className={styles.priceDateCell}>
                              <strong style={{ color: "#4d5637" }}>{formatPrice(o.amount)}</strong>
                              <span>{formatDate(o.createdAt)}</span>
                            </div>
                          </td>
                          <td>
                            <code className={styles.vnpayCode}>{o.txnRef || "Chưa tạo mã"}</code>
                          </td>
                          <td>
                            <span 
                              className={styles.statusBadge}
                              style={{ 
                                backgroundColor: `${statusColors[o.status]}22`,
                                color: statusColors[o.status]
                              }}
                            >
                              {statusLabels[o.status]}
                            </span>
                          </td>
                          <td>
                            <div className={styles.tableActionsGroup}>
                              <button
                                className={styles.btnTableView}
                                onClick={() => setSelectedOrder(o)}
                                title="Xem chi tiết đơn hàng"
                              >
                                Chi tiết
                              </button>
                              {o.status === "pending" && (
                                <>
                                  <button 
                                    className={styles.btnApprove}
                                    onClick={() => handleUpdateOrderStatus(o._id, o.status, "completed")}
                                    disabled={actionLoading}
                                    title="Xác nhận thanh toán thành công"
                                  >
                                    ✓ Phê Duyệt
                                  </button>
                                  <button 
                                    className={styles.btnReject}
                                    onClick={() => handleUpdateOrderStatus(o._id, o.status, "failed")}
                                    disabled={actionLoading}
                                    title="Đánh dấu thanh toán thất bại"
                                  >
                                    ✕ Từ Chối
                                  </button>
                                </>
                              )}
                              {o.status === "completed" && (
                                <button 
                                  className={styles.btnResetStatus}
                                  onClick={() => handleUpdateOrderStatus(o._id, o.status, "pending")}
                                  disabled={actionLoading}
                                  title="Đặt lại trạng thái chờ duyệt"
                                >
                                  🔄 Hoàn chuyển
                                </button>
                              )}
                              {o.status === "failed" && (
                                <button 
                                  className={styles.btnResetStatus}
                                  onClick={() => handleUpdateOrderStatus(o._id, o.status, "pending")}
                                  disabled={actionLoading}
                                  title="Đơn thử lại"
                                >
                                  🔄 Thử lại
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      <Footer1 />

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className={styles.modalOverlay} onClick={() => setSelectedOrder(null)}>
          <div className={styles.orderDetailModal} onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className={styles.orderDetailHeader}>
              <div>
                <p className={styles.orderDetailEyebrow}>CHI TIẾT ĐƠN HÀNG</p>
                <h2 className={styles.orderDetailTitle}>
                  {selectedOrder.service?.name || "Dịch vụ đã gỡ bỏ"}
                </h2>
              </div>
              <button className={styles.orderDetailClose} onClick={() => setSelectedOrder(null)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            {/* Status bar */}
            <div
              className={styles.orderDetailStatusBar}
              style={{ backgroundColor: `${statusColors[selectedOrder.status]}18`, borderColor: `${statusColors[selectedOrder.status]}44` }}
            >
              <span style={{ color: statusColors[selectedOrder.status], fontWeight: 700, fontSize: 13, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                {statusLabels[selectedOrder.status]}
              </span>
              <span style={{ color: '#787878', fontSize: 12 }}>
                Tạo lúc: {formatDate(selectedOrder.createdAt)}
              </span>
            </div>

            {/* Two-column grid */}
            <div className={styles.orderDetailGrid}>
              {/* Left: Customer Info */}
              <div className={styles.orderDetailSection}>
                <h4 className={styles.orderDetailSectionTitle}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6, verticalAlign: 'middle' }}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  Thông tin khách hàng
                </h4>
                <div className={styles.orderDetailInfoList}>
                  <div className={styles.orderDetailInfoRow}>
                    <span className={styles.orderDetailKey}>Họ tên</span>
                    <span className={styles.orderDetailVal}>{selectedOrder.user?.name || "—"}</span>
                  </div>
                  <div className={styles.orderDetailInfoRow}>
                    <span className={styles.orderDetailKey}>Email</span>
                    <span className={styles.orderDetailVal}>{selectedOrder.user?.email || "—"}</span>
                  </div>
                  <div className={styles.orderDetailInfoRow}>
                    <span className={styles.orderDetailKey}>Số điện thoại</span>
                    <span className={styles.orderDetailVal}>{selectedOrder.user?.phone || "Chưa cập nhật"}</span>
                  </div>
                  <div className={styles.orderDetailInfoRow}>
                    <span className={styles.orderDetailKey}>Địa chỉ</span>
                    <span className={styles.orderDetailVal}>{selectedOrder.user?.address || "Chưa cập nhật"}</span>
                  </div>
                  <div className={styles.orderDetailInfoRow}>
                    <span className={styles.orderDetailKey}>Vai trò</span>
                    <span className={styles.orderDetailVal}>{selectedOrder.user?.role || "—"}</span>
                  </div>
                </div>
              </div>

              {/* Right: Service Info */}
              <div className={styles.orderDetailSection}>
                <h4 className={styles.orderDetailSectionTitle}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6, verticalAlign: 'middle' }}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
                  Thông tin dịch vụ
                </h4>
                {selectedOrder.service ? (
                  <div className={styles.orderDetailInfoList}>
                    {selectedOrder.service.image && (
                      <div className={styles.orderDetailServiceImgWrap}>
                        <img
                          src={selectedOrder.service.image}
                          alt={selectedOrder.service.name}
                          className={styles.orderDetailServiceImg}
                        />
                        <Link
                          to={`/service/${selectedOrder.service._id}`}
                          target="_blank"
                          className={styles.orderDetailViewLink}
                          title="Xem trang dịch vụ"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                          Xem trang dịch vụ
                        </Link>
                      </div>
                    )}
                    <div className={styles.orderDetailInfoRow}>
                      <span className={styles.orderDetailKey}>Tên dịch vụ</span>
                      <span className={styles.orderDetailVal}>{selectedOrder.service.name}</span>
                    </div>
                    <div className={styles.orderDetailInfoRow}>
                      <span className={styles.orderDetailKey}>Danh mục</span>
                      <span className={styles.orderDetailVal}>{categoryLabels[selectedOrder.service.category] || selectedOrder.service.category}</span>
                    </div>
                    <div className={styles.orderDetailInfoRow}>
                      <span className={styles.orderDetailKey}>Địa điểm</span>
                      <span className={styles.orderDetailVal}>{selectedOrder.service.address || "—"}</span>
                    </div>
                    {selectedOrder.service.phone && (
                      <div className={styles.orderDetailInfoRow}>
                        <span className={styles.orderDetailKey}>Liên hệ DV</span>
                        <a href={`tel:${selectedOrder.service.phone}`} className={styles.orderDetailVal} style={{ color: '#4d5637' }}>{selectedOrder.service.phone}</a>
                      </div>
                    )}
                    {selectedOrder.service.priceLabel && (
                      <div className={styles.orderDetailInfoRow}>
                        <span className={styles.orderDetailKey}>Giá dịch vụ</span>
                        <span className={styles.orderDetailVal} style={{ color: '#c3937c', fontWeight: 700 }}>{selectedOrder.service.priceLabel}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <p style={{ color: '#b85c5c', fontSize: 14 }}>Dịch vụ đã bị xoá khỏi hệ thống.</p>
                )}
              </div>
            </div>

            {/* Vendor Info Section */}
            {selectedOrder.service?.vendor && (
              <div className={styles.orderDetailVendorSection}>
                <h4 className={styles.orderDetailSectionTitle}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6, verticalAlign: 'middle' }}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  Thông tin Vendor (Nhà cung cấp)
                </h4>
                <div className={styles.orderDetailVendorGrid}>
                  {/* Vendor avatar + name */}
                  <div className={styles.orderDetailVendorCard}>
                    <div className={styles.orderDetailVendorAvatar}>
                      {selectedOrder.service.vendor.avatar ? (
                        <img src={selectedOrder.service.vendor.avatar} alt={selectedOrder.service.vendor.name} className={styles.orderDetailVendorAvatarImg} />
                      ) : (
                        <div className={styles.orderDetailVendorAvatarFallback}>
                          {selectedOrder.service.vendor.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className={styles.orderDetailVendorIdentity}>
                      <span className={styles.orderDetailVendorRole}>NHÀ CUNG CẤP</span>
                      <strong className={styles.orderDetailVendorName}>{selectedOrder.service.vendor.name}</strong>
                      <span className={styles.orderDetailVendorEmail}>{selectedOrder.service.vendor.email}</span>
                    </div>
                    <Link
                      to={`/vendor/${selectedOrder.service.vendor?._id || selectedOrder.service.vendor?.id || selectedOrder.service.vendor}`}
                      target="_blank"
                      className={styles.orderDetailVendorProfileBtn}
                      title="Xem trang vendor"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                      Xem hồ sơ
                    </Link>
                  </div>

                  {/* Vendor contact */}
                  <div className={styles.orderDetailVendorContacts}>
                    {selectedOrder.service.vendor.phone && (
                      <div className={styles.orderDetailInfoRow}>
                        <span className={styles.orderDetailKey}>Điện thoại</span>
                        <a href={`tel:${selectedOrder.service.vendor.phone}`} className={styles.orderDetailVal} style={{ color: '#4d5637' }}>{selectedOrder.service.vendor.phone}</a>
                      </div>
                    )}
                    {selectedOrder.service.vendor.address && (
                      <div className={styles.orderDetailInfoRow}>
                        <span className={styles.orderDetailKey}>Địa chỉ</span>
                        <span className={styles.orderDetailVal}>{selectedOrder.service.vendor.address}</span>
                      </div>
                    )}
                    {selectedOrder.service.vendor.facebook && (
                      <div className={styles.orderDetailInfoRow}>
                        <span className={styles.orderDetailKey}>Facebook</span>
                        <a href={selectedOrder.service.vendor.facebook} target="_blank" rel="noreferrer" className={styles.orderDetailVal} style={{ color: '#4d5637' }}>Xem trang</a>
                      </div>
                    )}
                    {selectedOrder.service.vendor.description && (
                      <div className={styles.orderDetailInfoRow} style={{ flexDirection: 'column', gap: 4, alignItems: 'flex-start' }}>
                        <span className={styles.orderDetailKey}>Giới thiệu</span>
                        <span style={{ fontSize: 12, color: '#555', lineHeight: 1.6 }}>{selectedOrder.service.vendor.description}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Packages ordered */}
            {selectedOrder.items && selectedOrder.items.length > 0 && (
              <div className={styles.orderDetailPackages}>
                <h4 className={styles.orderDetailSectionTitle}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6, verticalAlign: 'middle' }}><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                  Các gói dịch vụ đã đặt
                </h4>
                <div className={styles.orderDetailItemsGrid}>
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className={styles.orderDetailItemCard}>
                      <span className={styles.orderDetailItemName}>{item.name}</span>
                      <span className={styles.orderDetailItemPrice}>{formatPrice(item.price)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Payment Summary */}
            <div className={styles.orderDetailPaymentSummary}>
              <div className={styles.orderDetailPayRow}>
                <span className={styles.orderDetailPayLabel}>Mã giao dịch VNPay</span>
                <code className={styles.orderDetailTxnCode}>{selectedOrder.txnRef}</code>
              </div>
              <div className={styles.orderDetailPayRow}>
                <span className={styles.orderDetailPayLabel}>Tổng tiền thanh toán</span>
                <span className={styles.orderDetailPayAmount}>{formatPrice(selectedOrder.amount)}</span>
              </div>
            </div>

            {/* Modal Action Buttons */}
            <div className={styles.orderDetailActions}>
              {selectedOrder.status === "pending" && (
                <>
                  <button
                    className={styles.btnApprove}
                    onClick={() => {
                      handleUpdateOrderStatus(selectedOrder._id, selectedOrder.status, "completed");
                      setSelectedOrder(null);
                    }}
                    disabled={actionLoading}
                  >
                    ✓ Phê Duyệt Thanh Toán
                  </button>
                  <button
                    className={styles.btnReject}
                    onClick={() => {
                      handleUpdateOrderStatus(selectedOrder._id, selectedOrder.status, "failed");
                      setSelectedOrder(null);
                    }}
                    disabled={actionLoading}
                  >
                    ✕ Từ Chối
                  </button>
                </>
              )}
              {(selectedOrder.status === "completed" || selectedOrder.status === "failed") && (
                <button
                  className={styles.btnResetStatus}
                  onClick={() => {
                    handleUpdateOrderStatus(selectedOrder._id, selectedOrder.status, "pending");
                    setSelectedOrder(null);
                  }}
                  disabled={actionLoading}
                >
                  🔄 Hoàn chuyển về Chờ duyệt
                </button>
              )}
              <button
                className={styles.btnTableDelete}
                onClick={() => setSelectedOrder(null)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className={styles.notificationToast}>
          <div className={styles.toastHeader}>
            <span className={styles.toastIcon}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ display: "inline-block", verticalAlign: "middle" }}>
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </span>
            <strong>GIAO DỊCH THÀNH CÔNG MỚI!</strong>
            <button className={styles.toastClose} onClick={() => setToast(null)}>✕</button>
          </div>
          <div className={styles.toastBody}>
            <p>Khách hàng: <strong>{toast.user?.name || "Khách vãng lai"}</strong></p>
            <p>Dịch vụ: <strong>{toast.service?.name || "Dịch vụ cưới"}</strong></p>
            <p>Số tiền: <strong style={{ color: "#4d5637" }}>{formatPrice(toast.amount)}</strong></p>
            <p>Mã giao dịch: <code className={styles.toastCode}>{toast.txnRef}</code></p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
