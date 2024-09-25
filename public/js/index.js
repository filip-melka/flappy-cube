const gameCanvas = document.getElementById("game")
const qrCode = document.getElementById("qr-code")

function createQRCode(socketId) {
    new QRCode("qr-code", {
        text: window.location.href + "?socketId=" + socketId,
        width: 180,
        height: 180,
    })
}

createQRCode("abc")

function showQR() {
    gameCanvas.style.display = "none"
    qrCode.style.display = "flex"
}

function hideQR() {
    gameCanvas.style.display = "block"
    qrCode.style.display = "none"
    qrCode.innerHTML = ""
}

showQR()

setTimeout(() => {
    hideQR()
}, 2000)
