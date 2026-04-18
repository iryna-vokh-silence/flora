/**
 * Рядок контакту: іконка зі спрайту (`glyph`) + підпис + посилання або текст.
 */
import { ICON_SPRITE } from "../icons-sprite.js";

function svgFromGlyph(glyph, className) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "24");
  svg.setAttribute("height", "24");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("class", className);
  const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
  use.setAttribute("href", `${ICON_SPRITE}#${glyph}`);
  svg.appendChild(use);
  return svg;
}

class FloraContactLine extends HTMLElement {
  connectedCallback() {
    const root = document
      .getElementById("flora-contact-line")
      .content.cloneNode(true);

    const glyph = this.getAttribute("glyph") ?? "";
    const label = this.getAttribute("label") ?? "";
    const href = this.getAttribute("href");
    const linkLabel = this.getAttribute("link-label") ?? "";
    const copy = this.getAttribute("copy") ?? "";

    const holder = root.querySelector(".contact-line__icon");
    if (holder && glyph) {
      holder.replaceWith(
        svgFromGlyph(glyph, "contact-line__icon size-6 shrink-0"),
      );
    }

    const textCol = root.querySelector(".contact-line__text");
    textCol.querySelector(".contact-line__label").textContent = label;

    if (href) {
      const a = document.createElement("a");
      a.href = href;
      a.className = "contact-line__link";
      a.textContent = linkLabel;
      textCol.append(a);
    } else {
      const p = document.createElement("p");
      p.className = "contact-line__plain";
      p.textContent = copy;
      textCol.append(p);
    }

    this.replaceChildren(root);
  }
}

customElements.define("flora-contact-line", FloraContactLine);
