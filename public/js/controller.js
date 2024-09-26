const socket = io()
const statusDisplay = document.getElementById("connection-status")
const peerConnection = new RTCPeerConnection({
    iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
        { urls: "stun:iphone-stun.strato-iphone.de:3478" },
        {
            urls: "stun:stun.relay.metered.ca:80",
        },
        {
            urls: "turn:standard.relay.metered.ca:80",
            username: "22dac8732ecf1750bfb6f5bc",
            credential: "fpk4xBjFO+U3jQfv",
        },
        {
            urls: "turn:standard.relay.metered.ca:80?transport=tcp",
            username: "22dac8732ecf1750bfb6f5bc",
            credential: "fpk4xBjFO+U3jQfv",
        },
        {
            urls: "turn:standard.relay.metered.ca:443",
            username: "22dac8732ecf1750bfb6f5bc",
            credential: "fpk4xBjFO+U3jQfv",
        },
        {
            urls: "turns:standard.relay.metered.ca:443?transport=tcp",
            username: "22dac8732ecf1750bfb6f5bc",
            credential: "fpk4xBjFO+U3jQfv",
        },
    ],
})

let dataChannel

socket.on("connect", () => {
    const urlParams = new URLSearchParams(window.location.search)
    const socketId = urlParams.get("socketId")

    if (socketId) {
        urlParams.delete("socketId")
        const newUrl = window.location.origin + window.location.pathname
        window.history.replaceState({}, document.title, newUrl)

        socket.emit("pair", socketId)
    }
})

socket.on("connected", () => {
    statusDisplay.className = "connected"
    establishWebRTCConnection()
})

socket.on("disconnected", () => {
    statusDisplay.className = "disconnected"
})

// Create a data channel and set up event listeners
function createDataChannel() {
    dataChannel = peerConnection.createDataChannel("channel")
    dataChannel.onopen = () => {
        document.addEventListener("click", () => {
            dataChannel.send("jump")
        })
    }
}

// Handle ICE candidate generation
peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
        socket.emit("ice-candidate", event.candidate)
    }
}

// Handle receiving an answer
socket.on("answer", async (answer) => {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(answer))
})

// Handle ICE candidates from the peer
socket.on("ice-candidate", (candidate) => {
    peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
})

async function establishWebRTCConnection() {
    createDataChannel()
    const offer = await peerConnection.createOffer()
    await peerConnection.setLocalDescription(offer)
    socket.emit("offer", offer)
}
