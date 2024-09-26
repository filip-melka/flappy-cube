const socket = io()
const statusDisplay = document.getElementById("connection-status")
const peerConnection = new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
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
    dataChannel.onopen = () => console.log("Data channel opened")
    dataChannel.onmessage = (event) => {
        console.log(event.data)
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
    console.log("Remote description set (answer)")
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
