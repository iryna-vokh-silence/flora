import axios from '../../node_modules/axios/dist/esm/axios.js';

const API_BASE = 'http://localhost:3001';
export const PRODUCTS_PAGE_SIZE = 8;

/**
 * @param {number} page
 * @returns {Promise<{ products: Array, total: number }>}
 */
export async function fetchProducts(page) {
  try {
    const response = await axios.get(`${API_BASE}/products`, {
      params: {
        _page: page,
        _limit: PRODUCTS_PAGE_SIZE,
      },
    });

    const total = Number(response.headers['x-total-count'] ?? response.data.length);

    return {
      products: response.data,
      total,
    };
  } catch (error) {
    throw error;
  }
}
