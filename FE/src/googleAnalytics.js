export const GA_MEASUREMENT_ID = "G-V60QLRRXNK";

export function trackPageView(path, title) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  window.gtag("config", GA_MEASUREMENT_ID, {
    page_path: path,
    page_title: title,
    page_location: window.location.href
  });
}
