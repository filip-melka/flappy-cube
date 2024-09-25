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
const speed = 10

const obstacles = [
    {
        posX: 200,
        spaceTop: 100,
        spaceBottom: 200,
    },
]

let isGameRunning = false
let interval

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

function jump() {
    console.log("jumo")
    if (!isGameRunning) {
        isGameRunning = true
        interval = setInterval(update, 20)
    }
    player.velocityY = -jumpForce
}

function start() {
    clear()
    player.posY = height / 3
    drawPlayer()

    document.body.onkeyup = function (e) {
        if (e.key == " " || e.code == "Space" || e.keyCode == 32) {
            jump()
        }
    }
}

start()

function clear() {
    ctx.clearRect(0, 0, width, height)
}

function gameOver() {
    console.log("game over")
    isGameRunning = false
    clearInterval(interval)
    setTimeout(() => {
        start()
    }, 1000)
}

function update() {
    clear()
    updatePlayer()
    drawPlayer()
}

function updatePlayer() {
    player.velocityY += gravity
    if (player.posY + player.height + player.velocityY >= height) {
        player.posY = height - player.height
        gameOver()
    }
    if (player.posY + player.height + player.velocityY <= player.height) {
        player.posY = 0
        gameOver()
    } else {
        player.posY += player.velocityY
    }
}
