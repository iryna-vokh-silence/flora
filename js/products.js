import { fetchProducts } from "./api/products.js";

/**
 * @param {object} product
 * @returns {HTMLLIElement}
 */
function createProductItem(product) {
  const li = document.createElement("li");
  const card = document.createElement("flora-product-card");

  card.setAttribute("variant", "compact");
  card.setAttribute("name", product.name ?? "");
  card.setAttribute("description", product.description ?? "");
  card.setAttribute("price", product.price ?? "");
  card.setAttribute("src", product.src ?? "");
  card.setAttribute("alt", product.alt ?? product.name ?? "");
  card.setAttribute("width", "296");

  li.append(card);
  return li;
}

/**
 * @param {HTMLElement} element
 */
function smoothScrollToElement(element) {
  const rect = element.getBoundingClientRect();
  window.scrollBy({
    top: rect.top - 24,
    behavior: "smooth",
  });
}

export function initProducts() {
  const section = document.querySelector("[data-products-section]");
  if (!section) {
    return;
  }

  const list = section.querySelector("[data-products-list]");
  const loader = section.querySelector("[data-products-loader]");
  const errorEl = section.querySelector("[data-products-error]");
  const endEl = section.querySelector("[data-products-end]");
  const showMoreBtn = section.querySelector("[data-products-show-more]");
  const actionsEl = section.querySelector("[data-products-actions]");

  if (!list || !loader || !errorEl || !endEl || !showMoreBtn || !actionsEl) {
    return;
  }

  const state = {
    page: 1,
    loaded: 0,
    total: 0,
    isLoading: false,
  };

  const setLoading = (isLoading) => {
    state.isLoading = isLoading;
    loader.classList.toggle("hidden", !isLoading);
    showMoreBtn.disabled = isLoading;
    showMoreBtn.classList.toggle("opacity-50", isLoading);
    showMoreBtn.classList.toggle("pointer-events-none", isLoading);
  };

  const hideError = () => {
    errorEl.classList.add("hidden");
    errorEl.textContent = "";
  };

  const showError = (message) => {
    errorEl.textContent = message;
    errorEl.classList.remove("hidden");
  };

  const hideEnd = () => {
    endEl.classList.add("hidden");
  };

  const showEnd = () => {
    endEl.classList.remove("hidden");
    actionsEl.classList.add("hidden");
  };

  const updateShowMore = () => {
    const hasMore = state.loaded < state.total;
    actionsEl.classList.toggle("hidden", !hasMore);
    showMoreBtn.classList.toggle("hidden", !hasMore);
  };

  const loadProducts = async ({ append = false } = {}) => {
    if (state.isLoading) {
      return;
    }

    const anchorBefore = append ? list.lastElementChild : null;

    hideError();
    hideEnd();
    setLoading(true);

    if (!append) {
      list.replaceChildren();
      state.page = 1;
      state.loaded = 0;
      state.total = 0;
    }

    try {
      const { products, total } = await fetchProducts(state.page);

      state.total = total;
      state.page += 1;

      if (products.length === 0) {
        if (!append) {
          list.replaceChildren();
        }
        showEnd();
        return;
      }

      products.forEach((product) => {
        list.append(createProductItem(product));
      });

      state.loaded += products.length;

      if (state.loaded >= state.total) {
        showEnd();
      } else {
        updateShowMore();
      }

      if (append && anchorBefore instanceof HTMLElement) {
        const firstNew = anchorBefore.nextElementSibling;
        if (firstNew instanceof HTMLElement) {
          smoothScrollToElement(firstNew);
        }
      }
    } catch {
      const message =
        "Unable to load products. Please make sure json-server is running and try again.";

      if (!append) {
        list.replaceChildren();
        actionsEl.classList.add("hidden");
      }

      showError(message);
    } finally {
      setLoading(false);
    }
  };

  showMoreBtn.addEventListener("click", () => {
    loadProducts({ append: true });
  });

  loadProducts();
}
