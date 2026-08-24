document.addEventListener("DOMContentLoaded", () => {

    const form = document.querySelector("#loginForm");

    if (!form) return;

    form.addEventListener("submit", async (e) => {

        e.preventDefault();

        const email = form.querySelector("[name='email']").value.trim();
        const password = form.querySelector("[name='password']").value;

        if (!email || !password) {
            alert("Please enter email and password.");
            return;
        }

        try {

            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Login failed.");
                return;
            }

            if (data.token) {
                localStorage.setItem("token", data.token);
            }

            alert(data.message || "Login successful!");

            window.location.href = "/customer/home";

        } catch (error) {

            console.error("LOGIN ERROR:", error);

            alert("Unable to connect to server.");

        }

    });

});