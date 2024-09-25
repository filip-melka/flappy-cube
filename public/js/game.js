const width = 1000
const height = 600
const canvas = document.querySelector("canvas")
const scoreDisplay = document.getElementById("score")
const bestScoreDisplay = document.getElementById("best")

canvas.height = height
canvas.width = width

const ctx = canvas.getContext("2d")
const colors = {
    player: "white",
    obstacle: "#ccc",
}

const gravity = 0.12
const jumpForce = 6
const cornerRadius = 10
const speed = 5

let obstacles = []
let obstacleGapHeight = 400
const obstcleSpacing = 400

let isGameRunning = false
let isGameReady = true
let interval

let score = 0
let bestScore = localStorage.getItem("bestScore") || 0
updateBestScoreDisplay()

const player = {
    width: 100,
    height: 100,
    posY: height / 3,
    posX: 100,
    velocityY: 0,
}

function updateScoreDisplay() {
    scoreDisplay.innerText = score
}

function updateBestScoreDisplay() {
    bestScoreDisplay.innerText = bestScore
}

function drawObstacle(obstacle) {
    ctx.fillStyle = colors.obstacle
    ctx.strokeStyle = "transparent"
    // top
    ctx.beginPath()
    ctx.roundRect(obstacle.posX, 0, player.width, obstacle.spaceTop, [
        0,
        0,
        cornerRadius,
        cornerRadius,
    ])
    ctx.stroke()
    ctx.fill()

    // bottom
    ctx.beginPath()
    ctx.roundRect(obstacle.posX, obstacle.spaceBottom, player.width, height, [
        cornerRadius,
        cornerRadius,
        0,
        0,
    ])
    ctx.stroke()
    ctx.fill()
}

function spawnObstacle(posX) {
    const spaceTop =
        Math.floor(Math.random() * (height - 100 - obstacleGapHeight)) + 50 // min is 50

    const spaceBottom = spaceTop + obstacleGapHeight

    const newObstacle = {
        posX,
        spaceTop,
        spaceBottom,
        isScored: false,
    }

    obstacles.push(newObstacle)
}

function updateObstacles() {
    for (let obstacle of obstacles) {
        if (obstacle.posX < -50) {
            obstacles.shift()
            spawnObstacle(3 * obstcleSpacing)
        } else {
            obstacle.posX -= speed
        }
    }
}

function drawObstacles() {
    for (let obstacle of obstacles) {
        drawObstacle(obstacle)
    }
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
    if (isGameReady) {
        if (!isGameRunning) {
            isGameRunning = true
            updateScoreDisplay()
            interval = setInterval(update, 20)
        }
        player.velocityY = -jumpForce
    }
}

function start() {
    score = 0

    clear()
    player.posY = height / 3
    drawPlayer()

    obstacles = []
    new Array(1, 2, 3).forEach((i) => spawnObstacle(i * obstcleSpacing))
    drawObstacles()

    isGameReady = true

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
    isGameReady = false
    isGameRunning = false
    clearInterval(interval)

    if (score > bestScore) {
        bestScore = score
        localStorage.setItem("bestScore", bestScore)
        updateBestScoreDisplay()
    }

    setTimeout(() => {
        start()
    }, 1000)
}

function update() {
    clear()
    updateObstacles()
    drawObstacles()
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

    obstacles.forEach((obstacle) => {
        if (Math.abs(player.posX - obstacle.posX) <= player.width) {
            if (
                player.posY <= obstacle.spaceTop ||
                player.posY >= obstacle.spaceBottom - player.height
            ) {
                console.log("collision")
            }
        }

        if (obstacle.posX < player.posX - player.width && !obstacle.isScored) {
            obstacle.isScored = true
            score++
            updateScoreDisplay()
        }
    })
}
