# ⚡ VelocityType

> **A Premium, Highly Interactive Typing Speed & Accuracy Checker**

VelocityType is a state-of-the-art, single-page web application designed to measure, analyze, and elevate your typing performance. Built using a modern glassmorphic interface, customizable neon themes, retro-inspired synthesized audio feedback, and active typing particle physics.

---

## ✨ Key Features

* 🎨 **Interactive Styling & Themes**: Fluid glassmorphism panels with 4 preset theme configurations (*Neon Dark*, *Cyberpunk*, *Emerald Mint*, and *Sunset Breeze*) that switch instantly.
* ⏱️ **Configurable Durations**: Test your raw speed or endurance with test profiles of **1 Min**, **2 Min**, **5 Min**, and **10 Min**.
* 📖 **Diverse Text Banks**: Filter paragraphs based on categories: *General*, *Coding (JavaScript)*, *Literature*, and *Sci-Fi & Space Facts*.
* 🔊 **Audio Synthesis**: Uses the native browser **Web Audio API** to generate mechanical key clicks on correct hits, low-frequency buzzes on errors, and a C-major chime sequence on test completion.
* 🎆 **Keystroke Particle Effects**: Captures coordinates of the active cursor character to spawn colorful physical particle explosions on correct inputs.
* ⌨️ **Live Keyboard Visualizer**: Includes an interactive QWERTY layout grid matching physical key events in real-time.
* 📊 **Dynamic SVG Analytics Chart**: Renders a custom, responsive, interactive WPM progress line chart and error bar history graph upon test completion.
* 🔄 **Logo Reset**: Click on the logo at any time to instantly reset active states and return to the home screen.

---

## 🛠️ Tech Stack & Architecture

- **Core**: Vanilla JavaScript (ES6+ Module Architecture) & Semantic HTML5
- **Styling**: Vanilla CSS3 Custom Variables (HSL Color Tokens, Backdrop Blur Filters, CSS Keyframe Animations)
- **Tooling/Bundler**: Vite 5
- **Sound**: Browser Web Audio API Synthesizers
- **Graphics/Effects**: HTML5 Canvas Particle Engine & Responsive Dynamic SVG Chart Plotter
- **Fonts**: Outfit (Headers), Space Grotesk (UI Elements), JetBrains Mono (Typing Arena)

---

## 🚀 Getting Started

Follow these steps to run VelocityType locally:

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed (v20.18.0 or newer).

### Installation

1. Clone or download the repository files:
   ```bash
   git clone https://github.com/YOUR_USERNAME/velocity-type.git
   cd velocity-type
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally (Development)

Start the local development server:
```bash
npm run dev
```
Open **`http://localhost:3000`** in your browser to run the application.

### Building for Production

Compile and minify the assets for hosting:
```bash
npm run build
```
The optimized HTML, CSS, and JS output will be placed inside the **`dist/`** directory, ready for free hosting on platforms like Netlify, Vercel, or GitHub Pages.

---

## 👨‍💻 Author

- **Designed & Developed by:** Raj (built with precision and performance).

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
