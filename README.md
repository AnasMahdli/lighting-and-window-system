# Setup Guide

---

## ⚙️ Hardware Setup

Connect a **12V 2A adapter** to power the complete system.

- The motor drivers (**L298N**) are connected directly to the **12V supply** to prevent brownouts during heavy loads.
- Use a **buck converter** to step down the voltage to **5V** to safely power the ESP32 and the sensor suite (DHT22, LDRs, PIR, MQ5).

---

## 💻 Software Setup

### Required Libraries

Install the following libraries in your **Arduino IDE**:

| Library | Author |
|---|---|
| `ArduinoJson` | Benoit Blanchon |
| `WebSockets` | Markus Sattler |
| `DHT sensor library` | Adafruit |
| `UbidotsEsp32Mqtt` | Ubidots |

### Cloud Configuration

1. Add your Wi-Fi **`SSID`** and **`Password`** to the ESP32 code.
2. Replace the GCP WebApp URL with your specific **Google Apps Script deployment URL**.
   > **Note:** If you update your Apps Script code, you must publish a **"New Deployment"** for the changes to take effect.
3. Ensure your **BigQuery Studio** table schema exactly matches the variable names in your payload (e.g., set `gas_level` to `FLOAT`).

---

## ☁️ Ubidots Setup (MQTT)

To utilize the cloud dashboard:

1. Copy your **Ubidots Token** and **Device Name** into the ESP32 code.
2. In your Ubidots Dashboard, create a new device and add the following raw variables:
   - `system-mode`
   - `fan-control`
   - `curtain-control`
   - `window-control`
3. Link these variables to **toggle switches** on your dashboard. These will publish commands to the ESP32 via the MQTT `/lv` (Last Value) topics.

---

## 🌐 WebSocket Setup (3D Digital Twin)

To run the local First-Person 3D Control Room:

### Prerequisites

1. Download and install the latest **LTS version of Node.js** from [nodejs.org](https://nodejs.org).
2. Download **Ngrok**, extract it, and authenticate your token via the command terminal.

### Installation

Open a command prompt in your project folder and install the required dependencies:

```bash
npm install ws
```

### Running the Servers

You will need **three separate terminals** open in your project folder.

**Terminal 1 — Start the WebSocket Broker:**

```bash
node server.js
```

**Terminal 2 — Host the 3D Files:**

> Note the port used — typically `8081` if `8080` is already taken by the broker.

```bash
npx http-server -p 8081
```

**Terminal 3 — Expose the WebSocket Broker via Ngrok:**

```bash
ngrok http 8080
```

### Connecting the Digital Twin

1. Ngrok will generate a **forwarding URL** in Terminal 3.
2. In your `3d-dashboard.html` file, update the WebSocket connection using the `wss://` prefix:
   ```
   wss://new-random-words.ngrok-free.dev
   ```
3. In your **ESP32 code**, paste the exact same URL but **remove the prefix**:
   ```
   new-random-words.ngrok-free.dev
   ```
4. Open your browser and navigate to:
   ```
   http://127.0.0.1:8081/3d-dashboard.html
   ```

The 3D environment should now render and sync with your physical hardware in real-time. 🚀
