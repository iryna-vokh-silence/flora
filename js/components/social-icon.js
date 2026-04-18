/** Іконка соцмережі зі спрайту `assets/icons.svg`. */
import { ICON_SPRITE } from '../icons-sprite.js';

class FloraSocialIcon extends HTMLElement {
  connectedCallback() {
    const glyph = this.getAttribute('glyph') ?? '';
    const label = this.getAttribute('label') ?? '';

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', label);
    svg.classList.add('block', 'size-10', 'md:size-6');

    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttribute('href', `${ICON_SPRITE}#${glyph}`);
    svg.appendChild(use);

    this.replaceChildren(svg);
  }
}

customElements.define('flora-social-icon', FloraSocialIcon);
