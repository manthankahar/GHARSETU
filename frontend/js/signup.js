const signupForm = document.getElementById("signupForm");

const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");

const togglePassword = document.getElementById("togglePassword");
const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");

const signupButton = document.getElementById("signupButton");

const toast = document.getElementById("toast");


// =====================================
// TOAST
// =====================================

function showToast(message) {
    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}


// =====================================
// PASSWORD TOGGLE
// =====================================

togglePassword.addEventListener("click", () => {

    if (password.type === "password") {
        password.type = "text";
        togglePassword.textContent = "🙈";
    } else {
        password.type = "password";
        togglePassword.textContent = "👁";
    }

});


toggleConfirmPassword.addEventListener("click", () => {

    if (confirmPassword.type === "password") {
        confirmPassword.type = "text";
        toggleConfirmPassword.textContent = "🙈";
    } else {
        confirmPassword.type = "password";
        toggleConfirmPassword.textContent = "👁";
    }

});


// =====================================
// SIGNUP
// =====================================

signupForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const mobile = document.getElementById("mobile").value.trim();
    const passwordValue = password.value;
    const confirmPasswordValue = confirmPassword.value;


    // Password match
    if (passwordValue !== confirmPasswordValue) {
        showToast("Passwords do not match");
        return;
    }


    // Mobile validation
    if (!/^[0-9]{10}$/.test(mobile)) {
        showToast("Enter a valid 10-digit mobile number");
        return;
    }


    signupButton.disabled = true;
    signupButton.textContent = "Creating Account...";


    try {

        const response = await fetch("/api/auth/signup", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                name,
                email,
                mobile,
                password: passwordValue
            })

        });


        const data = await response.json();


        if (data.success) {

            showToast("Account created successfully!");

            signupForm.reset();

            setTimeout(() => {
                window.location.href = "/customer/login";
            }, 1200);

        } else {

            showToast(data.message || "Signup failed");

        }

    } catch (error) {

        console.error("Signup Error:", error);

        showToast("Unable to connect to server");

    } finally {

        signupButton.disabled = false;
        signupButton.textContent = "Create Account";

    }

});