document.addEventListener("DOMContentLoaded", () => {

    console.log("Profile page loaded.");

    const logoutButton =
        document.querySelector("#logoutBtn");

    if (!logoutButton) return;

    logoutButton.addEventListener("click", () => {

        localStorage.removeItem("token");

        window.location.href =
            "/customer/login";

    });

});