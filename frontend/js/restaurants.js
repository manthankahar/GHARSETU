document.addEventListener("DOMContentLoaded", () => {

    console.log("Restaurants page loaded.");

    const cards =
        document.querySelectorAll(".restaurant-card");

    cards.forEach(card => {

        card.addEventListener("click", (e) => {

            if (e.target.closest("a")) {
                return;
            }

            const link =
                card.querySelector("a");

            if (link) {
                window.location.href =
                    link.href;
            }

        });

    });

});