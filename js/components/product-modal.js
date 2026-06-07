import { applyRetinaImage } from "../utils/retina-images.js";

class FloraProductModal extends HTMLElement {
  #nodes = null;
  #onProductOpen = null;
  #onKeydown = null;
  #onOverlayClick = null;
  #onPanelClick = null;

  connectedCallback() {
    if (!this.#nodes) {
      this.mount();
    }

    this.#onProductOpen = (event) => {
      this.open(event.detail);
    };
    this.#onKeydown = (event) => {
      if (event.key === "Escape") {
        this.close();
      }
    };
    this.#onOverlayClick = (event) => {
      if (event.target === this) {
        this.close();
      }
    };
    this.#onPanelClick = (event) => {
      event.stopPropagation();
    };

    document.addEventListener("flora-product-open", this.#onProductOpen);
    this.addEventListener("click", this.#onOverlayClick);
    this.#nodes.panel.addEventListener("click", this.#onPanelClick);
    this.#nodes.closeBtn.addEventListener("click", () => this.close());
    this.#nodes.buyBtn.addEventListener("click", () => this.onBuyNow());
  }

  disconnectedCallback() {
    document.removeEventListener("flora-product-open", this.#onProductOpen);
    document.removeEventListener("keydown", this.#onKeydown);
  }

  mount() {
    const img = this.querySelector('[data-role="image"]');
    const panel = this.querySelector('[data-role="panel"]');
    const titleEl = this.querySelector('[data-role="title"]');
    const priceEl = this.querySelector('[data-role="price"]');
    const descriptionEl = this.querySelector('[data-role="description"]');
    const quantityEl = this.querySelector('[data-role="quantity"]');
    const buyBtn = this.querySelector('[data-role="buy"]');
    const closeBtn = this.querySelector("[data-modal-close]");

    if (
      !img ||
      !panel ||
      !titleEl ||
      !priceEl ||
      !descriptionEl ||
      !quantityEl ||
      !buyBtn ||
      !closeBtn
    ) {
      throw new Error("Product modal has missing required nodes");
    }

    this.#nodes = {
      img,
      panel,
      titleEl,
      priceEl,
      descriptionEl,
      quantityEl,
      buyBtn,
      closeBtn,
    };
  }

  #currentProduct = null;

  open(product) {
    this.#currentProduct = product;
    const { img, titleEl, priceEl, descriptionEl, quantityEl } = this.#nodes;
    const src = product.src ?? "";
    const alt = product.alt ?? product.name ?? "";
    const details = product.details || product.description || "";

    applyRetinaImage(img, src, {
      sizes: "(min-width: 768px) 600px, 100vw",
      alt,
      fetchPriority: "high",
    });

    titleEl.textContent = product.name ?? "";
    priceEl.textContent = product.price ?? "";
    descriptionEl.textContent = details;
    quantityEl.value = "1";

    this.setAttribute("data-open", "");
    this.setAttribute("aria-hidden", "false");
    document.body.classList.add("overflow-hidden");
    document.addEventListener("keydown", this.#onKeydown);
    this.#nodes.closeBtn.focus();
  }

  close() {
    this.#currentProduct = null;
    this.removeAttribute("data-open");
    this.setAttribute("aria-hidden", "true");
    document.body.classList.remove("overflow-hidden");
    document.removeEventListener("keydown", this.#onKeydown);
  }

  onBuyNow() {
    if (!this.#currentProduct) {
      return;
    }

    const quantity = Number(this.#nodes.quantityEl.value) || 1;

    document.dispatchEvent(
      new CustomEvent("flora-order-open", {
        detail: {
          product: this.#currentProduct,
          quantity,
        },
      }),
    );

    this.close();
  }
}

customElements.define("flora-product-modal", FloraProductModal);
