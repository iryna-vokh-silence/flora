import { NAV_LINKS } from '../data/nav-links.js';

const UL_CLASS = {
  header: 'flex items-center gap-8 text-base font-normal',
  drawer:
    'm-0 flex w-full list-none flex-col gap-8 text-base font-normal leading-normal max-md:items-start max-md:text-left md:items-center md:text-center',
  footer:
    'flex flex-col md:flex-row flex-wrap items-center justify-center gap-6 md:gap-8',
};

/** Можна перевикористати з іншим масивом посилань і класом ul. */
export function buildNavList(links, ulClassName) {
  const ul = document.createElement('ul');
  ul.className = ulClassName;
  for (const { href, label } of links) {
    const a = document.createElement('a');
    a.className = 'nav-link';
    a.href = href;
    a.textContent = label;
    const li = document.createElement('li');
    li.append(a);
    ul.append(li);
  }
  return ul;
}

class FloraNavLinks extends HTMLElement {
  connectedCallback() {
    const variant = this.getAttribute('variant') ?? 'header';
    const ulClass = UL_CLASS[variant] ?? UL_CLASS.header;
    this.replaceChildren(buildNavList(NAV_LINKS, ulClass));
  }
}

customElements.define('flora-nav-links', FloraNavLinks);
