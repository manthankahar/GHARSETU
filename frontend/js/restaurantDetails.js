document.addEventListener("DOMContentLoaded", () => {

    console.log(
        "Restaurant Details Loaded"
    );

    const buttons =
        document.querySelectorAll(
            ".add-to-cart-btn"
        );

    buttons.forEach(button => {

        button.addEventListener(
            "click",
            async () => {

                const productId =
                    button.dataset.productId;

                if (!productId) {

                    alert(
                        "Product ID not found."
                    );

                    return;
                }

                try {

                    const response =
                        await fetch(
                            "/api/cart/add",
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body: JSON.stringify({
                                    productId,
                                    quantity: 1
                                })
                            }
                        );

                    const data =
                        await response.json();

                    if (!response.ok) {

                        alert(
                            data.message ||
                            "Unable to add to cart."
                        );

                        return;
                    }

                    alert(
                        data.message ||
                        "Added to cart!"
                    );

                } catch (error) {

                    console.error(error);

                    alert(
                        "Server connection failed."
                    );

                }

            }
        );

    });

});