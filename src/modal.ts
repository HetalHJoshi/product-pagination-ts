import $ from "jquery";

// Extend the jQuery interface to include Bootstrap's modal method
declare global {
  interface JQuery {
    modal(action: string): JQuery;
  }
}

export function showSuccessModal(
  message: string,
  redirect: boolean = false,
  redirectURL: string = "index.html"
): void {
  const modal = document.getElementById("successModal");
  const messageEl = document.getElementById("successMessage");

  if (modal && messageEl) {
    messageEl.textContent = message;

    // Show the modal using jQuery + Bootstrap
    $("#successModal").modal("show");

    setTimeout(() => {
      $("#successModal").modal("hide");

      if (redirect) {
        window.location.href = redirectURL;
      }
    }, 1500);
  }
}
