// ======================================================
// GHARSETU - RESTAURANT JAVASCRIPT
// ======================================================


// ======================================================
// PAGE LOADER
// ======================================================

window.addEventListener("load", () => {

    const loader =
        document.getElementById("pageLoader");

    if (loader) {

        setTimeout(() => {

            loader.classList.add("hide");

        }, 300);

    }

});


// ======================================================
// COMMON API HELPER
// ======================================================

async function restaurantAPI(url, options = {}) {

    try {

        const response =
            await fetch(url, options);

        const contentType =
            response.headers.get("content-type") || "";

        let data;

        if (contentType.includes("application/json")) {

            data = await response.json();

        } else {

            data = {
                success: response.ok,
                message: await response.text()
            };

        }

        if (!response.ok) {

            throw new Error(
                data.message ||
                "Something went wrong"
            );

        }

        return data;

    } catch (error) {

        console.error(
            "Restaurant API Error:",
            error
        );

        throw error;

    }

}


// ======================================================
// DASHBOARD
// ======================================================

function refreshRestaurantDashboard() {

    window.location.href =
        "/restaurant/dashboard";

}


function openRestaurantOrders() {

    window.location.href =
        "/restaurant/orders";

}


function openRestaurantMenu() {

    window.location.href =
        "/restaurant/menu";

}


function openRestaurantCustomers() {

    window.location.href =
        "/restaurant/customers";

}


function openRestaurantEarnings() {

    window.location.href =
        "/restaurant/earnings";

}


function openRestaurantReviews() {

    window.location.href =
        "/restaurant/reviews";

}


function openRestaurantProfile() {

    window.location.href =
        "/restaurant/profile";

}


// ======================================================
// CUSTOMER SEARCH
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const searchInput =
            document.getElementById(
                "customerSearch"
            );

        const customerCards =
            document.querySelectorAll(
                ".customer-card"
            );

        const noSearchResult =
            document.getElementById(
                "noSearchResult"
            );


        if (
            !searchInput ||
            customerCards.length === 0
        ) {

            return;

        }


        searchInput.addEventListener(
            "input",
            function () {

                const search =
                    this.value
                        .trim()
                        .toLowerCase();

                let visibleCount = 0;


                customerCards.forEach(
                    card => {

                        const text =
                            (
                                card.dataset.customer ||
                                card.textContent ||
                                ""
                            ).toLowerCase();


                        if (
                            text.includes(search)
                        ) {

                            card.style.display =
                                "flex";

                            visibleCount++;

                        } else {

                            card.style.display =
                                "none";

                        }

                    }
                );


                if (noSearchResult) {

                    if (
                        search &&
                        visibleCount === 0
                    ) {

                        noSearchResult.classList.remove(
                            "hidden"
                        );

                    } else {

                        noSearchResult.classList.add(
                            "hidden"
                        );

                    }

                }

            }
        );

    }
);


// ======================================================
// VIEW CUSTOMER
// ======================================================

function viewCustomer(id) {

    if (!id) {

        alert(
            "Customer ID is not available."
        );

        return;

    }


    window.location.href =
        `/restaurant/customers/${id}`;

}


// ======================================================
// ORDER DETAILS
// ======================================================

function viewRestaurantOrder(id) {

    if (!id) {

        alert(
            "Order ID is not available."
        );

        return;

    }


    window.location.href =
        `/restaurant/orders/${id}`;

}


// ======================================================
// ORDER STATUS
// ======================================================

async function updateRestaurantOrderStatus(
    id,
    status
) {

    if (!id) {

        alert(
            "Order ID is missing."
        );

        return;

    }


    if (!status) {

        alert(
            "Please select order status."
        );

        return;

    }


    try {

        const data =
            await restaurantAPI(
                `/restaurant/orders/${id}/status`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        status
                    })
                }
            );


        alert(
            data.message ||
            "Order status updated successfully."
        );


        location.reload();


    } catch (error) {

        alert(
            error.message ||
            "Failed to update order status."
        );

    }

}


// ======================================================
// ACCEPT ORDER
// ======================================================

async function acceptRestaurantOrder(id) {

    return updateRestaurantOrderStatus(
        id,
        "accepted"
    );

}


// ======================================================
// START PREPARING
// ======================================================

async function startPreparingOrder(id) {

    return updateRestaurantOrderStatus(
        id,
        "preparing"
    );

}


// ======================================================
// MARK ORDER READY
// ======================================================

async function markOrderReady(id) {

    return updateRestaurantOrderStatus(
        id,
        "ready"
    );

}


// ======================================================
// COMPLETE ORDER
// ======================================================

async function completeRestaurantOrder(id) {

    const confirmComplete =
        confirm(
            "Mark this order as completed?"
        );


    if (!confirmComplete) {

        return;

    }


    return updateRestaurantOrderStatus(
        id,
        "completed"
    );

}


// ======================================================
// REJECT ORDER
// ======================================================

async function rejectRestaurantOrder(id) {

    const confirmReject =
        confirm(
            "Are you sure you want to reject this order?"
        );


    if (!confirmReject) {

        return;

    }


    return updateRestaurantOrderStatus(
        id,
        "rejected"
    );

}


// ======================================================
// ORDER SEARCH
// ======================================================

function setupOrderSearch() {

    const searchInput =
        document.getElementById(
            "orderSearch"
        );

    const orderCards =
        document.querySelectorAll(
            ".order-card"
        );

    const noResult =
        document.getElementById(
            "noOrderSearchResult"
        );


    if (!searchInput) {

        return;

    }


    searchInput.addEventListener(
        "input",
        function () {

            const search =
                this.value
                    .trim()
                    .toLowerCase();

            let visible = 0;


            orderCards.forEach(
                card => {

                    const text =
                        (
                            card.textContent ||
                            ""
                        ).toLowerCase();


                    if (
                        text.includes(search)
                    ) {

                        card.style.display =
                            "flex";

                        visible++;

                    } else {

                        card.style.display =
                            "none";

                    }

                }
            );


            if (noResult) {

                noResult.classList.toggle(
                    "hidden",
                    !search || visible > 0
                );

            }

        }
    );

}


document.addEventListener(
    "DOMContentLoaded",
    setupOrderSearch
);


// ======================================================
// ORDER STATUS FILTER
// ======================================================

function filterRestaurantOrders(status) {

    const orderCards =
        document.querySelectorAll(
            ".order-card"
        );


    orderCards.forEach(
        card => {

            const cardStatus =
                (
                    card.dataset.status ||
                    ""
                ).toLowerCase();


            if (
                !status ||
                status === "all" ||
                cardStatus ===
                status.toLowerCase()
            ) {

                card.style.display =
                    "flex";

            } else {

                card.style.display =
                    "none";

            }

        }
    );

}


// ======================================================
// MENU SEARCH
// ======================================================

function setupMenuSearch() {

    const searchInput =
        document.getElementById(
            "menuSearch"
        );

    const menuCards =
        document.querySelectorAll(
            ".menu-card"
        );

    const noResult =
        document.getElementById(
            "noMenuSearchResult"
        );


    if (!searchInput) {

        return;

    }


    searchInput.addEventListener(
        "input",
        function () {

            const search =
                this.value
                    .trim()
                    .toLowerCase();

            let visible = 0;


            menuCards.forEach(
                card => {

                    const text =
                        (
                            card.textContent ||
                            ""
                        ).toLowerCase();


                    if (
                        text.includes(search)
                    ) {

                        card.style.display =
                            "flex";

                        visible++;

                    } else {

                        card.style.display =
                            "none";

                    }

                }
            );


            if (noResult) {

                noResult.classList.toggle(
                    "hidden",
                    !search || visible > 0
                );

            }

        }
    );

}


document.addEventListener(
    "DOMContentLoaded",
    setupMenuSearch
);


// ======================================================
// MENU CATEGORY FILTER
// ======================================================

function filterMenu(category) {

    const menuCards =
        document.querySelectorAll(
            ".menu-card"
        );


    menuCards.forEach(
        card => {

            const cardCategory =
                (
                    card.dataset.category ||
                    ""
                ).toLowerCase();


            if (
                !category ||
                category === "all" ||
                cardCategory ===
                category.toLowerCase()
            ) {

                card.style.display =
                    "flex";

            } else {

                card.style.display =
                    "none";

            }

        }
    );

}


// ======================================================
// ADD MENU ITEM
// ======================================================

function openAddMenuForm() {

    const form =
        document.getElementById(
            "addMenuForm"
        );


    if (form) {

        form.classList.remove(
            "hidden"
        );

        form.scrollIntoView({
            behavior: "smooth"
        });

    }

}


// ======================================================
// CLOSE MENU FORM
// ======================================================

function closeAddMenuForm() {

    const form =
        document.getElementById(
            "addMenuForm"
        );


    if (form) {

        form.classList.add(
            "hidden"
        );

    }

}


// ======================================================
// EDIT MENU ITEM
// ======================================================

function editMenuItem(id) {

    if (!id) {

        alert(
            "Menu item ID is missing."
        );

        return;

    }


    alert(
        "Edit menu feature will be connected with Menu model."
    );

}


// ======================================================
// DELETE MENU ITEM
// ======================================================

function deleteMenuItem(id) {

    if (!id) {

        alert(
            "Menu item ID is missing."
        );

        return;

    }


    const confirmDelete =
        confirm(
            "Are you sure you want to delete this menu item?"
        );


    if (!confirmDelete) {

        return;

    }


    alert(
        "Delete API will be connected with Menu model."
    );

}


// ======================================================
// PROFILE EDIT
// ======================================================

function editRestaurantProfile() {

    const name =
        prompt(
            "Enter restaurant name:"
        );


    if (
        !name ||
        !name.trim()
    ) {

        return;

    }


    const email =
        prompt(
            "Enter email:"
        );


    const mobile =
        prompt(
            "Enter mobile number:"
        );


    const address =
        prompt(
            "Enter restaurant address:"
        );


    updateRestaurantProfile(
        name,
        email,
        mobile,
        address
    );

}


// ======================================================
// UPDATE PROFILE
// ======================================================

async function updateRestaurantProfile(
    name,
    email,
    mobile,
    address
) {

    try {

        const data =
            await restaurantAPI(
                "/restaurant/profile/update",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        name:
                            name.trim(),

                        email:
                            email
                                ? email.trim()
                                : "",

                        mobile:
                            mobile
                                ? mobile.trim()
                                : "",

                        address:
                            address
                                ? address.trim()
                                : ""

                    })
                }
            );


        alert(
            data.message ||
            "Profile updated successfully!"
        );


        location.reload();


    } catch (error) {

        alert(
            error.message ||
            "Failed to update profile."
        );

    }

}


// ======================================================
// RESTAURANT LOGIN
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const restaurantLoginForm =
            document.getElementById(
                "restaurantLoginForm"
            );


        if (!restaurantLoginForm) {

            return;

        }


        restaurantLoginForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                const mobile =
                    document.getElementById(
                        "loginMobile"
                    )?.value.trim();


                const password =
                    document.getElementById(
                        "loginPassword"
                    )?.value;


                if (
                    !mobile ||
                    !/^\d{10}$/.test(mobile)
                ) {

                    alert(
                        "Enter valid 10-digit mobile number."
                    );

                    return;

                }


                if (
                    !password ||
                    password.length < 6
                ) {

                    alert(
                        "Password must be at least 6 characters."
                    );

                    return;

                }


                try {

                    /*
                     * REAL BACKEND LOGIN
                     *
                     * No localStorage fake login.
                     */

                    const formData =
                        new URLSearchParams();

                    formData.append(
                        "mobile",
                        mobile
                    );

                    formData.append(
                        "password",
                        password
                    );


                    const response =
                        await fetch(
                            "/restaurant/login",
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/x-www-form-urlencoded"
                                },

                                body:
                                    formData
                            }
                        );


                    if (response.redirected) {

                        window.location.href =
                            response.url;

                        return;

                    }


                    const contentType =
                        response.headers.get(
                            "content-type"
                        ) || "";


                    if (
                        contentType.includes(
                            "text/html"
                        )
                    ) {

                        const html =
                            await response.text();

                        document.open();

                        document.write(
                            html
                        );

                        document.close();

                        return;

                    }


                    const data =
                        await response.json();


                    if (!response.ok) {

                        throw new Error(
                            data.message ||
                            "Login failed."
                        );

                    }


                    window.location.href =
                        "/restaurant/dashboard";


                } catch (error) {

                    console.error(
                        "Restaurant Login Error:",
                        error
                    );


                    alert(
                        error.message ||
                        "Restaurant login failed."
                    );

                }

            }
        );

    }
);


// ======================================================
// RESTAURANT SIGNUP + OTP
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const restaurantSignupForm =
            document.getElementById(
                "restaurantSignupForm"
            );


        if (!restaurantSignupForm) {

            return;

        }


        // ==============================================
        // ELEMENTS
        // ==============================================

        const restaurantNameInput =
            document.getElementById(
                "restaurantName"
            );


        const ownerNameInput =
            document.getElementById(
                "ownerName"
            );


        const contactInput =
            document.getElementById(
                "contact"
            );


        const sendOtpBtn =
            document.getElementById(
                "sendOtpBtn"
            );


        const otpSection =
            document.getElementById(
                "otpSection"
            );


        const otpInput =
            document.getElementById(
                "otp"
            );


        const verifyOtpSection =
            document.getElementById(
                "verifyOtpSection"
            );


        const verifyOtpBtn =
            document.getElementById(
                "verifyOtpBtn"
            );


        const contactMessage =
            document.getElementById(
                "contactMessage"
            );


        const otpMessage =
            document.getElementById(
                "otpMessage"
            );


        const passwordInput =
            document.getElementById(
                "password"
            );


        const confirmPasswordInput =
            document.getElementById(
                "confirmPassword"
            );


        const passwordMessage =
            document.getElementById(
                "passwordMessage"
            );


        const addressInput =
            document.getElementById(
                "address"
            );


        const createAccountBtn =
            document.getElementById(
                "createAccountBtn"
            );


        // ==============================================
        // OTP STATE
        // ==============================================

        let otpVerified = false;


        // ==============================================
        // INITIAL BUTTON STATE
        // ==============================================

        if (createAccountBtn) {

            createAccountBtn.disabled =
                true;

            createAccountBtn.style.opacity =
                "0.5";

            createAccountBtn.style.cursor =
                "not-allowed";

        }


        // ==============================================
        // CONTACT CHANGE
        // ==============================================

        if (contactInput) {

            contactInput.addEventListener(
                "input",
                () => {

                    otpVerified =
                        false;


                    if (createAccountBtn) {

                        createAccountBtn.disabled =
                            true;

                        createAccountBtn.style.opacity =
                            "0.5";

                        createAccountBtn.style.cursor =
                            "not-allowed";

                    }


                    if (otpSection) {

                        otpSection.style.display =
                            "none";

                    }


                    if (verifyOtpSection) {

                        verifyOtpSection.style.display =
                            "none";

                    }


                    if (otpInput) {

                        otpInput.value =
                            "";

                    }


                    if (otpMessage) {

                        otpMessage.textContent =
                            "Enter OTP after sending.";

                        otpMessage.style.color =
                            "";

                    }


                    if (contactMessage) {

                        contactMessage.textContent =
                            "Enter your email or 10-digit mobile number.";

                    }

                }
            );

        }


        // ==============================================
        // SEND OTP
        // ==============================================

        if (sendOtpBtn) {

            sendOtpBtn.addEventListener(
                "click",
                async () => {

                    const contact =
                        contactInput
                            ? contactInput.value.trim()
                            : "";


                    // ------------------------------
                    // VALIDATE CONTACT
                    // ------------------------------

                    const emailRegex =
                        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                    const mobileRegex =
                        /^\d{10}$/;


                    const isEmail =
                        emailRegex.test(
                            contact
                        );


                    const isMobile =
                        mobileRegex.test(
                            contact
                        );


                    if (
                        !isEmail &&
                        !isMobile
                    ) {

                        if (contactMessage) {

                            contactMessage.textContent =
                                "Please enter a valid email or 10-digit mobile number.";

                            contactMessage.style.color =
                                "red";

                        }

                        return;

                    }


                    // ------------------------------
                    // DISABLE BUTTON
                    // ------------------------------

                    sendOtpBtn.disabled =
                        true;

                    sendOtpBtn.textContent =
                        "Sending OTP...";


                    try {

                        const response =
                            await fetch(
                                "/restaurant/send-otp",
                                {

                                    method:
                                        "POST",

                                    headers: {

                                        "Content-Type":
                                            "application/json"

                                    },

                                    body:
                                        JSON.stringify({

                                            contact:
                                                contact

                                        })

                                }
                            );


                        const data =
                            await response.json();


                        // ------------------------------
                        // SUCCESS
                        // ------------------------------

                        if (
                            response.ok &&
                            data.success
                        ) {

                            otpVerified =
                                false;


                            if (otpSection) {

                                otpSection.style.display =
                                    "block";

                            }


                            if (verifyOtpSection) {

                                verifyOtpSection.style.display =
                                    "block";

                            }


                            if (otpMessage) {

                                otpMessage.textContent =
                                    "OTP sent successfully. Check your email.";

                                otpMessage.style.color =
                                    "";

                            }


                            if (contactMessage) {

                                contactMessage.textContent =
                                    "OTP has been sent successfully.";

                                contactMessage.style.color =
                                    "green";

                            }


                            if (otpInput) {

                                otpInput.focus();

                            }


                            return;

                        }


                        // ------------------------------
                        // ERROR
                        // ------------------------------

                        if (contactMessage) {

                            contactMessage.textContent =
                                data.message ||
                                "Failed to send OTP.";

                            contactMessage.style.color =
                                "red";

                        }


                    } catch (error) {

                        console.error(
                            "Send OTP Error:",
                            error
                        );


                        if (contactMessage) {

                            contactMessage.textContent =
                                "Unable to connect to server.";

                            contactMessage.style.color =
                                "red";

                        }

                    } finally {

                        sendOtpBtn.disabled =
                            false;

                        sendOtpBtn.textContent =
                            "Send OTP";

                    }

                }
            );

        }


        // ==============================================
        // VERIFY OTP
        // ==============================================

        if (verifyOtpBtn) {

            verifyOtpBtn.addEventListener(
                "click",
                async () => {

                    const contact =
                        contactInput
                            ? contactInput.value.trim()
                            : "";


                    const otp =
                        otpInput
                            ? otpInput.value.trim()
                            : "";


                    if (!contact) {

                        if (otpMessage) {

                            otpMessage.textContent =
                                "Please enter your email or mobile number.";

                            otpMessage.style.color =
                                "red";

                        }

                        return;

                    }


                    if (
                        !/^\d{6}$/.test(
                            otp
                        )
                    ) {

                        if (otpMessage) {

                            otpMessage.textContent =
                                "Please enter a valid 6-digit OTP.";

                            otpMessage.style.color =
                                "red";

                        }

                        return;

                    }


                    verifyOtpBtn.disabled =
                        true;

                    verifyOtpBtn.textContent =
                        "Verifying...";


                    try {

                        const response =
                            await fetch(
                                "/restaurant/verify-otp",
                                {

                                    method:
                                        "POST",

                                    headers: {

                                        "Content-Type":
                                            "application/json"

                                    },

                                    body:
                                        JSON.stringify({

                                            contact:
                                                contact,

                                            otp:
                                                otp

                                        })

                                }
                            );


                        const data =
                            await response.json();


                        // ------------------------------
                        // VERIFIED
                        // ------------------------------

                        if (
                            response.ok &&
                            data.success
                        ) {

                            otpVerified =
                                true;


                            if (otpMessage) {

                                otpMessage.textContent =
                                    "✅ OTP verified successfully.";

                                otpMessage.style.color =
                                    "green";

                            }


                            verifyOtpBtn.textContent =
                                "OTP Verified ✓";


                            verifyOtpBtn.disabled =
                                true;


                            sendOtpBtn.disabled =
                                true;


                            sendOtpBtn.textContent =
                                "OTP Verified";


                            contactInput.readOnly =
                                true;


                            if (createAccountBtn) {

                                createAccountBtn.disabled =
                                    false;

                                createAccountBtn.style.opacity =
                                    "1";

                                createAccountBtn.style.cursor =
                                    "pointer";

                            }


                            return;

                        }


                        // ------------------------------
                        // INVALID OTP
                        // ------------------------------

                        if (otpMessage) {

                            otpMessage.textContent =
                                data.message ||
                                "Invalid or expired OTP.";

                            otpMessage.style.color =
                                "red";

                        }


                    } catch (error) {

                        console.error(
                            "Verify OTP Error:",
                            error
                        );


                        if (otpMessage) {

                            otpMessage.textContent =
                                "Unable to connect to server.";

                            otpMessage.style.color =
                                "red";

                        }

                    } finally {

                        if (!otpVerified) {

                            verifyOtpBtn.disabled =
                                false;

                            verifyOtpBtn.textContent =
                                "Verify OTP";

                        }

                    }

                }
            );

        }


        // ==============================================
        // PASSWORD MATCH
        // ==============================================

        function checkPasswords() {

            const password =
                passwordInput
                    ? passwordInput.value
                    : "";


            const confirmPassword =
                confirmPasswordInput
                    ? confirmPasswordInput.value
                    : "";


            if (!confirmPassword) {

                if (passwordMessage) {

                    passwordMessage.textContent =
                        "";

                }

                return;

            }


            if (
                password !==
                confirmPassword
            ) {

                if (passwordMessage) {

                    passwordMessage.textContent =
                        "Passwords do not match.";

                    passwordMessage.style.color =
                        "red";

                }

            } else {

                if (passwordMessage) {

                    passwordMessage.textContent =
                        "Passwords match ✓";

                    passwordMessage.style.color =
                        "green";

                }

            }

        }


        if (passwordInput) {

            passwordInput.addEventListener(
                "input",
                checkPasswords
            );

        }


        if (confirmPasswordInput) {

            confirmPasswordInput.addEventListener(
                "input",
                checkPasswords
            );

        }


        // ==============================================
        // FINAL SIGNUP
        // ==============================================

        restaurantSignupForm.addEventListener(
            "submit",
            async (event) => {

                event.preventDefault();


                // ------------------------------
                // OTP CHECK
                // ------------------------------

                if (!otpVerified) {

                    alert(
                        "Please verify OTP before creating your restaurant account."
                    );

                    return;

                }


                // ------------------------------
                // GET VALUES
                // ------------------------------

                const restaurantName =
                    restaurantNameInput
                        ? restaurantNameInput.value.trim()
                        : "";


                const ownerName =
                    ownerNameInput
                        ? ownerNameInput.value.trim()
                        : "";


                const contact =
                    contactInput
                        ? contactInput.value.trim()
                        : "";


                const password =
                    passwordInput
                        ? passwordInput.value
                        : "";


                const confirmPassword =
                    confirmPasswordInput
                        ? confirmPasswordInput.value
                        : "";


                const address =
                    addressInput
                        ? addressInput.value.trim()
                        : "";


                // ------------------------------
                // VALIDATION
                // ------------------------------

                if (
                    !restaurantName ||
                    restaurantName.length < 2
                ) {

                    alert(
                        "Please enter a valid restaurant name."
                    );

                    return;

                }


                if (
                    !ownerName ||
                    ownerName.length < 2
                ) {

                    alert(
                        "Please enter a valid owner name."
                    );

                    return;

                }


                if (!contact) {

                    alert(
                        "Please enter email or mobile number."
                    );

                    return;

                }


                if (
                    !password ||
                    password.length < 6
                ) {

                    alert(
                        "Password must be at least 6 characters."
                    );

                    return;

                }


                if (
                    password !==
                    confirmPassword
                ) {

                    alert(
                        "Passwords do not match."
                    );

                    return;

                }


                if (!address) {

                    alert(
                        "Please enter restaurant address."
                    );

                    return;

                }


                // ------------------------------
                // DISABLE BUTTON
                // ------------------------------

                createAccountBtn.disabled =
                    true;

                createAccountBtn.textContent =
                    "Creating Account...";


                try {

                    // --------------------------
                    // REAL BACKEND SIGNUP
                    // --------------------------

                    const formData =
                        new URLSearchParams();


                    formData.append(
                        "restaurantName",
                        restaurantName
                    );


                    formData.append(
                        "name",
                        ownerName
                    );


                    formData.append(
                        "contact",
                        contact
                    );


                    formData.append(
                        "password",
                        password
                    );


                    formData.append(
                        "confirmPassword",
                        confirmPassword
                    );


                    formData.append(
                        "address",
                        address
                    );


                    const response =
                        await fetch(
                            "/restaurant/signup",
                            {

                                method:
                                    "POST",

                                headers: {

                                    "Content-Type":
                                        "application/x-www-form-urlencoded"

                                },

                                body:
                                    formData

                            }
                        );


                    // --------------------------
                    // SUCCESS / REDIRECT
                    // --------------------------

                    if (response.redirected) {

                        window.location.href =
                            response.url;

                        return;

                    }


                    const contentType =
                        response.headers.get(
                            "content-type"
                        ) || "";


                    if (
                        contentType.includes(
                            "text/html"
                        )
                    ) {

                        const html =
                            await response.text();


                        document.open();

                        document.write(
                            html
                        );

                        document.close();

                        return;

                    }


                    const data =
                        await response.json();


                    if (!response.ok) {

                        throw new Error(
                            data.message ||
                            "Restaurant signup failed."
                        );

                    }


                    alert(
                        data.message ||
                        "Restaurant account created successfully."
                    );


                    window.location.href =
                        "/restaurant/login";


                } catch (error) {

                    console.error(
                        "Restaurant Signup Error:",
                        error
                    );


                    alert(
                        error.message ||
                        "Restaurant signup failed."
                    );


                    createAccountBtn.disabled =
                        false;

                    createAccountBtn.textContent =
                        "Create Restaurant Account";

                }

            }
        );

    }
);


// ======================================================
// RESTAURANT LOGOUT
// ======================================================

function restaurantLogout() {

    const confirmLogout =
        confirm(
            "Are you sure you want to logout?"
        );


    if (!confirmLogout) {

        return;

    }


    /*
     * Backend logout clears
     * restaurantToken cookie.
     */

    window.location.href =
        "/restaurant/logout";

}


// ======================================================
// REVIEWS
// ======================================================

function setupReviewSearch() {

    const searchInput =
        document.getElementById(
            "reviewSearch"
        );

    const reviewCards =
        document.querySelectorAll(
            ".review-card, .feedback-card"
        );


    if (!searchInput) {

        return;

    }


    searchInput.addEventListener(
        "input",
        function () {

            const search =
                this.value
                    .trim()
                    .toLowerCase();


            reviewCards.forEach(
                card => {

                    const text =
                        (
                            card.textContent ||
                            ""
                        ).toLowerCase();


                    if (
                        text.includes(search)
                    ) {

                        card.style.display =
                            "block";

                    } else {

                        card.style.display =
                            "none";

                    }

                }
            );

        }
    );

}


document.addEventListener(
    "DOMContentLoaded",
    setupReviewSearch
);


// ======================================================
// RATING FILTER
// ======================================================

function filterReviews(rating) {

    const reviews =
        document.querySelectorAll(
            ".review-card, .feedback-card"
        );


    reviews.forEach(
        review => {

            const reviewRating =
                Number(
                    review.dataset.rating ||
                    0
                );


            if (
                !rating ||
                rating === "all" ||
                Number(rating) ===
                reviewRating
            ) {

                review.style.display =
                    "block";

            } else {

                review.style.display =
                    "none";

            }

        }
    );

}


// ======================================================
// EARNINGS
// ======================================================

function refreshRestaurantEarnings() {

    window.location.href =
        "/restaurant/earnings";

}


// ======================================================
// SIDEBAR ACTIVE LINK
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const currentPath =
            window.location.pathname;


        const sidebarLinks =
            document.querySelectorAll(
                ".restaurant-sidebar a, .sidebar a"
            );


        sidebarLinks.forEach(
            link => {

                const href =
                    link.getAttribute(
                        "href"
                    );


                if (
                    href &&
                    href !== "/" &&
                    currentPath === href
                ) {

                    link.classList.add(
                        "active"
                    );

                }

            }
        );

    }
);


// ======================================================
// PREVENT DOUBLE SUBMIT
// ======================================================

document.addEventListener(
    "submit",
    event => {

        const form =
            event.target;


        if (
            !form ||
            !form.matches("form")
        ) {

            return;

        }


        /*
         * OTP signup and login are handled
         * separately above.
         *
         * Do not disable buttons here because
         * backend requests may still be running.
         */

    }
);


// ======================================================
// GLOBAL ERROR HANDLER
// ======================================================

window.addEventListener(
    "error",
    event => {

        console.error(
            "Restaurant JS Error:",
            event.error
        );

    }
);


// ======================================================
// END
// ======================================================