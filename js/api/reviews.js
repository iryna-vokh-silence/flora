import axios from 'axios';

const API_BASE = 'https://flora-backend-sii6.onrender.com/api';

export async function fetchReviews() {
  const { data } = await axios.get(`${API_BASE}/reviews`);
  return data;
}
