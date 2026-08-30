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


    /*
     * DELETE API will be connected
     * after Menu model CRUD routes.
     */

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

const restaurantLoginForm =
    document.getElementById(
        "restaurantLoginForm"
    );


if (restaurantLoginForm) {

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


            /*
             * Actual login API depends on
             * restaurant authentication route.
             */

            localStorage.setItem(
                "restaurantMobile",
                mobile
            );

            localStorage.setItem(
                "restaurantLoggedIn",
                "true"
            );


            alert(
                "Login successful!"
            );


            window.location.href =
                "/restaurant/dashboard";

        }
    );

}


// ======================================================
// RESTAURANT SIGNUP
// ======================================================

const restaurantSignupForm =
    document.getElementById(
        "restaurantSignupForm"
    );


if (restaurantSignupForm) {

    restaurantSignupForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const name =
                document.getElementById(
                    "signupName"
                )?.value.trim();


            const email =
                document.getElementById(
                    "signupEmail"
                )?.value.trim();


            const mobile =
                document.getElementById(
                    "signupMobile"
                )?.value.trim();


            const password =
                document.getElementById(
                    "signupPassword"
                )?.value;


            if (
                !name ||
                name.length < 2
            ) {

                alert(
                    "Enter restaurant name."
                );

                return;

            }


            if (
                !email ||
                !email.includes("@")
            ) {

                alert(
                    "Enter valid email."
                );

                return;

            }


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


            /*
             * Actual signup API will be connected
             * with authentication backend.
             */

            localStorage.setItem(
                "restaurantName",
                name
            );

            localStorage.setItem(
                "restaurantEmail",
                email
            );

            localStorage.setItem(
                "restaurantMobile",
                mobile
            );


            alert(
                "Restaurant account created successfully!"
            );


            window.location.href =
                "/restaurant/login";

        }
    );

}


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


    localStorage.removeItem(
        "restaurantLoggedIn"
    );

    localStorage.removeItem(
        "restaurantMobile"
    );

    localStorage.removeItem(
        "restaurantName"
    );

    localStorage.removeItem(
        "restaurantEmail"
    );


    window.location.href =
        "/restaurant/login";

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


        const submitButton =
            form.querySelector(
                'button[type="submit"]'
            );


        if (!submitButton) {

            return;

        }


        setTimeout(() => {

            submitButton.disabled =
                true;

        }, 10);

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