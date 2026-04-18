class MobileMenu extends HTMLElement {
  connectedCallback() {
    const openButton = document.querySelector("[data-menu-open]");
    const closeButton = this.querySelector("[data-menu-close]");

    if (!openButton || !closeButton) {
      return;
    }

    const toggleMenu = (isOpen) => {
      if (isOpen) {
        this.setAttribute("data-open", "");
      } else {
        this.removeAttribute("data-open");
      }
      this.setAttribute("aria-hidden", String(!isOpen));
      openButton.setAttribute("aria-expanded", String(isOpen));
      document.body.classList.toggle("overflow-hidden", isOpen);
    };

    openButton.addEventListener("click", () => toggleMenu(true));
    closeButton.addEventListener("click", () => toggleMenu(false));

    const nav = this.querySelector("[data-menu-nav]");
    nav?.addEventListener("click", (event) => {
      if (event.target.closest("a")) {
        toggleMenu(false);
      }
    });
  }
}

customElements.define("mobile-menu", MobileMenu);
