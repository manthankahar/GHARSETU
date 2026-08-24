document.addEventListener("DOMContentLoaded", () => {

    const form =
        document.querySelector("#checkoutForm");

    if (!form) return;

    form.addEventListener("submit", (e) => {

        const mobile =
            form.querySelector("[name='mobile']")?.value.trim();

        const pincode =
            form.querySelector("[name='pincode']")?.value.trim();

        if (mobile && !/^[0-9]{10}$/.test(mobile)) {

            e.preventDefault();

            alert("Please enter a valid 10 digit mobile number.");

            return;
        }

        if (pincode && !/^[0-9]{6}$/.test(pincode)) {

            e.preventDefault();

            alert("Please enter a valid 6 digit pincode.");

            return;
        }

    });

});