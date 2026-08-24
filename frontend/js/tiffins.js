document.addEventListener("DOMContentLoaded", () => {

    console.log("Tiffins page loaded.");

    const cards = document.querySelectorAll(".tiffin-card");

    cards.forEach(card => {

        card.addEventListener("click", (e) => {

            if (e.target.closest("a")) {
                return;
            }

            const link = card.querySelector("a");

            if (link) {
                window.location.href = link.href;
            }

        });

    });

});