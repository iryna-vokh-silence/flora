/**
 * Картка товару: variant="featured" (bestsellers) | "compact" (сітка products).
 * Атрибути: name, description, price, src, alt, width, height (featured: ratio 405×304 за замовчуванням).
 */
const TEMPLATE_ID = 'flora-product-card-template';
const FEATURED_SIZES =
  '(min-width: 1024px) calc((100vw - 3rem) / 3), (min-width: 768px) calc((100vw - 1.5rem) / 2), 100vw';
const COMPACT_SIZES = '(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw';

const VARIANT_CONFIG = {
  featured: {
    imgClass: 'aspect-[405/304] h-auto w-full max-w-full rounded-2xl object-cover',
    bodyClass: 'flex flex-col gap-2',
    sizes: FEATURED_SIZES,
    defaultWidth: '405',
    defaultHeight: '304',
  },
  compact: {
    imgClass: 'h-[220px] min-w-64 w-full rounded-2xl object-cover md:h-[296px]',
    bodyClass: 'flex flex-col gap-2 text-center',
    sizes: COMPACT_SIZES,
    defaultWidth: '296',
    defaultHeight: null,
  },
};

let cachedTemplate = null;

function buildRetinaSrcset(src) {
  return `${src} 1x, ${src} 2x`;
}

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
    return ['variant', 'name', 'description', 'price', 'src', 'alt', 'width', 'height'];
  }

  connectedCallback() {
    if (!this.#nodes) {
      this.mount();
    }
    this.update();
  }

  attributeChangedCallback() {
    if (this.isConnected && this.#nodes) {
      this.update();
    }
  }

  mount() {
    this.classList.add('block', 'w-full', 'min-w-0');

    const template = getTemplate();
    const root = template.content.cloneNode(true);

    const img = root.querySelector('[data-role="image"]');
    const body = root.querySelector('[data-role="body"]');
    const titleEl = root.querySelector('[data-role="title"]');
    const descEl = root.querySelector('[data-role="description"]');
    const priceEl = root.querySelector('[data-role="price"]');

    if (!img || !body || !titleEl || !descEl || !priceEl) {
      throw new Error('Product card template has missing required nodes');
    }

    this.#nodes = { img, body, titleEl, descEl, priceEl };
    this.replaceChildren(root);
  }

  update() {
    const variant = this.getAttribute('variant') ?? 'compact';
    const config = VARIANT_CONFIG[variant] ?? VARIANT_CONFIG.compact;

    const name = this.getAttribute('name') ?? '';
    const description = this.getAttribute('description') ?? '';
    const price = this.getAttribute('price') ?? '';
    const src = this.getAttribute('src') ?? '';
    const alt = this.getAttribute('alt') ?? name;

    const imgWidth = this.getAttribute('width') ?? config.defaultWidth;
    const imgHeightAttr = this.getAttribute('height');

    const { img, body, titleEl, descEl, priceEl } = this.#nodes;

    img.src = src;
    img.srcset = buildRetinaSrcset(src);
    img.sizes = config.sizes;
    img.alt = alt;
    img.width = Number(imgWidth);
    if (config.defaultHeight) {
      img.height = Number(imgHeightAttr ?? config.defaultHeight);
    } else {
      img.removeAttribute('height');
    }
    img.className = config.imgClass;

    body.className = config.bodyClass;
    titleEl.textContent = name;
    descEl.textContent = description;
    priceEl.textContent = price;
  }
}

customElements.define('flora-product-card', FloraProductCard);
