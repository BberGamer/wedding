import { useState, useEffect } from "react";
import SharedHeader from "../components/SharedHeader";
import Footer1 from "../components/Footer1";
import { API_URL } from "../config";
import styles from "./BlogPage.module.css";

// Helper to determine mock category based on post title keywords
const getCategoryFromTitle = (title) => {
  const t = title.toLowerCase();
  if (t.includes("nhà hàng") || t.includes("restaurant") || t.includes("tiệc") || t.includes("sảnh")) {
    return "Nhà hàng";
  }
  if (t.includes("trang điểm") || t.includes("makeup") || t.includes("son") || t.includes("phấn")) {
    return "Trang điểm";
  }
  if (t.includes("váy") || t.includes("vest") || t.includes("soiree") || t.includes("trang phục")) {
    return "Trang phục";
  }
  if (t.includes("chụp ảnh") || t.includes("chụp hình") || t.includes("album") || t.includes("phóng sự") || t.includes("quay")) {
    return "Chụp ảnh";
  }
  return "Kinh nghiệm cưới";
};

// Helper to get beautiful Unsplash image corresponding to the category
const getCategoryImageUrl = (category) => {
  switch (category) {
    case "Nhà hàng":
      return "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=600";
    case "Trang điểm":
      return "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=600";
    case "Trang phục":
      return "https://images.unsplash.com/photo-1594552072238-b8a33785b261?q=80&w=600";
    case "Chụp ảnh":
      return "https://images.unsplash.com/photo-1537907690979-ee8e01276184?q=80&w=600";
    default:
      return "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600";
  }
};

const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");

  // Interaction States (Client-side persistence for UX demonstration)
  const [likedPosts, setLikedPosts] = useState(() => {
    const saved = localStorage.getItem("blog_likes");
    return saved ? JSON.parse(saved) : [];
  });
  const [bookmarkedPosts, setBookmarkedPosts] = useState(() => {
    const saved = localStorage.getItem("blog_bookmarks");
    return saved ? JSON.parse(saved) : [];
  });

  // Admin states
  const [title, setTitle] = useState("");
  const [fbUrl, setFbUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  // Check if current user is Admin
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");
  const isAdmin = user && user.role === "admin" && token;

  const categories = ["Tất cả", "Kinh nghiệm cưới", "Nhà hàng", "Trang điểm", "Trang phục", "Chụp ảnh"];

  // Save likes & bookmarks to localStorage
  useEffect(() => {
    localStorage.setItem("blog_likes", JSON.stringify(likedPosts));
  }, [likedPosts]);

  useEffect(() => {
    localStorage.setItem("blog_bookmarks", JSON.stringify(bookmarkedPosts));
  }, [bookmarkedPosts]);

  // Fetch blog posts
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/blogs`);
      const data = await res.json();
      if (res.ok) {
        setPosts(data);
      } else {
        setError(data.message || "Không thể tải bài viết.");
      }
    } catch (err) {
      setError("Lỗi kết nối máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Handle Admin form submission
  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!title.trim() || !fbUrl.trim()) {
      alert("Vui lòng điền đầy đủ tiêu đề và link bài viết!");
      return;
    }

    let cleanUrl = fbUrl.trim();
    if (cleanUrl.startsWith("<iframe") || cleanUrl.includes("src=")) {
      try {
        const srcMatch = cleanUrl.match(/src="([^"]+)"/);
        if (srcMatch && srcMatch[1]) {
          const srcUrl = srcMatch[1];
          const urlObj = new URL(srcUrl);
          const hrefParam = urlObj.searchParams.get("href");
          if (hrefParam) {
            cleanUrl = hrefParam;
          }
        }
      } catch (err) {}
    }

    try {
      setSubmitting(true);
      setSuccessMsg("");
      setError("");

      const res = await fetch(`${API_URL}/api/blogs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          type: "facebook",
          facebookUrl: cleanUrl,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMsg("Đăng bài viết thành công!");
        setTitle("");
        setFbUrl("");
        // Prepend to posts list
        setPosts((prev) => [data, ...prev]);
        setShowAdminPanel(false);
      } else {
        setError(data.message || "Không thể tạo bài viết.");
      }
    } catch (err) {
      setError("Lỗi kết nối máy chủ.");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete post
  const handleDeletePost = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bài viết này không?")) return;

    try {
      const res = await fetch(`${API_URL}/api/blogs/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setPosts((prev) => prev.filter((post) => post._id !== id));
      } else {
        alert("Xóa bài viết thất bại.");
      }
    } catch (err) {
      alert("Lỗi kết nối máy chủ.");
    }
  };

  // Toggle Likes and Bookmarks
  const toggleLike = (id) => {
    setLikedPosts((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleBookmark = (id) => {
    setBookmarkedPosts((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Filter posts on client side
  const filteredPosts = posts.filter((post) => {
    const category = getCategoryFromTitle(post.title);
    const matchesCategory =
      selectedCategory === "Tất cả" || category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.author && post.author.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Featured post is the latest post overall
  const featuredPost = posts.length > 0 ? posts[0] : null;
  // Latest articles are the ones remaining after matching filters
  const latestPosts = filteredPosts;

  // Mock trending tags for sidebar
  const trendingTags = ["RusticiWedding", "TiệcNgoàiTrời", "MakeupCôDâu", "VáyCướiĐẹp", "KếHoạchCưới"];

  // Mock popular posts (first 3 posts)
  const popularPosts = posts.slice(0, 3);

  const handleShare = (post) => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(post.facebookUrl || window.location.href);
      alert("Đã sao chép liên kết chia sẻ!");
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <SharedHeader />

      <main className={styles.mainContainer}>
        {/* Modern Hero Section */}
        <section className={styles.heroSection}>
          <div className={styles.heroGlow} />
          <div className={styles.heroContent}>
            <span className={styles.heroBadge}>CẨM NANG & XU HƯỚNG CƯỚI</span>
            <h1 className={styles.heroTitle}>AN WEDDING BLOG</h1>
            <p className={styles.heroSubtitle}>
              Nơi chia sẻ cảm hứng ngọt ngào, cẩm nang chuẩn bị cưới chi tiết và xu hướng cưới sang trọng mới nhất.
            </p>

            {/* Instant Search Bar */}
            <div className={styles.searchWrapper}>
              <span className={styles.searchIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </span>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Tìm kiếm bài viết, xu hướng, kinh nghiệm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Featured Article Section (Highlighting latest post) */}
        {featuredPost && !searchQuery && selectedCategory === "Tất cả" && (
          <section className={styles.featuredSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Bài viết nổi bật</h2>
              <div className={styles.sectionLine} />
            </div>

            <div className={styles.featuredCard}>
              <div className={styles.featuredImageWrapper}>
                <img 
                  src={getCategoryImageUrl(getCategoryFromTitle(featuredPost.title))} 
                  alt={featuredPost.title} 
                  className={styles.featuredCover}
                />
                <span className={styles.categoryTag}>
                  {getCategoryFromTitle(featuredPost.title)}
                </span>
              </div>
              <div className={styles.featuredInfo}>
                <div className={styles.featuredMeta}>
                  <img src="/LOGO.svg" alt="Avatar" className={styles.metaAvatar} />
                  <div>
                    <span className={styles.metaAuthor}>{featuredPost.author || "AN Wedding"}</span>
                    <span className={styles.metaDot}>•</span>
                    <span className={styles.metaDate}>
                      {new Date(featuredPost.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                </div>
                <h3 className={styles.featuredTitle}>{featuredPost.title}</h3>
                <p className={styles.featuredExcerpt}>
                  Cập nhật các hình ảnh thực tế, chia sẻ và cẩm nang cưới hữu ích từ sự kiện. Theo dõi trực tiếp qua liên kết đính kèm dưới đây để tương tác cùng AN Wedding.
                </p>

                <div className={styles.featuredFooter}>
                  <a 
                    href="#feed" 
                    className={styles.readFeaturedBtn}
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById("feed")?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    Xem bài viết bên dưới 
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <polyline points="19 12 12 19 5 12"></polyline>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Category Filter Chips */}
        <section className={styles.categoriesSection}>
          <div className={styles.chipsScroll}>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`${styles.categoryChip} ${selectedCategory === cat ? styles.categoryChipActive : ""}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Admin Toggle Button */}
          {isAdmin && (
            <button 
              className={styles.adminToggleBtn} 
              onClick={() => setShowAdminPanel(!showAdminPanel)}
            >
              {showAdminPanel ? "✕ Đóng công cụ" : "➕ Viết bài mới"}
            </button>
          )}
        </section>

        {/* Admin Overlay Form */}
        {isAdmin && showAdminPanel && (
          <section className={styles.adminSection}>
            <div className={styles.adminCard}>
              <div className={styles.adminHeader}>
                <span className={styles.adminBadge}>ADMIN PANEL</span>
                <h3>Đăng Bài Blog Facebook Mới</h3>
              </div>
              
              <form onSubmit={handleCreatePost} className={styles.adminForm}>
                <div className={styles.formGroup}>
                  <label htmlFor="title">Tiêu đề bài đăng hiển thị trên Web</label>
                  <input
                    id="title"
                    type="text"
                    placeholder="Ví dụ: Xu hướng trang trí tiệc cưới ngoài trời 2026..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="fbUrl">Đường dẫn (URL) bài viết hoặc mã nhúng iframe</label>
                  <input
                    id="fbUrl"
                    type="text"
                    placeholder="Dán link bài viết facebook hoặc thẻ <iframe>..."
                    value={fbUrl}
                    onChange={(e) => setFbUrl(e.target.value)}
                    required
                  />
                </div>

                <div className={styles.adminActions}>
                  <button type="button" className={styles.cancelBtn} onClick={() => setShowAdminPanel(false)}>
                    Hủy
                  </button>
                  <button type="submit" className={styles.submitBtn} disabled={submitting}>
                    {submitting ? "Đang xử lý..." : "Đăng bài ngay"}
                  </button>
                </div>
              </form>

              {successMsg && <p className={styles.successMessage}>✓ {successMsg}</p>}
              {error && <p className={styles.errorMessage}>✗ {error}</p>}
            </div>
          </section>
        )}

        {/* Two-Column Blog Grid (Timeline Feed & Sidebar) */}
        <section id="feed" className={styles.twoColumnGrid}>
          {/* Left Column: Feed Timeline */}
          <div className={styles.feedTimeline}>
            <h2 className={styles.sectionTitleSmall}>
              {searchQuery || selectedCategory !== "Tất cả" ? "Kết quả tìm kiếm" : "Bài viết mới nhất"}
            </h2>
            
            {loading ? (
              <div className={styles.loadingContainer}>
                <div className={styles.spinner} />
                <p>Đang tải danh sách bài viết...</p>
              </div>
            ) : error && posts.length === 0 ? (
              <div className={styles.errorContainer}>
                <span className={styles.errorIcon}>⚠</span>
                <p>{error}</p>
                <button className={styles.retryBtn} onClick={fetchPosts}>Thử lại</button>
              </div>
            ) : latestPosts.length === 0 ? (
              <div className={styles.emptyContainer}>
                <span className={styles.emptyIcon}>📰</span>
                <h3>Không tìm thấy bài viết nào</h3>
                <p>Thử tìm kiếm với từ khóa khác hoặc thay đổi bộ lọc danh mục.</p>
              </div>
            ) : (
              latestPosts.map((post) => {
                const category = getCategoryFromTitle(post.title);
                const isLiked = likedPosts.includes(post._id);
                const isBookmarked = bookmarkedPosts.includes(post._id);
                
                return (
                  <article key={post._id} className={styles.blogCard}>
                    <div className={styles.cardHeader}>
                      <div className={styles.authorMeta}>
                        <img 
                          src="/LOGO.svg" 
                          alt="AN Wedding Logo" 
                          className={styles.authorAvatar} 
                        />
                        <div>
                          <h4 className={styles.authorName}>{post.author || "AN Wedding"}</h4>
                          <span className={styles.postDate}>
                            {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                          </span>
                        </div>
                      </div>

                      <div className={styles.actionHeaderBtns}>
                        {/* Bookmark Button */}
                        <button 
                          className={`${styles.iconBtn} ${isBookmarked ? styles.iconBtnActive : ""}`} 
                          onClick={() => toggleBookmark(post._id)}
                          title="Lưu bài viết"
                        >
                          <svg viewBox="0 0 24 24" fill={isBookmarked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" width="18" height="18">
                            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                          </svg>
                        </button>
                        
                        {/* Admin Delete Button */}
                        {isAdmin && (
                          <button 
                            className={styles.deleteBtn}
                            onClick={() => handleDeletePost(post._id)}
                            title="Xóa bài viết"
                          >
                            ✕ Xóa
                          </button>
                        )}
                      </div>
                    </div>

                    <h3 className={styles.postTitle}>{post.title}</h3>
                    
                    {/* Visual Card Cover Preview */}
                    <div className={styles.cardCoverWrapper}>
                      <img 
                        src={getCategoryImageUrl(category)} 
                        alt="Blog Cover" 
                        className={styles.cardCover} 
                      />
                      <span className={styles.cardCategoryBadge}>{category}</span>
                    </div>

                    {/* Facebook Embed Container */}
                    <div className={styles.embedContainer}>
                      <iframe 
                        src={`https://www.facebook.com/plugins/post.php?href=${encodeURIComponent(post.facebookUrl)}&show_text=true&width=500`}
                        width="500" 
                        height="600" 
                        className={styles.embedIframe}
                        scrolling="no" 
                        frameBorder="0" 
                        allowFullScreen={true}
                        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                        title={post.title}
                      ></iframe>
                    </div>

                    {/* Fallback Direct Link & Actions */}
                    <div className={styles.cardFooter}>
                      <div className={styles.fallbackLink}>
                        <a href={post.facebookUrl} target="_blank" rel="noopener noreferrer">
                          ☞ Xem trên Facebook
                        </a>
                      </div>

                      <div className={styles.cardStats}>
                        <button 
                          className={`${styles.statBtn} ${isLiked ? styles.statBtnLiked : ""}`}
                          onClick={() => toggleLike(post._id)}
                        >
                          <svg viewBox="0 0 24 24" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" width="16" height="16">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                          </svg>
                          <span>{isLiked ? 27 : 26}</span>
                        </button>
                        
                        <button className={styles.statBtn} onClick={() => handleShare(post)}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                            <circle cx="18" cy="5" r="3"></circle>
                            <circle cx="6" cy="12" r="3"></circle>
                            <circle cx="18" cy="19" r="3"></circle>
                            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                          </svg>
                          <span>Chia sẻ</span>
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>

          {/* Right Column: Sticky Sidebar */}
          <aside className={styles.sidebar}>
            {/* Newsletter Subscription Box */}
            <div className={styles.sidebarCard}>
              <h4 className={styles.sidebarCardTitle}>Nhận Cẩm Nang Cưới</h4>
              <p className={styles.sidebarCardText}>
                Đăng ký nhận bản tin định kỳ về cẩm nang và những ưu đãi độc quyền từ các đối tác của AN Wedding.
              </p>
              <form className={styles.newsletterForm} onSubmit={(e) => {
                e.preventDefault();
                alert("Đăng ký nhận cẩm nang thành công!");
                e.target.reset();
              }}>
                <input
                  type="email"
                  placeholder="Nhập email của bạn..."
                  className={styles.sidebarInput}
                  required
                />
                <button type="submit" className={styles.subscribeBtn}>
                  Đăng ký ngay
                </button>
              </form>
            </div>

            {/* Popular Posts */}
            {popularPosts.length > 0 && (
              <div className={styles.sidebarCard}>
                <h4 className={styles.sidebarCardTitle}>Bài viết được quan tâm</h4>
                <div className={styles.popularList}>
                  {popularPosts.map((pop, idx) => (
                    <div key={pop._id} className={styles.popularItem}>
                      <span className={styles.popularNumber}>0{idx + 1}</span>
                      <div className={styles.popularInfo}>
                        <h5 className={styles.popularTitle}>
                          <a 
                            href="#feed" 
                            onClick={(e) => {
                              e.preventDefault();
                              setSearchQuery(pop.title);
                            }}
                          >
                            {pop.title}
                          </a>
                        </h5>
                        <span className={styles.popularMeta}>
                          {getCategoryFromTitle(pop.title)} • 1.2k lượt xem
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trending Tags */}
            <div className={styles.sidebarCard}>
              <h4 className={styles.sidebarCardTitle}>Chủ đề thịnh hành</h4>
              <div className={styles.tagsContainer}>
                {trendingTags.map((tag) => (
                  <span 
                    key={tag} 
                    className={styles.tagChip}
                    onClick={() => setSearchQuery(tag.replace("Wedding", ""))}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Contact & Social */}
            <div className={styles.sidebarCard}>
              <h4 className={styles.sidebarCardTitle}>Kết nối với chúng tôi</h4>
              <p className={styles.sidebarCardText}>
                Theo dõi các buổi livestream chia sẻ trực tiếp và các ưu đãi tiệc cưới mới nhất.
              </p>
              <div className={styles.socialRow}>
                <a href="https://www.facebook.com/anwedding26" target="_blank" rel="noopener noreferrer" className={styles.socialCircle}>
                  Facebook
                </a>
                <a href="https://www.tiktok.com/@anwedding26" target="_blank" rel="noopener noreferrer" className={styles.socialCircle}>
                  TikTok
                </a>
              </div>
            </div>
          </aside>
        </section>
      </main>

      <Footer1 />
    </div>
  );
};

export default BlogPage;
