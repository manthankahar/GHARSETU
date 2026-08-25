// =====================================
// DELIVERY JAVASCRIPT
// =====================================


// =====================================
// PAGE LOADER
// =====================================

window.addEventListener("load", () => {

    const loader =
        document.getElementById("pageLoader");

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

    loginForm.addEventListener(
        "submit",
        function (e) {

            e.preventDefault();

            const mobile =
                document
                    .getElementById("loginMobile")
                    .value
                    .trim();

            const password =
                document
                    .getElementById("loginPassword")
                    .value
                    .trim();


            if (!/^\d{10}$/.test(mobile)) {

                alert(
                    "Enter valid 10-digit mobile number"
                );

                return;
            }


            if (password.length < 6) {

                alert(
                    "Password must be at least 6 characters"
                );

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

        }
    );

}


// =====================================
// DELIVERY SIGNUP
// =====================================

const signupForm =
    document.getElementById("deliverySignupForm");

if (signupForm) {

    signupForm.addEventListener(
        "submit",
        function (e) {

            e.preventDefault();


            const name =
                document
                    .getElementById("signupName")
                    .value
                    .trim();

            const mobile =
                document
                    .getElementById("signupMobile")
                    .value
                    .trim();

            const email =
                document
                    .getElementById("signupEmail")
                    .value
                    .trim();

            const password =
                document
                    .getElementById("signupPassword")
                    .value;


            if (name.length < 2) {

                alert(
                    "Please enter your full name"
                );

                return;
            }


            if (!/^\d{10}$/.test(mobile)) {

                alert(
                    "Enter valid 10-digit mobile number"
                );

                return;
            }


            if (!email.includes("@")) {

                alert(
                    "Enter valid email"
                );

                return;
            }


            if (password.length < 6) {

                alert(
                    "Password must be at least 6 characters"
                );

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


            alert(
                "Account created successfully!"
            );


            window.location.href =
                "/delivery/login";

        }
    );

}


// =====================================
// ONLINE / OFFLINE
// =====================================

const toggle =
    document.getElementById("onlineToggle");

const onlineText =
    document.getElementById("onlineText");


if (toggle && onlineText) {

    let online =
        localStorage.getItem(
            "deliveryOnline"
        ) === "true";


    function updateOnlineUI() {

        if (online) {

            toggle.classList.add("active");

            onlineText.textContent =
                "You are Online";

        } else {

            toggle.classList.remove("active");

            onlineText.textContent =
                "You are Offline";

        }

    }


    updateOnlineUI();


    toggle.addEventListener(
        "click",
        () => {

            online = !online;

            localStorage.setItem(
                "deliveryOnline",
                online
            );

            updateOnlineUI();

        }
    );

}


// =====================================
// OPEN ORDER
// =====================================

function openOrder(id) {

    if (!id) {

        alert(
            "Delivery ID is missing."
        );

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

        alert(
            "Delivery ID is missing."
        );

        return;
    }


    const confirmAccept =
        confirm(
            "Are you sure you want to accept this delivery?"
        );


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
                "Failed to accept delivery."
            );

            return;
        }


        // =================================
        // SAVE REAL MONGODB DELIVERY ID
        // =================================

        const deliveryId =
            data.delivery &&
            data.delivery._id
                ? data.delivery._id
                : id;


        localStorage.setItem(
            "activeDeliveryId",
            deliveryId
        );


        // Old key cleanup
        localStorage.removeItem(
            "activeDeliveryOrder"
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

        alert(
            "Delivery ID is missing."
        );

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
                "Failed to reject delivery."
            );

            return;
        }


        // Remove selected delivery
        localStorage.removeItem(
            "selectedDeliveryOrder"
        );


        localStorage.removeItem(
            "activeDeliveryId"
        );


        alert(
            "Delivery rejected successfully."
        );


        // Go back to dashboard
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
// GET ACTIVE DELIVERY ID
// =====================================

function getActiveDeliveryId() {

    return localStorage.getItem(
        "activeDeliveryId"
    );

}


// =====================================
// REACHED RESTAURANT
// =====================================

async function reachedRestaurant(id) {

    const deliveryId =
        id || getActiveDeliveryId();


    if (!deliveryId) {

        alert(
            "Active delivery not found."
        );

        return;
    }


    try {

        const response =
            await fetch(
                `/delivery/${deliveryId}/reached-restaurant`,
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
                "Unable to update restaurant status."
            );

            return;
        }


        // Keep actual ID
        localStorage.setItem(
            "activeDeliveryId",
            deliveryId
        );


        // Move to pickup verification
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

        alert(
            "Active delivery not found."
        );

        return;
    }


    window.location.href =
        `/delivery/pickup/${deliveryId}`;

}


// =====================================
// REACHED CUSTOMER LOCATION
// =====================================

async function reachedLocation(id) {

    const deliveryId =
        id || getActiveDeliveryId();


    if (!deliveryId) {

        alert(
            "Active delivery not found."
        );

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


        window.location.href =
            `/delivery/complete/${deliveryId}`;


    } catch (error) {

        console.error(
            "Reached Location Error:",
            error
        );


        alert(
            "Something went wrong. Please try again."
        );

    }

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
        name
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

// =====================================
// PICKUP OTP UI
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
// OPEN PICKUP CAMERA
// =====================================

let pickupStream = null;

async function openPickupCamera() {

    const cameraBox =
        document.getElementById("cameraBox");

    const video =
        document.getElementById("pickupCamera");

    const otpBox =
        document.getElementById("otpBox");


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


    preview.src =
        photo;


    video.classList.add(
        "hidden"
    );

    preview.classList.remove(
        "hidden"
    );


    captureButton.classList.add(
        "hidden"
    );

    retakeButton.classList.remove(
        "hidden"
    );

    verifyButton.classList.remove(
        "hidden"
    );


    // Stop camera
    if (pickupStream) {

        pickupStream
            .getTracks()
            .forEach(track => track.stop());

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


    preview.src = "";

    preview.classList.add(
        "hidden"
    );

    video.classList.remove(
        "hidden"
    );


    captureButton.classList.remove(
        "hidden"
    );

    retakeButton.classList.add(
        "hidden"
    );

    verifyButton.classList.add(
        "hidden"
    );


    openPickupCamera();

}


// =====================================
// VERIFY OTP
// =====================================

async function verifyPickupOTP(id) {

    const otpInput =
        document.getElementById("pickupOtp");

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
                `/delivery/${id}/pickup-otp`,
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

    const canvas =
        document.getElementById("pickupCanvas");


    if (!canvas) {

        alert(
            "Please capture a photo first."
        );

        return;
    }


    const photo =
        canvas.toDataURL(
            "image/jpeg",
            0.85
        );


    try {

        const response =
            await fetch(
                `/delivery/${id}/pickup-photo`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        photo
                    })
                }
            );


        const data =
            await response.json();


        if (!response.ok || !data.success) {

            alert(
                data.message ||
                "Photo verification failed."
            );

            return;
        }


        showPickupSuccess();


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
        otpBox.classList.add("hidden");
    }

    if (cameraBox) {
        cameraBox.classList.add("hidden");
    }

    if (successBox) {
        successBox.classList.remove("hidden");
    }

}


// =====================================
// CONTINUE DELIVERY
// =====================================

function continueToLocation(id) {

    if (!id) {

        alert(
            "Delivery ID missing."
        );

        return;
    }


    localStorage.setItem(
        "activeDeliveryId",
        id
    );


    window.location.href =
        `/delivery/active/${id}`;

}