const socket = io()
const gameCanvas = document.getElementById("game")
const qrCode = document.getElementById("qr-code")

socket.on("connect", () => {
    createQRCode(socket.id)
    showQR()

    // for testing
    qrCode.addEventListener("click", () => {
        window
            .open(
                window.location.href + "controller.html?socketId=" + socket.id,
                "_blank"
            )
            .focus()
    })
})

socket.on("connected", () => {
    hideQR()
})

socket.on("disconnected", () => {
    showQR()
})

function createQRCode(socketId) {
    new QRCode("qr-code", {
        text: window.location.href + "controller.html?socketId=" + socketId,
        width: 180,
        height: 180,
    })
}

function showQR() {
    gameCanvas.style.display = "none"
    qrCode.style.display = "flex"
}

function hideQR() {
    gameCanvas.style.display = "block"
    qrCode.style.display = "none"
}
