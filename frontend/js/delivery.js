// =====================================
// GHARSETU - DELIVERY JAVASCRIPT
// =====================================


// =====================================
// PAGE LOADER
// =====================================

window.addEventListener("load", () => {

    const loader = document.getElementById("pageLoader");

    if (loader) {

        setTimeout(() => {
            loader.classList.add("hide");
        }, 300);

    }

});


// =====================================
// DELIVERY LOGIN
// =====================================

const loginForm =
    document.getElementById("deliveryLoginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const mobile =
            document.getElementById("loginMobile")
                ?.value
                .trim();

        const password =
            document.getElementById("loginPassword")
                ?.value
                .trim();


        if (!/^\d{10}$/.test(mobile)) {

            alert("Enter valid 10-digit mobile number");
            return;

        }


        if (password.length < 6) {

            alert("Password must be at least 6 characters");
            return;

        }


        localStorage.setItem(
            "deliveryLoggedIn",
            "true"
        );

        localStorage.setItem(
            "deliveryMobile",
            mobile
        );


        window.location.href =
            "/delivery/dashboard";

    });

}


// =====================================
// DELIVERY SIGNUP
// =====================================

const signupForm =
    document.getElementById("deliverySignupForm");

if (signupForm) {

    signupForm.addEventListener("submit", function (e) {

        e.preventDefault();


        const name =
            document.getElementById("signupName")
                ?.value
                .trim();

        const mobile =
            document.getElementById("signupMobile")
                ?.value
                .trim();

        const email =
            document.getElementById("signupEmail")
                ?.value
                .trim();

        const password =
            document.getElementById("signupPassword")
                ?.value;


        if (!name || name.length < 2) {

            alert("Please enter your full name");
            return;

        }


        if (!/^\d{10}$/.test(mobile)) {

            alert("Enter valid 10-digit mobile number");
            return;

        }


        if (!email || !email.includes("@")) {

            alert("Enter valid email");
            return;

        }


        if (!password || password.length < 6) {

            alert("Password must be at least 6 characters");
            return;

        }


        localStorage.setItem(
            "deliveryName",
            name
        );

        localStorage.setItem(
            "deliveryMobile",
            mobile
        );

        localStorage.setItem(
            "deliveryEmail",
            email
        );


        alert("Account created successfully!");


        window.location.href =
            "/delivery/login";

    });

}


// =====================================
// ONLINE / OFFLINE
// =====================================

const onlineToggle =
    document.getElementById("onlineToggle");

const onlineText =
    document.getElementById("onlineText");


if (onlineToggle && onlineText) {

    let online =
        localStorage.getItem("deliveryOnline") === "true";


    function updateOnlineUI() {

        if (online) {

            onlineToggle.classList.add("active");

            onlineText.textContent =
                "You are Online";

        } else {

            onlineToggle.classList.remove("active");

            onlineText.textContent =
                "You are Offline";

        }

    }


    updateOnlineUI();


    onlineToggle.addEventListener("click", () => {

        online = !online;

        localStorage.setItem(
            "deliveryOnline",
            online
        );

        updateOnlineUI();

    });

}


// =====================================
// GET ACTIVE DELIVERY ID
// =====================================

function getActiveDeliveryId() {

    return localStorage.getItem(
        "activeDeliveryId"
    );

}


// =====================================
// OPEN ORDER
// =====================================

function openOrder(id) {

    if (!id) {

        alert("Delivery ID is missing.");
        return;

    }


    localStorage.setItem(
        "selectedDeliveryOrder",
        id
    );


    window.location.href =
        `/delivery/active/${id}`;

}


// =====================================
// ACCEPT DELIVERY
// =====================================

async function acceptDelivery(id) {

    if (!id) {

        alert("Delivery ID is missing.");
        return;

    }


    const confirmAccept =
        confirm("Accept this delivery?");


    if (!confirmAccept) {
        return;
    }


    try {

        const response =
            await fetch(
                `/delivery/${id}/accept`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );


        const data =
            await response.json();


        if (!response.ok || !data.success) {

            alert(
                data.message ||
                "Failed to accept delivery."
            );

            return;

        }


        // =================================
        // SAVE REAL MONGODB DELIVERY ID
        // =================================

        const deliveryId =
            data.delivery?._id || id;


        localStorage.setItem(
            "activeDeliveryId",
            deliveryId
        );

        localStorage.setItem(
            "selectedDeliveryOrder",
            deliveryId
        );


        alert(
            "Delivery accepted successfully!"
        );


        // =================================
        // OPEN ACTIVE DELIVERY
        // =================================

        window.location.href =
            `/delivery/active/${deliveryId}`;


    } catch (error) {

        console.error(
            "Accept Delivery Error:",
            error
        );


        alert(
            "Unable to accept delivery. Please try again."
        );

    }

}


// =====================================
// REJECT DELIVERY
// =====================================

async function rejectDelivery(id) {

    if (!id) {

        alert("Delivery ID is missing.");
        return;

    }


    const confirmReject =
        confirm(
            "Are you sure you want to reject this delivery?"
        );


    if (!confirmReject) {
        return;
    }


    try {

        const response =
            await fetch(
                `/delivery/${id}/reject`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );


        const data =
            await response.json();


        if (!response.ok || !data.success) {

            alert(
                data.message ||
                "Failed to reject delivery."
            );

            return;

        }


        localStorage.removeItem(
            "selectedDeliveryOrder"
        );

        localStorage.removeItem(
            "activeDeliveryId"
        );


        alert(
            "Delivery rejected successfully."
        );


        window.location.href =
            "/delivery/dashboard";


    } catch (error) {

        console.error(
            "Reject Delivery Error:",
            error
        );


        alert(
            "Unable to reject delivery. Please try again."
        );

    }

}


// =====================================
// REACHED RESTAURANT
// =====================================

async function reachedRestaurant(id) {

    const deliveryId =
        id || getActiveDeliveryId();


    if (!deliveryId) {

        alert("Active delivery not found.");
        return;

    }


    try {

        const response =
            await fetch(
                `/delivery/${deliveryId}/reached-restaurant`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );


        const data =
            await response.json();


        if (!response.ok || !data.success) {

            alert(
                data.message ||
                "Unable to update restaurant status."
            );

            return;

        }


        localStorage.setItem(
            "activeDeliveryId",
            deliveryId
        );


        alert(
            "Restaurant reached successfully!"
        );


        window.location.href =
            `/delivery/pickup/${deliveryId}`;


    } catch (error) {

        console.error(
            "Reached Restaurant Error:",
            error
        );


        alert(
            "Something went wrong. Please try again."
        );

    }

}


// =====================================
// GO TO PICKUP
// =====================================

function goToPickup(id) {

    const deliveryId =
        id || getActiveDeliveryId();


    if (!deliveryId) {

        alert("Active delivery not found.");
        return;

    }


    window.location.href =
        `/delivery/pickup/${deliveryId}`;

}


// =====================================
// SHOW OTP BOX
// =====================================

function showOTP() {

    const otpBox =
        document.getElementById("otpBox");

    const cameraBox =
        document.getElementById("cameraBox");


    if (otpBox) {
        otpBox.classList.remove("hidden");
    }


    if (cameraBox) {
        cameraBox.classList.add("hidden");
    }

}


// =====================================
// PICKUP CAMERA
// =====================================

let pickupStream = null;


async function openPickupCamera() {

    const cameraBox =
        document.getElementById("cameraBox");

    const video =
        document.getElementById("pickupCamera");

    const otpBox =
        document.getElementById("otpBox");


    if (!video) {

        alert("Camera element not found.");
        return;

    }


    if (otpBox) {
        otpBox.classList.add("hidden");
    }


    if (cameraBox) {
        cameraBox.classList.remove("hidden");
    }


    try {

        pickupStream =
            await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: "environment"
                },
                audio: false
            });


        video.srcObject =
            pickupStream;


        await video.play();


    } catch (error) {

        console.error(
            "Camera Error:",
            error
        );


        alert(
            "Camera permission is required for photo verification."
        );

    }

}


// =====================================
// CAPTURE PICKUP PHOTO
// =====================================

function capturePickupPhoto() {

    const video =
        document.getElementById("pickupCamera");

    const canvas =
        document.getElementById("pickupCanvas");

    const preview =
        document.getElementById("pickupPreview");

    const captureButton =
        document.getElementById("captureButton");

    const retakeButton =
        document.getElementById("retakeButton");

    const verifyButton =
        document.getElementById("verifyPhotoButton");


    if (!video || !canvas) {

        alert("Camera not ready.");
        return;

    }


    if (!video.videoWidth || !video.videoHeight) {

        alert("Camera is not ready yet.");
        return;

    }


    canvas.width =
        video.videoWidth;

    canvas.height =
        video.videoHeight;


    const context =
        canvas.getContext("2d");


    context.drawImage(
        video,
        0,
        0,
        canvas.width,
        canvas.height
    );


    const photo =
        canvas.toDataURL(
            "image/jpeg",
            0.85
        );


    if (preview) {

        preview.src =
            photo;

        preview.classList.remove(
            "hidden"
        );

    }


    video.classList.add(
        "hidden"
    );


    if (captureButton) {

        captureButton.classList.add(
            "hidden"
        );

    }


    if (retakeButton) {

        retakeButton.classList.remove(
            "hidden"
        );

    }


    if (verifyButton) {

        verifyButton.classList.remove(
            "hidden"
        );

    }


    // Stop camera

    stopPickupCamera();

}


// =====================================
// STOP PICKUP CAMERA
// =====================================

function stopPickupCamera() {

    if (pickupStream) {

        pickupStream
            .getTracks()
            .forEach(track => {
                track.stop();
            });


        pickupStream = null;

    }

}


// =====================================
// RETAKE PHOTO
// =====================================

function retakePickupPhoto() {

    const video =
        document.getElementById("pickupCamera");

    const preview =
        document.getElementById("pickupPreview");

    const captureButton =
        document.getElementById("captureButton");

    const retakeButton =
        document.getElementById("retakeButton");

    const verifyButton =
        document.getElementById("verifyPhotoButton");


    if (preview) {

        preview.src = "";

        preview.classList.add(
            "hidden"
        );

    }


    if (video) {

        video.classList.remove(
            "hidden"
        );

    }


    if (captureButton) {

        captureButton.classList.remove(
            "hidden"
        );

    }


    if (retakeButton) {

        retakeButton.classList.add(
            "hidden"
        );

    }


    if (verifyButton) {

        verifyButton.classList.add(
            "hidden"
        );

    }


    openPickupCamera();

}


// =====================================
// VERIFY PICKUP OTP
// =====================================

async function verifyPickupOTP(id) {

    const deliveryId =
        id || getActiveDeliveryId();


    const otpInput =
        document.getElementById("pickupOtp");


    if (!deliveryId) {

        alert("Delivery ID missing.");
        return;

    }


    if (!otpInput) {

        alert("OTP input not found.");
        return;

    }


    const otp =
        otpInput.value.trim();


    if (!/^\d{4,6}$/.test(otp)) {

        alert(
            "Please enter a valid OTP."
        );

        return;

    }


    try {

        const response =
            await fetch(
                `/delivery/${deliveryId}/pickup-otp`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        otp
                    })
                }
            );


        const data =
            await response.json();


        if (!response.ok || !data.success) {

            alert(
                data.message ||
                "OTP verification failed."
            );

            return;

        }


        alert(
            "Pickup verified successfully!"
        );


        showPickupSuccess();


    } catch (error) {

        console.error(
            "OTP Verification Error:",
            error
        );


        alert(
            "Something went wrong while verifying OTP."
        );

    }

}


// =====================================
// VERIFY PICKUP PHOTO
// =====================================

async function verifyPickupPhoto(id) {

    const deliveryId =
        id || getActiveDeliveryId();


    const canvas =
        document.getElementById("pickupCanvas");


    if (!deliveryId) {

        alert("Delivery ID missing.");
        return;

    }


    if (!canvas || !canvas.width) {

        alert(
            "Please capture a photo first."
        );

        return;

    }


    try {

        // =================================
        // Convert Canvas → Blob
        // Backend expects multipart/form-data
        // =================================

        canvas.toBlob(
            async function (blob) {

                if (!blob) {

                    alert(
                        "Unable to create photo."
                    );

                    return;

                }


                const formData =
                    new FormData();


                formData.append(
                    "photo",
                    blob,
                    "pickup-photo.jpg"
                );


                try {

                    const response =
                        await fetch(
                            `/delivery/${deliveryId}/pickup-photo`,
                            {
                                method: "POST",
                                body: formData
                            }
                        );


                    const data =
                        await response.json();


                    if (
                        !response.ok ||
                        !data.success
                    ) {

                        alert(
                            data.message ||
                            "Photo verification failed."
                        );

                        return;

                    }


                    alert(
                        "Pickup photo verified successfully!"
                    );


                    showPickupSuccess();


                } catch (error) {

                    console.error(
                        "Photo Upload Error:",
                        error
                    );


                    alert(
                        "Something went wrong while uploading photo."
                    );

                }

            },
            "image/jpeg",
            0.85
        );


    } catch (error) {

        console.error(
            "Photo Verification Error:",
            error
        );


        alert(
            "Something went wrong while verifying photo."
        );

    }

}


// =====================================
// PICKUP SUCCESS
// =====================================

function showPickupSuccess() {

    const otpBox =
        document.getElementById("otpBox");

    const cameraBox =
        document.getElementById("cameraBox");

    const successBox =
        document.getElementById("pickupSuccess");


    if (otpBox) {

        otpBox.classList.add(
            "hidden"
        );

    }


    if (cameraBox) {

        cameraBox.classList.add(
            "hidden"
        );

    }


    stopPickupCamera();


    if (successBox) {

        successBox.classList.remove(
            "hidden"
        );

    }

}


// =====================================
// CONTINUE DELIVERY
// =====================================

function continueToLocation(id) {

    const deliveryId =
        id || getActiveDeliveryId();


    if (!deliveryId) {

        alert("Delivery ID missing.");
        return;

    }


    localStorage.setItem(
        "activeDeliveryId",
        deliveryId
    );


    window.location.href =
        `/delivery/active/${deliveryId}`;

}


// =====================================
// REACHED CUSTOMER LOCATION
// =====================================

async function reachedCustomerLocation(id) {

    const deliveryId =
        id || getActiveDeliveryId();


    if (!deliveryId) {

        alert("Delivery ID missing.");
        return;

    }


    try {

        const response =
            await fetch(
                `/delivery/${deliveryId}/reached-location`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    }
                }
            );


        const data =
            await response.json();


        if (!response.ok || !data.success) {

            alert(
                data.message ||
                "Unable to update location."
            );

            return;

        }


        alert(
            "Customer location reached!"
        );


        window.location.href =
            `/delivery/complete/${deliveryId}`;


    } catch (error) {

        console.error(
            "Reached Customer Location Error:",
            error
        );


        alert(
            "Something went wrong. Please try again."
        );

    }

}


// =====================================
// ALIAS
// =====================================

async function reachedLocation(id) {

    return reachedCustomerLocation(id);

}


// =====================================
// PAYMENT
// =====================================

let selectedPayment = null;


function selectPayment(method) {

    if (
        method !== "cash" &&
        method !== "online"
    ) {

        return;

    }


    selectedPayment =
        method;


    const cashButton =
        document.getElementById(
            "cashPaymentBtn"
        );

    const onlineButton =
        document.getElementById(
            "onlinePaymentBtn"
        );

    const qrBox =
        document.getElementById(
            "demoQrBox"
        );

    const completeButton =
        document.getElementById(
            "completeDeliveryBtn"
        );


    // Reset

    if (cashButton) {

        cashButton.classList.remove(
            "selected"
        );

    }


    if (onlineButton) {

        onlineButton.classList.remove(
            "selected"
        );

    }


    // Cash

    if (method === "cash") {

        if (cashButton) {

            cashButton.classList.add(
                "selected"
            );

        }


        if (qrBox) {

            qrBox.style.display =
                "none";

        }

    }


    // Online

    if (method === "online") {

        if (onlineButton) {

            onlineButton.classList.add(
                "selected"
            );

        }


        if (qrBox) {

            qrBox.style.display =
                "block";

        }

    }


    if (completeButton) {

        completeButton.disabled =
            false;

    }

}


// =====================================
// COMPLETE DELIVERY
// =====================================

async function completeDelivery(id) {

    const deliveryId =
        id || getActiveDeliveryId();


    if (!deliveryId) {

        alert("Delivery ID missing.");
        return;

    }


    if (!selectedPayment) {

        alert(
            "Please select Cash or Online."
        );

        return;

    }


    const amountElement =
        document.querySelector(
            ".payment-amount strong"
        );


    let orderAmount = 0;


    if (amountElement) {

        orderAmount =
            Number(
                amountElement.textContent
                    .replace(/[^\d.]/g, "")
            );

    }


    const confirmComplete =
        confirm(
            `Complete delivery with ${selectedPayment.toUpperCase()} payment?`
        );


    if (!confirmComplete) {
        return;
    }


    try {

        const response =
            await fetch(
                `/delivery/${deliveryId}/complete`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        paymentMethod:
                            selectedPayment,

                        orderAmount:
                            orderAmount

                    })
                }
            );


        const data =
            await response.json();


        if (!response.ok || !data.success) {

            alert(
                data.message ||
                "Failed to complete delivery."
            );

            return;

        }


        showDeliverySuccess(data);


    } catch (error) {

        console.error(
            "Complete Delivery Error:",
            error
        );


        alert(
            "Something went wrong while completing delivery."
        );

    }

}


// =====================================
// DELIVERY SUCCESS POPUP
// =====================================

function showDeliverySuccess(data) {

    const popup =
        document.getElementById(
            "deliverySuccessPopup"
        );

    const earning =
        document.getElementById(
            "successEarning"
        );

    const paymentText =
        document.getElementById(
            "successPaymentText"
        );


    if (!popup) {

        alert(
            `Delivery completed successfully!\nEarning: ₹${data.earning || 0}`
        );

        return;

    }


    if (earning) {

        earning.textContent =
            `₹${data.earning || 0}`;

    }


    if (paymentText) {

        if (
            data.paymentMethod ===
            "cash"
        ) {

            paymentText.textContent =
                `Cash payment received. ₹${data.cashDeducted || 0} deducted from your earning.`;

        } else {

            paymentText.textContent =
                `Online payment received. ₹${data.onlineAdded || 0} added to your earning.`;

        }

    }


    popup.classList.add(
        "show"
    );

}


// =====================================
// CLOSE SUCCESS POPUP
// =====================================

function closeDeliverySuccess() {

    const popup =
        document.getElementById(
            "deliverySuccessPopup"
        );


    if (popup) {

        popup.classList.remove(
            "show"
        );

    }


    localStorage.removeItem(
        "activeDeliveryId"
    );

    localStorage.removeItem(
        "selectedDeliveryOrder"
    );


    setTimeout(() => {

        window.location.href =
            "/delivery/dashboard";

    }, 200);

}


// =====================================
// EDIT PROFILE
// =====================================

function editDeliveryProfile() {

    const name =
        prompt(
            "Enter your name:"
        );


    if (!name) {
        return;
    }


    const mobile =
        prompt(
            "Enter 10-digit mobile number:"
        );


    if (!/^\d{10}$/.test(mobile)) {

        alert(
            "Invalid mobile number"
        );

        return;

    }


    localStorage.setItem(
        "deliveryName",
        name.trim()
    );

    localStorage.setItem(
        "deliveryMobile",
        mobile
    );


    alert(
        "Profile updated successfully!"
    );


    location.reload();

}


// =====================================
// LOGOUT
// =====================================

function deliveryLogout() {

    const confirmLogout =
        confirm(
            "Are you sure you want to logout?"
        );


    if (!confirmLogout) {
        return;
    }


    localStorage.removeItem(
        "deliveryLoggedIn"
    );

    localStorage.removeItem(
        "deliveryOnline"
    );

    localStorage.removeItem(
        "activeDeliveryOrder"
    );

    localStorage.removeItem(
        "activeDeliveryId"
    );

    localStorage.removeItem(
        "selectedDeliveryOrder"
    );


    window.location.href =
        "/delivery/login";

}