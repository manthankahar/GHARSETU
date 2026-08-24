document.addEventListener("DOMContentLoaded", () => {

    console.log("Cart page loaded.");

    window.updateQuantity = async function (
        productId,
        change
    ) {

        try {

            const response = await fetch(
                "/api/cart/update",
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json",
                        "Authorization":
                            `Bearer ${localStorage.getItem("token") || ""}`
                    },

                    body: JSON.stringify({
                        productId,
                        change
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {

                alert(
                    data.message ||
                    "Unable to update quantity."
                );

                return;
            }

            window.location.reload();

        } catch (error) {

            console.error(
                "UPDATE CART ERROR:",
                error
            );

            alert("Server connection failed.");

        }

    };


    window.removeFromCart = async function (
        productId
    ) {

        if (!confirm("Remove this item from cart?")) {
            return;
        }

        try {

            const response = await fetch(
                "/api/cart/remove",
                {
                    method: "DELETE",

                    headers: {
                        "Content-Type": "application/json",
                        "Authorization":
                            `Bearer ${localStorage.getItem("token") || ""}`
                    },

                    body: JSON.stringify({
                        productId
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {

                alert(
                    data.message ||
                    "Unable to remove item."
                );

                return;
            }

            window.location.reload();

        } catch (error) {

            console.error(
                "REMOVE CART ERROR:",
                error
            );

            alert("Server connection failed.");

        }

    };

});