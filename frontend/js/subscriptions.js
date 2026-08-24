document.addEventListener("DOMContentLoaded", () => {

    console.log(
        "Subscriptions page loaded."
    );

    const buttons =
        document.querySelectorAll(
            ".subscription-btn"
        );

    buttons.forEach(button => {

        button.addEventListener("click", () => {

            const id =
                button.dataset.id;

            if (id) {

                window.location.href =
                    `/customer/subscription/${id}`;

            }

        });

    });

});