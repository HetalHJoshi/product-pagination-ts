"use strict";
function showSuccessModal(message, redirect = false, redirectURL = "index.html") {
    const modal = document.getElementById("successModal");
    const messageEl = document.getElementById("successMessage");
    if (modal && messageEl) {
        messageEl.textContent = message;
        // @ts-ignore: Assuming jQuery is globally available (e.g., via CDN)
        $("#successModal").modal("show");
        setTimeout(() => {
            // @ts-ignore
            $("#successModal").modal("hide");
            if (redirect) {
                window.location.href = redirectURL;
            }
        }, 1500);
    }
}
