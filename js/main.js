// ============================================
// 末広屋旅館 共通スクリプト
// ・スクロール連動フェードイン (IntersectionObserver)
// ・ヒーロー縦書きコピーの一文字ずつ表示
// ・ヘッダー背景の切り替え / モバイルナビ
// ============================================

document.addEventListener("DOMContentLoaded", () => {
  // --- ヒーローキャッチコピーを一文字ずつ span に分解 ---
  const catchEl = document.querySelector(".hero-catch");
  if (catchEl) {
    const text = catchEl.textContent.trim();
    catchEl.textContent = "";
    [...text].forEach((ch, i) => {
      const span = document.createElement("span");
      span.className = "char";
      span.textContent = ch;
      span.style.animationDelay = `${0.35 + i * 0.14}s`;
      catchEl.appendChild(span);
    });
  }

  // --- スクロール連動フェードイン ---
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
  );

  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

  // --- ヘッダー背景切り替え ---
  const header = document.querySelector(".site-header");
  const onScroll = () => {
    // .solid 付きのヘッダー（下層ページ）は常に背景あり
    if (header.classList.contains("solid")) return;
    header.classList.toggle("scrolled", window.scrollY > 60);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // --- モバイルナビ ---
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".global-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      document.body.classList.toggle("nav-open", open);
      toggle.setAttribute("aria-expanded", open);
    });
    nav.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        nav.classList.remove("open");
        document.body.classList.remove("nav-open");
      })
    );
  }
});
