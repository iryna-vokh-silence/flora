/**
 * Картка товару: variant="featured" (bestsellers) | "compact" (сітка products).
 * Атрибути: name, description, price, src, alt, width, height (featured: ratio 405×304 за замовчуванням).
 */
function buildRetinaSrcset(src) {
  // Keep layout stable even if dedicated @2x assets are absent.
  return `${src} 1x, ${src} 2x`;
}

class FloraProductCard extends HTMLElement {
  connectedCallback() {
    const variant = this.getAttribute("variant") ?? "compact";
    const name = this.getAttribute("name") ?? "";
    const description = this.getAttribute("description") ?? "";
    const price = this.getAttribute("price") ?? "";
    const src = this.getAttribute("src") ?? "";
    const alt = this.getAttribute("alt") ?? name;
    const imgWidth =
      this.getAttribute("width") ?? (variant === "featured" ? "405" : "296");
    const imgHeightAttr = this.getAttribute("height");

    const imgClass =
      variant === "featured"
        ? "aspect-[405/304] h-auto w-full max-w-full rounded-2xl object-cover"
        : "h-[220px] w-full rounded-2xl object-cover md:h-[296px]";

    const bodyClass =
      variant === "featured"
        ? "flex flex-col gap-2"
        : "flex flex-col gap-2 text-center";

    this.classList.add("block", "w-full", "min-w-0");

    const root = document
      .getElementById("flora-product-card")
      .content.cloneNode(true);

    const img = root.querySelector("img");
    img.src = src;
    img.srcset = buildRetinaSrcset(src);
    img.sizes = variant === "featured"
      ? "(min-width: 1024px) calc((100vw - 3rem) / 3), (min-width: 768px) calc((100vw - 1.5rem) / 2), 100vw"
      : "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw";
    img.alt = alt;
    img.width = Number(imgWidth);
    if (variant === "featured") {
      img.height = Number(imgHeightAttr ?? "304");
    }
    img.className = imgClass;

    const body = root.querySelector(".product-card__body");
    body.className = bodyClass;

    const [titleEl, descEl, priceEl] = body.querySelectorAll(
      "h3, p.text-sm, p.text-xl",
    );
    titleEl.textContent = name;
    descEl.textContent = description;
    priceEl.textContent = price;

    this.replaceChildren(root);
  }
}

customElements.define("flora-product-card", FloraProductCard);
