import { applyRetinaImage } from "../utils/retina-images.js";

/**
 * Картка товару: variant="featured" (bestsellers) | "compact" (сітка products).
 * Атрибути: name, description, details (розширений текст для модалки), price, src, alt, width, height.
 */
const TEMPLATE_ID = "flora-product-card-template";
const FEATURED_SIZES =
  "(min-width: 1024px) calc((100vw - 3rem) / 3), (min-width: 768px) calc((100vw - 1.5rem) / 2), 100vw";
const COMPACT_SIZES =
  "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw";

const VARIANT_CONFIG = {
  featured: {
    imgClass:
      "aspect-[405/304] h-auto w-full max-w-full rounded-2xl object-cover",
    bodyClass: "flex flex-col gap-2",
    sizes: FEATURED_SIZES,
    defaultWidth: "405",
    defaultHeight: "304",
  },
  compact: {
    imgClass: "h-[220px] min-w-64 w-full rounded-2xl object-cover md:h-[296px]",
    bodyClass: "flex flex-col gap-2 text-center",
    sizes: COMPACT_SIZES,
    defaultWidth: "296",
    defaultHeight: null,
  },
};

let cachedTemplate = null;

function getTemplate() {
  if (cachedTemplate) {
    return cachedTemplate;
  }

  const template = document.getElementById(TEMPLATE_ID);
  if (!(template instanceof HTMLTemplateElement)) {
    throw new Error(`Template #${TEMPLATE_ID} not found`);
  }
  cachedTemplate = template;
  return cachedTemplate;
}

class FloraProductCard extends HTMLElement {
  #nodes = null;

  static get observedAttributes() {
    return [
      "variant",
      "name",
      "description",
      "details",
      "price",
      "src",
      "alt",
      "width",
      "height",
    ];
  }

  connectedCallback() {
    if (!this.#nodes) {
      this.mount();
    }
    this.update();
    this.setAttribute("role", "button");
    this.setAttribute("tabindex", "0");
    this.addEventListener("click", this.#onActivate);
    this.addEventListener("keydown", this.#onKeydown);
  }

  disconnectedCallback() {
    this.removeEventListener("click", this.#onActivate);
    this.removeEventListener("keydown", this.#onKeydown);
  }

  #onActivate = () => {
    this.dispatchEvent(
      new CustomEvent("flora-product-open", {
        bubbles: true,
        detail: this.getProductData(),
      }),
    );
  };

  #onKeydown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      this.#onActivate();
    }
  };

  getProductData() {
    const name = this.getAttribute("name") ?? "";
    return {
      name,
      description: this.getAttribute("description") ?? "",
      details: this.getAttribute("details") ?? "",
      price: this.getAttribute("price") ?? "",
      src: this.getAttribute("src") ?? "",
      alt: this.getAttribute("alt") ?? name,
    };
  }

  attributeChangedCallback() {
    if (this.isConnected && this.#nodes) {
      this.update();
    }
  }

  mount() {
    this.classList.add(
      "block",
      "w-full",
      "min-w-0",
      "cursor-pointer",
      "rounded-2xl",
      "transition-opacity",
      "hover:opacity-80",
      "focus-visible:outline-2",
      "focus-visible:outline-offset-2",
      "focus-visible:outline-barberry",
    );

    const template = getTemplate();
    const root = template.content.cloneNode(true);

    const img = root.querySelector('[data-role="image"]');
    const body = root.querySelector('[data-role="body"]');
    const titleEl = root.querySelector('[data-role="title"]');
    const descEl = root.querySelector('[data-role="description"]');
    const priceEl = root.querySelector('[data-role="price"]');

    if (!img || !body || !titleEl || !descEl || !priceEl) {
      throw new Error("Product card template has missing required nodes");
    }

    this.#nodes = { img, body, titleEl, descEl, priceEl };
    this.replaceChildren(root);
  }

  update() {
    const variant = this.getAttribute("variant") ?? "compact";
    const config = VARIANT_CONFIG[variant] ?? VARIANT_CONFIG.compact;

    const name = this.getAttribute("name") ?? "";
    const description = this.getAttribute("description") ?? "";
    const price = this.getAttribute("price") ?? "";
    const src = this.getAttribute("src") ?? "";
    const alt = this.getAttribute("alt") ?? name;

    const imgWidth = this.getAttribute("width") ?? config.defaultWidth;
    const imgHeightAttr = this.getAttribute("height");

    const { img, body, titleEl, descEl, priceEl } = this.#nodes;

    applyRetinaImage(img, src, { sizes: config.sizes, alt });
    img.width = Number(imgWidth);
    if (config.defaultHeight) {
      img.height = Number(imgHeightAttr ?? config.defaultHeight);
    } else {
      img.removeAttribute("height");
    }
    img.className = config.imgClass;

    body.className = config.bodyClass;
    titleEl.textContent = name;
    descEl.textContent = description;
    priceEl.textContent = price;
  }
}

customElements.define("flora-product-card", FloraProductCard);
