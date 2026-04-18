class FloraTestimonial extends HTMLElement {
  connectedCallback() {
    this.classList.add("block", "w-full", "min-w-0");

    const quote = document.createElement("p");
    quote.className = "testimonial-card__quote";
    quote.textContent = this.getAttribute("quote") ?? "";

    const author = document.createElement("p");
    author.className = "testimonial-card__author";
    author.textContent = this.getAttribute("author") ?? "";

    const wrap = document.createElement("div");
    wrap.className = "testimonial-card";
    wrap.append(quote, author);

    this.replaceChildren(wrap);
  }
}

customElements.define("flora-testimonial", FloraTestimonial);
