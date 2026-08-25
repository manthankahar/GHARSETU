let pickupStream = null;

let capturedPhoto = null;


// =====================================
// MESSAGE
// =====================================

function showPickupMessage(
    message,
    type = "success"
) {

    const box =
        document.getElementById(
            "pickupMessage"
        );

    box.textContent = message;

    box.className =
        "delivery-message " + type;

}


// =====================================
// VERIFY OTP
// =====================================

async function verifyPickupOTP() {

    const otpInput =
        document.getElementById(
            "pickupOtp"
        );

    const otp =
        otpInput.value.trim();

    if (!otp) {

        showPickupMessage(
            "Please enter OTP.",
            "error"
        );

        return;
    }

    if (!/^\d{4}$/.test(otp)) {

        showPickupMessage(
            "OTP must contain 4 digits.",
            "error"
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


        if (!response.ok) {

            showPickupMessage(
                data.message ||
                "Invalid OTP.",
                "error"
            );

            return;
        }


        showPickupMessage(
            "✓ Pickup verified successfully!"
        );


        setTimeout(() => {

            goToNextStep();

        }, 1000);


    } catch (error) {

        console.error(
            "OTP Error:",
            error
        );

        showPickupMessage(
            "Something went wrong.",
            "error"
        );
    }

}


// =====================================
// OPEN CAMERA
// =====================================

async function openPickupCamera() {

    const modal =
        document.getElementById(
            "cameraModal"
        );

    const video =
        document.getElementById(
            "pickupVideo"
        );


    modal.classList.add("active");


    try {

        pickupStream =
            await navigator.mediaDevices
                .getUserMedia({
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

        showPickupMessage(
            "Camera access denied or unavailable.",
            "error"
        );

        closePickupCamera();
    }

}


// =====================================
// CLOSE CAMERA
// =====================================

function closePickupCamera() {

    const modal =
        document.getElementById(
            "cameraModal"
        );

    modal.classList.remove(
        "active"
    );


    stopCamera();
}


// =====================================
// STOP CAMERA
// =====================================

function stopCamera() {

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
// CAPTURE PHOTO
// =====================================

function capturePickupPhoto() {

    const video =
        document.getElementById(
            "pickupVideo"
        );

    const canvas =
        document.getElementById(
            "pickupCanvas"
        );

    const preview =
        document.getElementById(
            "photoPreview"
        );


    if (
        !video.videoWidth ||
        !video.videoHeight
    ) {

        showPickupMessage(
            "Camera is not ready yet.",
            "error"
        );

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


    canvas.toBlob(
        blob => {

            capturedPhoto =
                blob;


            const imageUrl =
                URL.createObjectURL(
                    blob
                );


            preview.src =
                imageUrl;

            preview.classList.add(
                "show"
            );


            video.style.display =
                "none";


            document
                .getElementById(
                    "captureBtn"
                )
                .style.display =
                "none";


            document
                .getElementById(
                    "retakeBtn"
                )
                .style.display =
                "inline-flex";


            document
                .getElementById(
                    "uploadBtn"
                )
                .style.display =
                "inline-flex";


            stopCamera();

        },
        "image/jpeg",
        0.85
    );

}


// =====================================
// RETAKE PHOTO
// =====================================

async function retakePickupPhoto() {

    const video =
        document.getElementById(
            "pickupVideo"
        );

    const preview =
        document.getElementById(
            "photoPreview"
        );


    capturedPhoto = null;


    preview.src = "";

    preview.classList.remove(
        "show"
    );


    video.style.display =
        "block";


    document
        .getElementById(
            "captureBtn"
        )
        .style.display =
        "inline-flex";


    document
        .getElementById(
            "retakeBtn"
        )
        .style.display =
        "none";


    document
        .getElementById(
            "uploadBtn"
        )
        .style.display =
        "none";


    try {

        pickupStream =
            await navigator.mediaDevices
                .getUserMedia({
                    video: {
                        facingMode:
                            "environment"
                    },

                    audio: false
                });


        video.srcObject =
            pickupStream;

    } catch (error) {

        showPickupMessage(
            "Unable to reopen camera.",
            "error"
        );
    }

}


// =====================================
// SUBMIT PHOTO
// =====================================

async function submitPickupPhoto() {

    if (!capturedPhoto) {

        showPickupMessage(
            "Please capture a photo first.",
            "error"
        );

        return;
    }


    const formData =
        new FormData();


    formData.append(
        "photo",
        capturedPhoto,
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


        if (!response.ok) {

            showPickupMessage(
                data.message ||
                "Photo verification failed.",
                "error"
            );

            return;
        }


        showPickupMessage(
            "✓ Pickup photo verified successfully!"
        );


        closePickupCamera();


        setTimeout(() => {

            goToNextStep();

        }, 1000);


    } catch (error) {

        console.error(
            "Photo Upload Error:",
            error
        );

        showPickupMessage(
            "Failed to upload pickup photo.",
            "error"
        );
    }

}


// =====================================
// NEXT STEP
// =====================================

function goToNextStep() {

    window.location.href =
        `/delivery/active/${deliveryId}`;

}