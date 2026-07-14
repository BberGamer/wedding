import styles from "./SocialFloatingWidget.module.css";

const SocialFloatingWidget = () => {
  return (
    <div className={styles.socialFloatingWrapper}>
      {/* Facebook FAB */}
      <a
        href="https://www.facebook.com/anwedding26"
        target="_blank"
        rel="noopener noreferrer"
        className={`${styles.socialFabBtn} ${styles.facebookBtn}`}
        aria-label="Liên hệ Facebook AN Wedding"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26">
          <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
        </svg>
      </a>

      {/* TikTok FAB */}
      <a
        href="https://www.tiktok.com/@anwedding26"
        target="_blank"
        rel="noopener noreferrer"
        className={`${styles.socialFabBtn} ${styles.tiktokBtn}`}
        aria-label="Liên hệ TikTok AN Wedding"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .8.11v-3.5a6.93 6.93 0 0 0-1.9-.26 6.34 6.34 0 0 0-6.38 6.38 6.27 6.27 0 0 0 6.27 6.26 6.35 6.35 0 0 0 6.26-6.27V8.16A8.29 8.29 0 0 0 20 9.87V6.69z"/>
        </svg>
      </a>
    </div>
  );
};

export default SocialFloatingWidget;
