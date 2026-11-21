
"use strict";

const createModal = document.getElementById("createCouponModal");
const viewModal = document.getElementById("viewCouponModal");
const createForm = document.getElementById("createCouponForm");

function openCreateCoupon() {
    createModal?.classList.add("show");
}

function closeCreateCoupon() {
    createModal?.classList.remove("show");
}

function closeViewCoupon() {
    viewModal?.classList.remove("show");
}

function formatDate(dateValue) {
    if (!dateValue) return "-";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) return "-";

    return date.toLocaleDateString("en-IN");
}

function setText(id, value) {
    const element = document.getElementById(id);

    if (element) {
        element.textContent = value ?? "-";
    }
}

function displayCoupon(coupon) {
    setText("detailCode", coupon.code || "COUPON");
    setText("detailName", coupon.name || "Discount Campaign");

    const discount = coupon.discountType === "percentage"
        ? `${Number(coupon.discountValue) || 0}%`
        : `₹${Number(coupon.discountValue) || 0}`;

    setText("detailDiscount", discount);
    setText("detailMinimum", `₹${Number(coupon.minimumOrder) || 0}`);

    setText(
        "detailMaximum",
        coupon.maximumDiscount !== undefined &&
        coupon.maximumDiscount !== null &&
        coupon.maximumDiscount !== ""
            ? `₹${coupon.maximumDiscount}`
            : "-"
    );

    const used = Number(coupon.usedCount) || 0;
    const limit = Number(coupon.usageLimit) || 0;

    setText("detailUsage", `${used} / ${limit > 0 ? limit : "∞"}`);

    const status = coupon.status || "active";

    setText(
        "detailStatus",
        status.charAt(0).toUpperCase() + status.slice(1)
    );

    setText("detailStart", formatDate(coupon.startDate));
    setText("detailExpiry", formatDate(coupon.expiryDate));

    viewModal?.classList.add("show");
}

function viewCoupon(id) {
    fetch(`/admin/coupons/${encodeURIComponent(id)}`, {
        headers: {
            Accept: "application/json"
        }
    })
        .then(async response => {
            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(data.message || "Failed to load coupon.");
            }

            return data;
        })
        .then(data => {
            if (!data.coupon) {
                throw new Error("Coupon data was not found.");
            }

            displayCoupon(data.coupon);
        })
        .catch(error => {
            console.error("View coupon error:", error);
            alert(error.message || "Coupon details could not be loaded.");
        });
}

function createCoupon(event) {
    event.preventDefault();

    const code = document.getElementById("couponCode").value
        .trim()
        .toUpperCase();

    const name = document.getElementById("couponName").value.trim();
    const type = document.getElementById("discountType").value;
    const value = Number(document.getElementById("discountValue").value);
    const minimum = Number(document.getElementById("minimumOrder").value);
    const maximumInput = document.getElementById("maximumDiscount").value;
    const startDate = document.getElementById("startDate").value;
    const expiryDate = document.getElementById("expiryDate").value;
    const usageInput = document.getElementById("usageLimit").value;
    const status = document.getElementById("couponStatus").value;
    const description = document.getElementById("couponDescription").value.trim();

    if (!code || !name || !Number.isFinite(value) || value <= 0) {
        alert("Please enter a valid coupon code, campaign name, and discount.");
        return;
    }

    if (type === "percentage" && value > 100) {
        alert("Percentage discount cannot be greater than 100%.");
        return;
    }

    if (new Date(expiryDate) < new Date(startDate)) {
        alert("Expiry date cannot be earlier than the start date.");
        return;
    }

    const coupon = {
        code,
        name,
        discountType: type,
        discountValue: value,
        minimumOrder: minimum,
        maximumDiscount: maximumInput === "" ? null : Number(maximumInput),
        startDate,
        expiryDate,
        usageLimit: usageInput === "" ? null : Number(usageInput),
        status,
        description
    };

    console.log("Demo coupon payload:", coupon);

    alert(
        `Coupon ${code} validated successfully in demo mode.\n\n` +
        "It has not been saved to MongoDB yet."
    );

    closeCreateCoupon();
    createForm?.reset();
}

function editCoupon(id) {
    alert(
        `Edit coupon: ${id}\n\n` +
        "Edit functionality needs a connected backend route."
    );
}

function deleteCoupon(id) {
    if (!confirm("Are you sure you want to delete this coupon?")) {
        return;
    }

    alert(
        `Delete coupon: ${id}\n\n` +
        "Delete functionality needs a connected backend route."
    );
}

createModal?.addEventListener("click", event => {
    if (event.target === createModal) {
        closeCreateCoupon();
    }
});

viewModal?.addEventListener("click", event => {
    if (event.target === viewModal) {
        closeViewCoupon();
    }
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closeCreateCoupon();
        closeViewCoupon();
    }
});
