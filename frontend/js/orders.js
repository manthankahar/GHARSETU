document.addEventListener("DOMContentLoaded", () => {

    console.log("Orders page loaded.");

    const orderCards =
        document.querySelectorAll(".order-card");

    orderCards.forEach(card => {

        const button =
            card.querySelector(".view-order-btn");

        if (!button) return;

        button.addEventListener("click", () => {

            const orderId =
                button.dataset.orderId;

            if (orderId) {

                window.location.href =
                    `/customer/orders/${orderId}`;

            }

        });

    });

});