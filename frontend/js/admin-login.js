
// ==========================================
// GHARSETU ADMIN LOGIN
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    const passwordInput = document.getElementById("password");
    const passwordToggle = document.getElementById("passwordToggle");
    const loginForm = document.getElementById("adminLoginForm");
    const mobileInput = document.getElementById("mobile");
    const forgotPasswordLink = document.getElementById("forgotPasswordLink");

    // ==========================================
    // PASSWORD SHOW / HIDE
    // ==========================================

    if (passwordInput && passwordToggle) {
        passwordToggle.addEventListener("click", () => {
            const isPasswordHidden = passwordInput.type === "password";

            passwordInput.type = isPasswordHidden ? "text" : "password";
            passwordToggle.textContent = isPasswordHidden ? "🙈" : "👁️";

            passwordToggle.setAttribute(
                "aria-label",
                isPasswordHidden ? "Hide password" : "Show password"
            );

            passwordToggle.setAttribute(
                "aria-pressed",
                String(isPasswordHidden)
            );
        });
    }

    // ==========================================
    // MOBILE INPUT
    // ==========================================

    if (mobileInput) {
        mobileInput.addEventListener("input", () => {
            // Allow digits only, with a maximum of 10 digits.
            mobileInput.value = mobileInput.value
                .replace(/\D/g, "")
                .slice(0, 10);
        });
    }

    // ==========================================
    // FORM VALIDATION
    // ==========================================

    if (loginForm && mobileInput && passwordInput) {
        loginForm.addEventListener("submit", (event) => {
            const mobile = mobileInput.value.trim();
            const password = passwordInput.value;

            if (!mobile) {
                event.preventDefault();
                alert("Please enter admin mobile number.");
                mobileInput.focus();
                return;
            }

            if (!/^[0-9]{10}$/.test(mobile)) {
                event.preventDefault();
                alert("Please enter a valid 10 digit mobile number.");
                mobileInput.focus();
                return;
            }

            if (!password) {
                event.preventDefault();
                alert("Please enter admin password.");
                passwordInput.focus();
                return;
            }

            if (password.length < 6) {
                event.preventDefault();
                alert("Password must be at least 6 characters.");
                passwordInput.focus();
            }
        });
    }

    // ==========================================
    // FORGOT PASSWORD
    // ==========================================

    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener("click", (event) => {
            event.preventDefault();

            alert("Forgot password feature is not configured yet.");
        });
    }
});
