document.addEventListener("DOMContentLoaded", () => {

    const form =
        document.querySelector("#trackOrderForm");

    if (!form) return;

    form.addEventListener("submit", (e) => {

        const input =
            form.querySelector(
                "[name='orderId']"
            );

        if (!input || !input.value.trim()) {

            e.preventDefault();

            alert(
                "Please enter your Order ID."
            );

        }

    });

});