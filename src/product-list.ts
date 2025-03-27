import $ from "jquery";
import { Product } from "./types";
import { loadProducts, saveProducts } from "./storage";
import { showSuccessModal } from "./modal";

// Extend the jQuery interface to include Bootstrap's modal method
declare global {
  interface JQuery {
    modal(action: string): JQuery;
  }
}

let products: Product[] = [];
let deleteProductId: string | null = null;
let currentPage: number = 1;
const productsPerPage: number = 4; // Number of products per page

type SortableKey = "id" | "name" | "price";

document.addEventListener("DOMContentLoaded", () => {
  products = loadProducts();
  renderProductCards();

  const addBtn = document.getElementById("addProductBtn");
  if (addBtn) {
    addBtn.classList.remove("d-none");
  }

  const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
  confirmDeleteBtn?.addEventListener("click", handleDelete);
});

// Render product cards with filtering, sorting, and pagination
function renderProductCards(): void {
  const container = document.getElementById(
    "productCardContainer"
  ) as HTMLElement;
  const noProductsMessage = document.getElementById(
    "noProductsMessage"
  ) as HTMLElement;
  container.innerHTML = "";

  // Get filter values
  const filterId = (document.getElementById("filterId") as HTMLInputElement)
    .value;
  const filterName = (
    document.getElementById("filterName") as HTMLInputElement
  ).value.toLowerCase();
  const filterDescription = (
    document.getElementById("filterDescription") as HTMLInputElement
  ).value.toLowerCase();
  const filterPrice = (
    document.getElementById("filterPrice") as HTMLInputElement
  ).value;

  // Filter products based on criteria
  let filteredProducts = products.filter((product) => {
    return (
      (!filterId || product.id.includes(filterId)) &&
      (!filterName || product.name.toLowerCase().includes(filterName)) &&
      (!filterDescription ||
        product.description.toLowerCase().includes(filterDescription)) &&
      (!filterPrice || product.price.toString().includes(filterPrice))
    );
  });

  // Sorting (if a sort key is selected)
  const sortKey = (document.getElementById("sortBy") as HTMLSelectElement)
    .value as SortableKey;
  const sortOrder = (document.getElementById("sortOrder") as HTMLSelectElement)
    .value;

  if (sortKey) {
    filteredProducts.sort((a, b) => {
      // For "price", we convert to number; for others, we lowercase strings
      const aVal =
        sortKey === "price"
          ? parseFloat(String(a[sortKey]))
          : (a[sortKey] as string).toLowerCase();
      const bVal =
        sortKey === "price"
          ? parseFloat(String(b[sortKey]))
          : (b[sortKey] as string).toLowerCase();

      return sortOrder === "asc"
        ? aVal > bVal
          ? 1
          : -1
        : aVal < bVal
        ? 1
        : -1;
    });
  }

  // Show "no products" message if none found
  if (filteredProducts.length === 0) {
    const filters = [
      { id: "filterId", label: "Product ID" },
      { id: "filterName", label: "Product Name" },
      { id: "filterDescription", label: "Description" },
      { id: "filterPrice", label: "Price" },
    ];
    const activeFilter = filters.find(
      (f) =>
        (
          (document.getElementById(f.id) as HTMLInputElement).value || ""
        ).trim() !== ""
    );
    if (activeFilter) {
      const filterValue = (
        document.getElementById(activeFilter.id) as HTMLInputElement
      ).value.trim();
      noProductsMessage.innerText = `No products found for ${activeFilter.label} "${filterValue}".`;
    } else {
      noProductsMessage.innerText = "No products found.";
    }
    noProductsMessage.style.display = "block";
  } else {
    noProductsMessage.style.display = "none";
  }

  // Pagination calculations
  const startIndex = (currentPage - 1) * productsPerPage;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + productsPerPage
  );

  // Render each product card for the current page
  paginatedProducts.forEach((product) => {
    const card = document.createElement("div");
    card.className = "col-md-6 mb-4";
    card.innerHTML = `
      <div class="card h-100">
        <img src="${product.image}" class="card-img-top" alt="${product.name}" style="object-fit: cover; height: 200px;">
        <div class="card-body">
          <h5 class="card-title">${product.name}</h5>
          <p class="card-text"><strong>ID:</strong> ${product.id}</p>
          <p class="card-text"><strong>Price:</strong> $${product.price}</p>
          <p class="card-text">${product.description}</p>
        </div>
        <div class="card-footer d-flex justify-content-between">
          <a href="product2.html?mode=edit&id=${product.id}" class="btn btn-sm btn-info">Edit</a>
          <button class="btn btn-sm btn-danger" onclick="confirmDelete('${product.id}')">Delete</button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });

  // Update pagination controls
  renderPaginationControls(filteredProducts.length);
}

// Render pagination controls dynamically using the existing <ul class="pagination">
function renderPaginationControls(totalProducts: number): void {
  const paginationContainer = document.querySelector(
    "ul.pagination"
  ) as HTMLUListElement;
  if (!paginationContainer) return;

  // If no products, hide pagination; otherwise, show it
  if (totalProducts === 0) {
    paginationContainer.style.display = "none";
    return;
  } else {
    paginationContainer.style.display = "flex";
  }

  // Apply fixed styling inline so the container stays at the bottom of the viewport
  paginationContainer.style.position = "fixed";
  paginationContainer.style.bottom = "0";
  paginationContainer.style.left = "0";
  paginationContainer.style.right = "0";
  paginationContainer.style.backgroundColor = "#fff";
  paginationContainer.style.padding = "10px 0";
  paginationContainer.style.zIndex = "1000";

  const totalPages = Math.ceil(totalProducts / productsPerPage);
  paginationContainer.innerHTML = "";

  // Previous button
  const prevLi = document.createElement("li");
  prevLi.className = `page-item ${currentPage === 1 ? "disabled" : ""}`;
  const prevLink = document.createElement("a");
  prevLink.className = "page-link";
  prevLink.href = "#";
  prevLink.textContent = "Previous";
  prevLink.dataset.page = (currentPage - 1).toString();
  prevLi.appendChild(prevLink);
  paginationContainer.appendChild(prevLi);

  // Page number buttons
  for (let i = 1; i <= totalPages; i++) {
    const li = document.createElement("li");
    li.className = `page-item ${i === currentPage ? "active" : ""}`;
    const a = document.createElement("a");
    a.className = "page-link";
    a.href = "#";
    a.textContent = i.toString();
    a.dataset.page = i.toString();
    li.appendChild(a);
    paginationContainer.appendChild(li);
  }

  // Next button
  const nextLi = document.createElement("li");
  nextLi.className = `page-item ${
    currentPage === totalPages ? "disabled" : ""
  }`;
  const nextLink = document.createElement("a");
  nextLink.className = "page-link";
  nextLink.href = "#";
  nextLink.textContent = "Next";
  nextLink.dataset.page = (currentPage + 1).toString();
  nextLi.appendChild(nextLink);
  paginationContainer.appendChild(nextLi);

  // Attach event listeners to the pagination links using e.currentTarget
  paginationContainer.querySelectorAll("a.page-link").forEach((link) => {
    link.addEventListener("click", (e: Event) => {
      e.preventDefault();
      const page = parseInt(
        (e.currentTarget as HTMLAnchorElement).dataset.page || ""
      );
      if (!isNaN(page)) {
        changePage(page);
      }
    });
  });
}

// Change page and re-render product cards; recalculate the filtered count
function changePage(page: number): void {
  const filterId = (document.getElementById("filterId") as HTMLInputElement)
    .value;
  const filterName = (
    document.getElementById("filterName") as HTMLInputElement
  ).value.toLowerCase();
  const filterDescription = (
    document.getElementById("filterDescription") as HTMLInputElement
  ).value.toLowerCase();
  const filterPrice = (
    document.getElementById("filterPrice") as HTMLInputElement
  ).value;
  const totalFilteredProducts = products.filter((product) => {
    return (
      (!filterId || product.id.includes(filterId)) &&
      (!filterName || product.name.toLowerCase().includes(filterName)) &&
      (!filterDescription ||
        product.description.toLowerCase().includes(filterDescription)) &&
      (!filterPrice || product.price.toString().includes(filterPrice))
    );
  }).length;
  let totalPages = Math.ceil(totalFilteredProducts / productsPerPage);
  if (totalPages < 1) totalPages = 1;
  if (page < 1 || page > totalPages) return;
  currentPage = page;
  renderProductCards();
}

function confirmDelete(productId: string): void {
  deleteProductId = productId;
  $("#deleteConfirmModal").modal("show");
}

function handleDelete(): void {
  if (deleteProductId) {
    products = products.filter((product) => product.id !== deleteProductId);
    saveProducts(products);
    renderProductCards();
    $("#deleteConfirmModal").modal("hide");
    showSuccessModal("Product deleted successfully!");
    deleteProductId = null;
  }
}

function clearFilters(): void {
  (document.getElementById("filterId") as HTMLInputElement).value = "";
  (document.getElementById("filterName") as HTMLInputElement).value = "";
  (document.getElementById("filterDescription") as HTMLInputElement).value = "";
  (document.getElementById("filterPrice") as HTMLInputElement).value = "";
  (document.getElementById("sortBy") as HTMLSelectElement).value = "";
  (document.getElementById("sortOrder") as HTMLSelectElement).value = "asc";
  renderProductCards();
}

(window as any).clearFilters = clearFilters;
(window as any).confirmDelete = confirmDelete;
