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
    // .line があれば行ごとに、なければ全体を一文字ずつ分解
    const lines = catchEl.querySelectorAll(".line");
    const targets = lines.length ? [...lines] : [catchEl];
    let i = 0;
    targets.forEach((el) => {
      const text = el.textContent.trim();
      el.textContent = "";
      [...text].forEach((ch) => {
        const span = document.createElement("span");
        span.className = "char";
        span.textContent = ch;
        span.style.animationDelay = `${0.35 + i * 0.14}s`;
        el.appendChild(span);
        i++;
      });
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

  // --- 貸切風呂スライド ---
  document.querySelectorAll(".bath-cards").forEach((slider) => {
    const cards = [...slider.querySelectorAll(".bath-card")];
    if (cards.length <= 1) return;

    let current = 0;
    const frame = document.createElement("div");
    frame.className = "bath-slider";
    slider.insertAdjacentElement("beforebegin", frame);
    frame.appendChild(slider);

    const controls = document.createElement("div");
    controls.className = "bath-controls";

    const prev = document.createElement("button");
    prev.className = "bath-control";
    prev.type = "button";
    prev.setAttribute("aria-label", "前の温泉を見る");
    prev.textContent = "‹";

    const next = document.createElement("button");
    next.className = "bath-control";
    next.type = "button";
    next.setAttribute("aria-label", "次の温泉を見る");
    next.textContent = "›";

    controls.append(prev, next);
    frame.appendChild(controls);

    const update = () => {
      const gap = parseFloat(getComputedStyle(slider).columnGap) || 0;
      const offset = current * (slider.clientWidth + gap);
      cards.forEach((card) => {
        card.style.transform = `translateX(${-offset}px)`;
      });
    };

    prev.addEventListener("click", () => {
      current = (current - 1 + cards.length) % cards.length;
      update();
    });

    next.addEventListener("click", () => {
      current = (current + 1) % cards.length;
      update();
    });

    window.addEventListener("resize", update, { passive: true });
    update();
  });
});
