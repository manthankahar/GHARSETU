document.addEventListener("DOMContentLoaded", () => {

    const form = document.querySelector("#loginForm");

    if (!form) return;

    form.addEventListener("submit", async (e) => {

        e.preventDefault();

        // =====================================
        // GET FORM VALUES
        // =====================================

        const email = form.querySelector("[name='email']").value.trim();
        const password = form.querySelector("[name='password']").value;

        // =====================================
        // VALIDATION
        // =====================================

        if (!email || !password) {
            alert("Please enter email and password.");
            return;
        }

        try {

            // =====================================
            // LOGIN API
            // =====================================

            const response = await fetch("/api/auth/login", {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                credentials: "include",

                body: JSON.stringify({
                    email,
                    password
                })
            });

            const data = await response.json();

            // =====================================
            // LOGIN FAILED
            // =====================================

            if (!response.ok) {
                alert(data.message || "Login failed.");
                return;
            }

            // =====================================
            // SAVE TOKEN
            // =====================================
            // Keep this for API compatibility

            if (data.token) {
                localStorage.setItem("token", data.token);
            }

            // =====================================
            // LOGIN SUCCESS
            // =====================================

            alert(data.message || "Login successful!");

            // =====================================
            // GO TO CART
            // =====================================

            window.location.href = "/customer/cart";

        } catch (error) {

            console.error("LOGIN ERROR:", error);

            alert("Unable to connect to server.");

        }

    });

});