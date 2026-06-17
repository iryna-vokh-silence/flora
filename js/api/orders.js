import axios from 'axios';

const API_BASE = 'https://flora-backend-sii6.onrender.com/api';

export async function submitOrder(data) {
  const { data: order } = await axios.post(`${API_BASE}/orders`, data);
  return order;
}
