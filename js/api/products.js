import axios from 'axios';

const IS_STATIC = import.meta.env.VITE_API_MODE === 'static';
const API_BASE = IS_STATIC
  ? `${import.meta.env.BASE_URL}api`
  : 'https://flora-backend-sii6.onrender.com/api';

export const PRODUCTS_PAGE_SIZE = 8;

let _cache = null;

async function getAllProducts() {
  if (_cache) return _cache;
  const { data } = await axios.get(`${API_BASE}/bouquets.json`);
  _cache = data;
  return _cache;
}

/**
 * @param {number} page
 * @returns {Promise<{ products: Array, total: number }>}
 */
export async function fetchProducts(page) {
  if (IS_STATIC) {
    const all = await getAllProducts();
    const start = (page - 1) * PRODUCTS_PAGE_SIZE;
    return {
      products: all.slice(start, start + PRODUCTS_PAGE_SIZE),
      total: all.length,
    };
  }

  const response = await axios.get(`${API_BASE}/bouquets`, {
    params: {
      _page: page,
      _limit: PRODUCTS_PAGE_SIZE,
    },
  });

  const total = Number(response.headers['x-total-count'] ?? response.data.total);

  return {
    products: response.data.bouquets,
    total,
  };
}
