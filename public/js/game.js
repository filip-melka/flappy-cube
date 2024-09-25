const width = 1000
const height = 600
const canvas = document.querySelector("canvas")
canvas.height = height
canvas.width = width
const ctx = canvas.getContext("2d")
const colors = {
    player: "white",
}

const gravity = 0.12
const jumpForce = 6
const cornerRadius = 10

const obstacles = []

let isGameRunning = false

const player = {
    width: 100,
    height: 100,
    posY: height / 3,
    posX: 100,
    velocityY: 0,
}

function drawPlayer() {
    ctx.fillStyle = colors.player
    ctx.strokeStyle = "transparent"
    ctx.beginPath()
    ctx.roundRect(
        player.posX,
        player.posY,
        player.width,
        player.height,
        cornerRadius
    )
    ctx.stroke()
    ctx.fill()
}

drawPlayer()
