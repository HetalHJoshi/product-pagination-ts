import { Product } from "./types";
import { loadProducts, saveProducts } from "./storage";
import { showSuccessModal } from "./modal";

let products: Product[] = [];
let editingProductId: string | null = null;
let isEditMode = false;

document.addEventListener("DOMContentLoaded", () => {
  products = loadProducts();

  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get("mode");
  const id = urlParams.get("id");

  if (mode === "edit" && id) {
    isEditMode = true;
    editingProductId = id;

    const product = products.find((p) => p.id === editingProductId);
    if (product) {
      (document.getElementById("pageHeader") as HTMLElement).textContent =
        "Edit Product";
      (document.getElementById("productName") as HTMLInputElement).value =
        product.name;
      (document.getElementById("productPrice") as HTMLInputElement).value =
        product.price;
      (
        document.getElementById("productDescription") as HTMLTextAreaElement
      ).value = product.description;
      (document.getElementById("imagePreview") as HTMLImageElement).src =
        product.image;
    }
  }

  (document.getElementById("productForm") as HTMLFormElement).addEventListener(
    "submit",
    handleFormSubmit
  );
  (
    document.getElementById("productImage") as HTMLInputElement
  ).addEventListener("change", previewImage);

  setupLiveValidation();
});

function handleFormSubmit(e: Event): void {
  e.preventDefault();

  const name = document.getElementById("productName") as HTMLInputElement;
  const price = document.getElementById("productPrice") as HTMLInputElement;
  const description = document.getElementById(
    "productDescription"
  ) as HTMLTextAreaElement;
  const image = document.getElementById("productImage") as HTMLInputElement;

  let isValid = true;

  if (!name.value.trim() || name.value.trim().length < 2) {
    name.classList.add("is-invalid");
    isValid = false;
  } else {
    name.classList.remove("is-invalid");
  }

  if (
    !price.value.trim() ||
    isNaN(Number(price.value)) ||
    Number(price.value) <= 0
  ) {
    price.classList.add("is-invalid");
    isValid = false;
  } else {
    price.classList.remove("is-invalid");
  }

  if (!description.value.trim() || description.value.trim().length < 10) {
    description.classList.add("is-invalid");
    isValid = false;
  } else {
    description.classList.remove("is-invalid");
  }

  const file = image.files?.[0];
  if (!isEditMode && !file) {
    image.classList.add("is-invalid");
    isValid = false;
  } else if (file && (!file.type.startsWith("image/") || file.size > 1048576)) {
    image.classList.add("is-invalid");
    isValid = false;
  } else {
    image.classList.remove("is-invalid");
  }

  if (!isValid) return;

  const nameValue = name.value.trim();
  const priceValue = price.value.trim();
  const descriptionValue = description.value.trim();

  if (file) {
    const reader = new FileReader();
    reader.onload = function (event: ProgressEvent<FileReader>) {
      const result = event.target?.result;
      if (typeof result === "string") {
        saveProduct(nameValue, result, priceValue, descriptionValue);
      }
    };
    reader.readAsDataURL(file);
  } else if (editingProductId) {
    const existingProduct = products.find((p) => p.id === editingProductId);
    if (existingProduct) {
      saveProduct(
        nameValue,
        existingProduct.image,
        priceValue,
        descriptionValue
      );
    }
  }
}

function saveProduct(
  name: string,
  image: string,
  price: string,
  description: string
): void {
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
  } else {
    products.push({
      id: Date.now().toString(),
      name,
      image,
      price,
      description,
    });
  }

  saveProducts(products);

  const message = editingProductId
    ? "Product updated successfully!"
    : "Product added successfully!";
  showSuccessModal(message, true);
}

function previewImage(event: Event): void {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  if (file && file.size > 1048576) {
    alert("Image file size should not exceed 1MB.");
    input.value = "";
    (document.getElementById("imagePreview") as HTMLImageElement).src =
      "https://placehold.co/300x300?text=Product+Image&font=roboto";
    return;
  }

  const reader = new FileReader();
  reader.onload = function () {
    (document.getElementById("imagePreview") as HTMLImageElement).src =
      reader.result as string;
  };
  if (file) {
    reader.readAsDataURL(file);
  }
}

function setupLiveValidation(): void {
  const name = document.getElementById("productName") as HTMLInputElement;
  const price = document.getElementById("productPrice") as HTMLInputElement;
  const description = document.getElementById(
    "productDescription"
  ) as HTMLTextAreaElement;
  const image = document.getElementById("productImage") as HTMLInputElement;

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
    const file = image.files?.[0];
    const isAddMode = !window.location.search.includes("edit");

    if (!file && isAddMode) {
      image.classList.add("is-invalid");
    } else if (
      file &&
      (!file.type.startsWith("image/") || file.size > 1048576)
    ) {
      image.classList.add("is-invalid");
    } else {
      image.classList.remove("is-invalid");
    }
  });
}
