const socket = io()
const gameCanvas = document.getElementById("game")
const qrCode = document.getElementById("qr-code")
const peerConnection = new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
})

let dataChannel

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

// Handle receiving a data channel
peerConnection.ondatachannel = (event) => {
    dataChannel = event.channel
    dataChannel.onmessage = (event) => {
        if (event.data === "jump") {
            jump()
        }
    }
}

// Handle ICE candidate generation
peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
        socket.emit("ice-candidate", event.candidate)
    }
}

// Handle ICE candidates from the controller
socket.on("ice-candidate", (candidate) => {
    peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
})

// Handle receiving an offer
socket.on("offer", async (offer) => {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer))
    const answer = await peerConnection.createAnswer()
    await peerConnection.setLocalDescription(answer)
    socket.emit("answer", answer) // Send answer back to controller
})
