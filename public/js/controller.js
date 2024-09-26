const socket = io()
const statusDisplay = document.getElementById("connection-status")
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
})

socket.on("disconnected", () => {
    statusDisplay.className = "disconnected"
})
