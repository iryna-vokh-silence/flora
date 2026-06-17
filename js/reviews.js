import { fetchReviews } from './api/reviews.js';

const SLIDE_CLASSES =
  'shrink-0 snap-start snap-always max-md:carousel-slide-mobile md:carousel-slide-tablet lg:carousel-slide-desktop';

function createSlide(review) {
  const li = document.createElement('li');
  li.className = SLIDE_CLASSES;
  const card = document.createElement('flora-testimonial');
  card.setAttribute('author', review.author);
  card.setAttribute('quote', review.quote);
  li.append(card);
  return li;
}

export async function initReviews() {
  const track = document.querySelector('[data-testimonials-track]');
  if (!track) return;

  try {
    const reviews = await fetchReviews();
    if (!reviews.length) return;
    track.replaceChildren(...reviews.map(createSlide));
  } catch {
    // залишаємо хардкодні відгуки при помилці
  }
}
