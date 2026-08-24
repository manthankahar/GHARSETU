document.addEventListener("DOMContentLoaded", () => {

    console.log("Tiffin Details Loaded");

    const addButton =
        document.querySelector("#addToCartBtn");

    if (!addButton) return;

    addButton.addEventListener("click", async () => {

        const productId =
            addButton.dataset.productId;

        if (!productId) {

            alert("Product ID not found.");

            return;
        }

        try {

            const response = await fetch(
                "/api/cart/add",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        "Authorization":
                            `Bearer ${localStorage.getItem("token") || ""}`
                    },

                    body: JSON.stringify({
                        productId,
                        quantity: 1
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {

                alert(
                    data.message ||
                    "Unable to add item to cart."
                );

                return;
            }

            alert(
                data.message ||
                "Added to cart successfully!"
            );

        } catch (error) {

            console.error(
                "ADD CART ERROR:",
                error
            );

            alert("Server connection failed.");

        }

    });

});