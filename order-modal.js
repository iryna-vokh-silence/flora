class FloraOrderModal extends HTMLElement {
  #nodes = null;
  #onOrderOpen = null;
  #onKeydown = null;
  #onOverlayClick = null;
  #onPanelClick = null;

  connectedCallback() {
    if (!this.#nodes) {
      this.mount();
    }

    this.#onOrderOpen = (event) => {
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

    document.addEventListener("flora-order-open", this.#onOrderOpen);
    this.addEventListener("click", this.#onOverlayClick);
    this.#nodes.panel.addEventListener("click", this.#onPanelClick);
    this.#nodes.closeBtn.addEventListener("click", () => this.close());
    this.#nodes.form.addEventListener("submit", (event) => {
      event.preventDefault();
      this.close();
    });
  }

  disconnectedCallback() {
    document.removeEventListener("flora-order-open", this.#onOrderOpen);
    document.removeEventListener("keydown", this.#onKeydown);
  }

  mount() {
    const panel = this.querySelector('[data-role="panel"]');
    const form = this.querySelector('[data-role="form"]');
    const closeBtn = this.querySelector("[data-modal-close]");

    if (!panel || !form || !closeBtn) {
      throw new Error("Order modal has missing required nodes");
    }

    this.#nodes = { panel, form, closeBtn };
  }

  open() {
    this.#nodes.form.reset();

    this.setAttribute("data-open", "");
    this.setAttribute("aria-hidden", "false");
    document.body.classList.add("overflow-hidden");
    document.addEventListener("keydown", this.#onKeydown);

    const firstField = this.#nodes.form.querySelector("input, textarea");
    firstField?.focus();
  }

  close() {
    this.removeAttribute("data-open");
    this.setAttribute("aria-hidden", "true");
    document.body.classList.remove("overflow-hidden");
    document.removeEventListener("keydown", this.#onKeydown);
  }
}

customElements.define("flora-order-modal", FloraOrderModal);
