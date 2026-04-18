/**
 * Карусель: горизонтальний скрол, опційні крапки (сторінки),
 * опційно data-carousel-loop — циклічні стрілки без кінців.
 */
function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getSlideElements(track) {
  return Array.from(track.children).filter(
    (el) => el.nodeType === Node.ELEMENT_NODE && el.tagName === "LI",
  );
}

function initCarousel(root) {
  const viewport = root.querySelector("[data-carousel-viewport]");
  const track = root.querySelector("[data-carousel-track]");
  const prevBtn = root.querySelector("[data-carousel-prev]");
  const nextBtn = root.querySelector("[data-carousel-next]");
  const dotsContainer = root.querySelector("[data-carousel-dots]");
  const loop = root.hasAttribute("data-carousel-loop");

  if (!viewport || !track) {
    return;
  }

  const slides = () => getSlideElements(track);
  const hasDots = Boolean(dotsContainer);

  function slidesPerView() {
    const list = slides();
    const n = list.length;
    if (!n) {
      return 1;
    }
    if (viewport.scrollWidth <= viewport.clientWidth + 2) {
      return n;
    }
    const first = list[0].getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    const step = first + gap;
    if (step <= 0) {
      return 1;
    }
    const vpW = viewport.clientWidth;
    const v = Math.floor((vpW + gap) / step);
    return Math.max(1, Math.min(n, v));
  }

  function pageCount() {
    const n = slides().length;
    if (!n) {
      return 0;
    }
    const v = slidesPerView();
    return Math.max(1, n - v + 1);
  }

  function activeLeadingIndex() {
    const list = slides();
    if (!list.length) {
      return 0;
    }
    const vLeft = viewport.getBoundingClientRect().left;
    let best = 0;
    let bestD = Infinity;
    list.forEach((el, i) => {
      const d = Math.abs(el.getBoundingClientRect().left - vLeft);
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    });
    return best;
  }

  function activePageIndex() {
    const n = slides().length;
    if (!n) {
      return 0;
    }
    const v = slidesPerView();
    const maxPage = Math.max(0, n - v);
    return Math.min(activeLeadingIndex(), maxPage);
  }

  function scrollToIndex(i) {
    const list = slides();
    if (!list.length) {
      return;
    }
    const clamped = Math.max(0, Math.min(list.length - 1, i));
    const el = list[clamped];
    const rect = el.getBoundingClientRect();
    const vrect = viewport.getBoundingClientRect();
    const delta = rect.left - vrect.left;
    const behavior = prefersReducedMotion() ? "auto" : "smooth";
    viewport.scrollTo({ left: viewport.scrollLeft + delta, behavior });
  }

  function updateDots() {
    if (!hasDots) {
      updateButtons();
      return;
    }
    const pages = pageCount();
    const pageIdx = activePageIndex();
    dotsContainer.querySelectorAll("[data-carousel-dot]").forEach((dot, i) => {
      const on = i === pageIdx;
      if (on) {
        dot.setAttribute("aria-current", "true");
      } else {
        dot.removeAttribute("aria-current");
      }
      dot.classList.toggle("bg-foreground", on);
      dot.classList.toggle("bg-foreground/20", !on);
    });
    updateButtons();
  }

  function updateButtons() {
    const n = slides().length;
    if (loop) {
      const disabled = n <= 1;
      if (prevBtn) {
        prevBtn.disabled = disabled;
      }
      if (nextBtn) {
        nextBtn.disabled = disabled;
      }
      return;
    }
    const pages = pageCount();
    const pageIdx = activePageIndex();
    if (prevBtn) {
      prevBtn.disabled = pages <= 1 || pageIdx <= 0;
    }
    if (nextBtn) {
      nextBtn.disabled = pages <= 1 || pageIdx >= pages - 1;
    }
  }

  function buildDots() {
    if (!hasDots) {
      return;
    }
    dotsContainer.replaceChildren();
    const wrapInLi = dotsContainer.tagName === "UL";
    const pages = pageCount();
    for (let p = 0; p < pages; p++) {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.dataset.carouselDot = "";
      dot.className =
        "size-2 shrink-0 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-barberry";
      dot.setAttribute("aria-label", `Page ${p + 1}`);
      dot.addEventListener("click", () => scrollToIndex(p));
      if (wrapInLi) {
        const item = document.createElement("li");
        item.className = "list-none";
        item.append(dot);
        dotsContainer.append(item);
      } else {
        dotsContainer.append(dot);
      }
    }
    updateDots();
  }

  function ensureDotsMatchPages() {
    if (!hasDots) {
      return;
    }
    const expected = pageCount();
    const actual = dotsContainer.querySelectorAll("[data-carousel-dot]").length;
    if (expected !== actual) {
      buildDots();
    }
  }

  function goPrev() {
    const n = slides().length;
    if (n <= 1) {
      return;
    }
    const lead = activeLeadingIndex();
    if (loop) {
      const maxLead = Math.max(0, n - slidesPerView());
      const target = lead <= 0 ? maxLead : lead - 1;
      scrollToIndex(target);
    } else {
      scrollToIndex(lead - 1);
    }
  }

  function goNext() {
    const n = slides().length;
    if (n <= 1) {
      return;
    }
    const lead = activeLeadingIndex();
    if (loop) {
      const maxLead = Math.max(0, n - slidesPerView());
      const target = lead >= maxLead ? 0 : lead + 1;
      scrollToIndex(target);
    } else {
      scrollToIndex(lead + 1);
    }
  }

  prevBtn?.addEventListener("click", goPrev);
  nextBtn?.addEventListener("click", goNext);

  viewport.addEventListener("scroll", () => updateDots(), { passive: true });
  window.addEventListener("resize", () => {
    ensureDotsMatchPages();
    updateDots();
  });

  const ro = new ResizeObserver(() => {
    ensureDotsMatchPages();
    updateDots();
  });
  ro.observe(viewport);

  const mo = new MutationObserver(() => {
    ensureDotsMatchPages();
    updateDots();
  });
  mo.observe(track, { childList: true });

  buildDots();
  requestAnimationFrame(() => {
    ensureDotsMatchPages();
    updateDots();
  });
  window.addEventListener("load", () => {
    ensureDotsMatchPages();
    updateDots();
  });
}

document.querySelectorAll("[data-section-carousel]").forEach((root) => {
  initCarousel(root);
});
