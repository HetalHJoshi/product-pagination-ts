"use strict";
// Product array and state tracking
let products = [];
let editingProductId = null;
let isEditMode = false;
// Initialize everything on DOM ready
document.addEventListener("DOMContentLoaded", () => {
    loadProducts();
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get("mode");
    const id = urlParams.get("id");
    if (mode === "edit" && id) {
        isEditMode = true;
        editingProductId = id;
        const product = products.find((p) => p.id === editingProductId);
        if (product) {
            document.getElementById("pageHeader").textContent =
                "Edit Product";
            document.getElementById("productName").value =
                product.name;
            document.getElementById("productPrice").value =
                product.price;
            document.getElementById("productDescription").value = product.description;
            document.getElementById("imagePreview").src =
                product.image;
        }
    }
    document.getElementById("productForm").addEventListener("submit", handleFormSubmit);
    document.getElementById("productImage").addEventListener("change", previewImage);
    setupLiveValidation();
});
// Load products from localStorage
function loadProducts() {
    const storedProducts = localStorage.getItem("products");
    products = storedProducts ? JSON.parse(storedProducts) : [];
}
// Save products to localStorage
function saveProducts() {
    localStorage.setItem("products", JSON.stringify(products));
}
// Handle form submission
function handleFormSubmit(e) {
    var _a;
    e.preventDefault();
    const name = document.getElementById("productName");
    const price = document.getElementById("productPrice");
    const description = document.getElementById("productDescription");
    const image = document.getElementById("productImage");
    let isValid = true;
    // Validate name
    if (!name.value.trim() || name.value.trim().length < 2) {
        name.classList.add("is-invalid");
        isValid = false;
    }
    else {
        name.classList.remove("is-invalid");
    }
    // Validate price
    if (!price.value.trim() ||
        isNaN(Number(price.value)) ||
        Number(price.value) <= 0) {
        price.classList.add("is-invalid");
        isValid = false;
    }
    else {
        price.classList.remove("is-invalid");
    }
    // Validate description
    if (!description.value.trim() || description.value.trim().length < 10) {
        description.classList.add("is-invalid");
        isValid = false;
    }
    else {
        description.classList.remove("is-invalid");
    }
    // Validate image
    const file = (_a = image.files) === null || _a === void 0 ? void 0 : _a[0];
    if (!isEditMode && !file) {
        image.classList.add("is-invalid");
        isValid = false;
    }
    else if (file && (!file.type.startsWith("image/") || file.size > 1048576)) {
        image.classList.add("is-invalid");
        isValid = false;
    }
    else {
        image.classList.remove("is-invalid");
    }
    if (!isValid)
        return;
    const nameValue = name.value.trim();
    const priceValue = price.value.trim();
    const descriptionValue = description.value.trim();
    if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
            var _a;
            const result = (_a = event.target) === null || _a === void 0 ? void 0 : _a.result;
            if (typeof result === "string") {
                saveProduct(nameValue, result, priceValue, descriptionValue);
            }
        };
        reader.readAsDataURL(file);
    }
    else if (editingProductId) {
        const existingProduct = products.find((p) => p.id === editingProductId);
        if (existingProduct) {
            saveProduct(nameValue, existingProduct.image, priceValue, descriptionValue);
        }
    }
}
// Save or update product
function saveProduct(name, image, price, description) {
    if (editingProductId) {
        const index = products.findIndex((p) => p.id === editingProductId);
        if (index !== -1) {
            products[index] = {
                id: editingProductId,
                name,
                image,
                price,
                description,
            };
        }
    }
    else {
        products.push({
            id: Date.now().toString(),
            name,
            image,
            price,
            description,
        });
    }
    saveProducts();
    const message = editingProductId
        ? "Product updated successfully!"
        : "Product added successfully!";
    showSuccessModal(message, true);
}
// Preview selected image
function previewImage(event) {
    var _a;
    const input = event.target;
    const file = (_a = input.files) === null || _a === void 0 ? void 0 : _a[0];
    if (file && file.size > 1048576) {
        alert("Image file size should not exceed 1MB.");
        input.value = "";
        document.getElementById("imagePreview").src =
            "https://placehold.co/300x300?text=Product+Image&font=roboto";
        return;
    }
    const reader = new FileReader();
    reader.onload = function () {
        document.getElementById("imagePreview").src =
            reader.result;
    };
    if (file) {
        reader.readAsDataURL(file);
    }
}
// Real-time validation setup
function setupLiveValidation() {
    const name = document.getElementById("productName");
    const price = document.getElementById("productPrice");
    const description = document.getElementById("productDescription");
    const image = document.getElementById("productImage");
    name.addEventListener("input", () => {
        const value = name.value.trim();
        name.classList.toggle("is-invalid", value.length < 2);
    });
    price.addEventListener("input", () => {
        const value = parseFloat(price.value);
        price.classList.toggle("is-invalid", isNaN(value) || value <= 0);
    });
    description.addEventListener("input", () => {
        const value = description.value.trim();
        description.classList.toggle("is-invalid", value.length < 10);
    });
    image.addEventListener("change", () => {
        var _a;
        const file = (_a = image.files) === null || _a === void 0 ? void 0 : _a[0];
        const isAddMode = !window.location.search.includes("edit");
        if (!file && isAddMode) {
            image.classList.add("is-invalid");
        }
        else if (file &&
            (!file.type.startsWith("image/") || file.size > 1048576)) {
            image.classList.add("is-invalid");
        }
        else {
            image.classList.remove("is-invalid");
        }
    });
}
// Show success modal and optionally redirect
function showSuccessModal(message, redirect = true, redirectURL = "index.html") {
    const existingModal = document.getElementById("successModal");
    if (!existingModal) {
        const modalHTML = `
        <div class="modal fade" id="successModal" tabindex="-1" role="dialog" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content text-center">
              <div class="modal-header border-0 pb-0">
                <h5 class="modal-title w-100">Success</h5>
                <button type="button" class="close pr-3 pt-2" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true" style="font-size: 1.3rem;">&times;</span>
                </button>
              </div>
              <div class="modal-body pt-2">
                <p id="successMessage" class="mb-0">${message}</p>
              </div>
            </div>
          </div>
        </div>`;
        document.body.insertAdjacentHTML("beforeend", modalHTML);
    }
    else {
        const msg = document.getElementById("successMessage");
        if (msg)
            msg.textContent = message;
    }
    // Show modal using jQuery Bootstrap (if included)
    // @ts-ignore
    $("#successModal").modal("show");
    setTimeout(() => {
        // @ts-ignore
        $("#successModal").modal("hide");
        if (redirect) {
            window.location.href = redirectURL;
        }
    }, 1500);
}
