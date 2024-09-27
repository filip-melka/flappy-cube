# Flappy Cube

![banner](https://github.com/user-attachments/assets/11de952b-69cb-478c-8ac5-dadff5d3c245)

Flappy Cube is a web-based game inspired by "Flappy Bird." It connects your phone to your PC, and uses your phone's motion sensors as the controller.

## How It Works

There are two key components:

1. **Game Page** (`index.html`): This is where the game runs on your PC.
2. **Controller Page** (`controller.html`): This page runs on your phone and acts as the controller.

The process works as follows:

1. Navigate to [flappy-cube.onrender.com](https://flappy-cube.onrender.com/) on your PC.
2. A QR code will be generated and displayed on the screen.
3. Scan the QR code with your phone, which will take you to the controller page.
4. Enable motion detection on your phone.
5. "Flick" your phone to make the cube "jump" in the game.

## How It Works Under the Hood

<p align="center">
  <img src="https://github.com/user-attachments/assets/5b61989c-7a7c-42cf-972b-6f848216404c">
</p>

The game uses the **WebRTC** protocol to enable real-time, low-latency communication between your phone and your PC browser.

To establish the WebRTC connection, **Socket.IO** is used for signaling. Here's how the process unfolds:

1. When you visit the game page, a QR code is generated. This QR code contains a URL for the controller page along with the unique Socket.IO ID of your PC.
2. After scanning the QR code, the controller page retrieves the socket ID and sends a WebRTC offer to the PC using Socket.IO.
3. The PC receives this offer, generates a WebRTC answer, and sends it back to the phone.
4. Once the connection is established, your phone uses the WebRTC data channel to send a message whenever a "flick" motion is detected via the phone's accelerometer.
