/**
 * Допоміжні функції для ретинізованих растрових зображень (@1x / @2x).
 */

/**
 * @param {string} src — шлях до зображення (.jpg, .png, …), з суфіксом @1x/@2x або без нього
 * @returns {{ base: string, ext: string }}
 */
function parseRasterSrc(src) {
  const match = src.match(/^(.+?)(@(?:1|2)x)?(\.[a-z0-9]+)$/i);
  if (!match) {
    return { base: src, ext: "" };
  }
  return { base: match[1], ext: match[3] };
}

/** @param {string} src */
export function toRetina1xSrc(src) {
  const { base, ext } = parseRasterSrc(src);
  return `${base}@1x${ext}`;
}

/** @param {string} src */
export function toRetina2xSrc(src) {
  const { base, ext } = parseRasterSrc(src);
  return `${base}@2x${ext}`;
}

/**
 * @param {string} src
 * @returns {string} значення для атрибута srcset (лише 2x, як у вимогах)
 */
export function buildRetinaSrcset(src) {
  return `${toRetina2xSrc(src)} 2x`;
}

/**
 * @param {HTMLImageElement} img
 * @param {string} src
 * @param {{ sizes?: string, alt?: string, fetchPriority?: 'high' | 'low' | 'auto' }} [options]
 */
export function applyRetinaImage(img, src, options = {}) {
  img.src = toRetina1xSrc(src);
  img.srcset = buildRetinaSrcset(src);

  if (options.sizes) {
    img.sizes = options.sizes;
  }

  if (options.alt !== undefined) {
    img.alt = options.alt;
  }

  if (options.fetchPriority) {
    img.fetchPriority = options.fetchPriority;
  }
}
