document.addEventListener("DOMContentLoaded", () => {

    console.log("Order details loaded.");

    const copyButton =
        document.querySelector("#copyOrderId");

    if (!copyButton) return;

    copyButton.addEventListener("click", async () => {

        const orderId =
            copyButton.dataset.orderId;

        if (!orderId) return;

        try {

            await navigator.clipboard.writeText(orderId);

            alert("Order ID copied!");

        } catch (error) {

            console.error(error);

            alert("Unable to copy Order ID.");

        }

    });

});