class FloraTestimonial extends HTMLElement {
  connectedCallback() {
    this.classList.add("block", "w-full", "min-w-0");

    const quote = document.createElement("p");
    quote.className = "m-0 text-lg leading-normal";
    quote.textContent = this.getAttribute("quote") ?? "";

    const author = document.createElement("p");
    author.className = "mt-auto text-base font-semibold leading-normal";
    author.textContent = this.getAttribute("author") ?? "";

    const wrap = document.createElement("div");
    wrap.className =
      "flex min-h-0 flex-col gap-6 rounded-2xl border border-border-subtle p-6 md:min-h-[228px] md:justify-between md:gap-0 md:p-8 lg:min-h-60";
    wrap.append(quote, author);

    this.replaceChildren(wrap);
  }
}

customElements.define("flora-testimonial", FloraTestimonial);
