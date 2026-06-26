import './style.css';

/* ==========================================================================
   1. Text Content Banks
   ========================================================================== */
const TEXT_BANKS = {
  general: [
    "The quick brown fox jumps over the lazy dog. This classic pangram contains every letter in the English language and has been used for testing typewriters and computer keyboards for decades. As technology evolved, typing became a core human-computer interface skill. Today, speed and precision define our productivity and flow in a digital-first world.",
    "A journey of a thousand miles begins with a single step. Success is not final, failure is not fatal: it is the courage to continue that counts. We are what we repeatedly do. Excellence, then, is not an act, but a habit. In the middle of difficulty lies opportunity. Keep your face always toward the sunshine, and shadows will fall behind you.",
    "Technology has reshaped how we live, communicate, and think. From the early days of personal computers to the rise of massive cloud neural networks, our tools reflect our imaginations. Fast typing is not just about moving fingers; it is about translating thoughts directly into language without friction, creating a seamless connection between mind and machine."
  ],
  code: [
    "const calculateWpm = (chars, time) => { const words = chars / 5; return Math.round(words / (time / 60)); }; function initApp() { let state = { speed: 0, accuracy: 100 }; console.log('VelocityType active, state initialized:', state); document.addEventListener('keydown', handleKeyInput); }",
    "async function fetchUserData(userId) { try { const response = await fetch(`/api/users/${userId}`); if (!response.ok) { throw new Error('Network response error'); } const data = await response.json(); return { success: true, user: data }; } catch (error) { console.error('Fetch failed:', error.message); return { success: false, error }; } }",
    "class TypingTest { constructor(text, duration) { this.text = text; this.duration = duration; this.currentIndex = 0; this.history = []; } start() { this.startTime = Date.now(); this.timer = setInterval(() => this.tick(), 1000); } stop() { clearInterval(this.timer); } }"
  ],
  literature: [
    "To be, or not to be, that is the question: Whether 'tis nobler in the mind to suffer The slings and arrows of outrageous fortune, Or to take arms against a sea of troubles And by opposing end them. To die—to sleep, No more; and by a sleep to say we end The heart-ache and the thousand natural shocks That flesh is heir to.",
    "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of light, it was the season of darkness, it was the spring of hope, it was the winter of despair. We had everything before us, we had nothing before us.",
    "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife. However little known the feelings or views of such a man may be on his first entering a neighbourhood, this truth is so well fixed in the minds of the surrounding families, that he is considered the rightful property of some one or other of their daughters."
  ],
  facts: [
    "Light from the Sun takes approximately eight minutes and twenty seconds to reach Earth. Travelling at a speed of nearly three hundred thousand kilometres per second, this cosmic spotlight illuminates our world. Beyond our solar system, the closest star system is Alpha Centauri, which is located about four point two light-years away from our planet.",
    "Neutron stars are so dense that a single teaspoon of their material would weigh about six billion tons on Earth. These celestial remnants are created when massive stars collapse in supernova explosions. They spin at extreme rates, sometimes rotating hundreds of times per second, emitting beams of intense radiation across the empty void of space.",
    "The observable universe contains an estimated two trillion galaxies, each hosting hundreds of billions of stars. As the universe continues to expand, distant galaxies drift further away from us. Cosmologists study the cosmic microwave background radiation, which is the thermal echo of the Big Bang, to understand the origins and eventual fate of everything."
  ]
};

/* ==========================================================================
   2. Web Audio API Synthesizer
   ========================================================================== */
class SoundSynthesizer {
  constructor() {
    this.audioCtx = null;
    this.enabled = true;
  }

  init() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  toggle(forceState) {
    this.enabled = forceState !== undefined ? forceState : !this.enabled;
    return this.enabled;
  }

  playKey(isCorrect) {
    if (!this.enabled) return;
    this.init();

    const now = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    if (isCorrect) {
      // High-pitched snappier clack click sound
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800 + Math.random() * 200, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.04);
      
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.045);
      
      osc.start(now);
      osc.stop(now + 0.05);
    } else {
      // Low buzzing error click
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.setValueAtTime(100, now + 0.08);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

      osc.start(now);
      osc.stop(now + 0.13);
    }
  }

  playChime() {
    if (!this.enabled) return;
    this.init();

    const now = this.audioCtx.currentTime;
    // Play beautiful major triad chords
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    
    notes.forEach((freq, idx) => {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      
      gain.gain.setValueAtTime(0, now + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.15, now + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.6);
      
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.65);
    });
  }
}

const synth = new SoundSynthesizer();

/* ==========================================================================
   3. Canvas Particle Explosion System
   ========================================================================== */
class ParticleSystem {
  constructor() {
    this.canvas = document.getElementById('particles-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.activeColors = ['#8b5cf6', '#06b6d4', '#d946ef']; // Matches theme
    
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.loop();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  setColors(colors) {
    this.activeColors = colors;
  }

  spawn(x, y, count = 12) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 4.5;
      const size = 2 + Math.random() * 4;
      const color = this.activeColors[Math.floor(Math.random() * this.activeColors.length)];
      
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.0, // slight upward float bias
        size,
        color,
        alpha: 1,
        decay: 0.02 + Math.random() * 0.025
      });
    }
  }

  loop() {
    requestAnimationFrame(() => this.loop());
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.08; // gravity
      p.vx *= 0.98; // drag
      p.alpha -= p.decay;
      
      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = p.alpha;
      this.ctx.fillStyle = p.color;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }
  }
}

let particles;

/* ==========================================================================
   4. Virtual Keyboard Layout Renderer
   ========================================================================== */
const KEYBOARD_LAYOUT = [
  // Row 1
  [
    { key: '`', label: '~' }, { key: '1', label: '1' }, { key: '2', label: '2' },
    { key: '3', label: '3' }, { key: '4', label: '4' }, { key: '5', label: '5' },
    { key: '6', label: '6' }, { key: '7', label: '7' }, { key: '8', label: '8' },
    { key: '9', label: '9' }, { key: '0', label: '0' }, { key: '-', label: '-' },
    { key: '=', label: '+' }, { key: 'Backspace', label: 'Back', class: 'key-backspace' }
  ],
  // Row 2
  [
    { key: 'Tab', label: 'Tab', class: 'key-tab' }, { key: 'q', label: 'Q' }, { key: 'w', label: 'W' },
    { key: 'e', label: 'E' }, { key: 'r', label: 'R' }, { key: 't', label: 'T' },
    { key: 'y', label: 'Y' }, { key: 'u', label: 'U' }, { key: 'i', label: 'I' },
    { key: 'o', label: 'O' }, { key: 'p', label: 'P' }, { key: '[', label: '{' },
    { key: ']', label: '}' }, { key: '\\', label: '|' }
  ],
  // Row 3
  [
    { key: 'CapsLock', label: 'Caps', class: 'key-caps' }, { key: 'a', label: 'A' }, { key: 's', label: 'S' },
    { key: 'd', label: 'D' }, { key: 'f', label: 'F' }, { key: 'g', label: 'G' },
    { key: 'h', label: 'H' }, { key: 'j', label: 'J' }, { key: 'k', label: 'K' },
    { key: 'l', label: 'L' }, { key: ';', label: ':' }, { key: "'", label: '"' },
    { key: 'Enter', label: 'Enter', class: 'key-enter' }
  ],
  // Row 4
  [
    { key: 'Shift', label: 'Shift', class: 'key-shift' }, { key: 'z', label: 'Z' }, { key: 'x', label: 'X' },
    { key: 'c', label: 'C' }, { key: 'v', label: 'V' }, { key: 'b', label: 'B' },
    { key: 'n', label: 'N' }, { key: 'm', label: 'M' }, { key: ',', label: '<' },
    { key: '.', label: '>' }, { key: '/', label: '?' }, { key: 'ShiftRight', label: 'Shift', class: 'key-shift' }
  ],
  // Row 5
  [
    { key: 'Control', label: 'Ctrl', class: 'key-ctrl' }, { key: 'Meta', label: 'Win', class: 'key-win' },
    { key: 'Alt', label: 'Alt', class: 'key-alt' }, { key: ' ', label: '', class: 'key-space' },
    { key: 'AltRight', label: 'Alt', class: 'key-alt' }, { key: 'MetaRight', label: 'Win', class: 'key-win' },
    { key: 'ControlRight', label: 'Ctrl', class: 'key-ctrl' }
  ]
];

function renderVirtualKeyboard() {
  const container = document.getElementById('virtual-keyboard');
  container.innerHTML = '';

  KEYBOARD_LAYOUT.forEach(row => {
    const rowEl = document.createElement('div');
    rowEl.className = 'keyboard-row';
    
    row.forEach(k => {
      const keyEl = document.createElement('div');
      keyEl.className = `key ${k.class || ''}`;
      // Data attribute mapping to match matching inputs
      keyEl.setAttribute('data-keycode', k.key.toLowerCase());
      keyEl.textContent = k.label;
      rowEl.appendChild(keyEl);
    });

    container.appendChild(rowEl);
  });
}

function highlightVirtualKey(key, isError = false) {
  let mappedKey = key.toLowerCase();
  
  // Map specific right side modifiers
  if (key === ' ') mappedKey = ' ';
  
  const keyEls = document.querySelectorAll(`[data-keycode="${mappedKey}"]`);
  keyEls.forEach(el => {
    el.classList.add('active-key');
    if (isError) {
      el.classList.add('error-key');
    }
  });
}

function releaseVirtualKeys() {
  const activeKeys = document.querySelectorAll('.active-key');
  activeKeys.forEach(k => {
    k.classList.remove('active-key', 'error-key');
  });
}

/* ==========================================================================
   5. Theme Management
   ========================================================================== */
const THEME_COLORS = {
  'neon-dark': ['#8b5cf6', '#06b6d4', '#d946ef'],
  'cyberpunk': ['#facc15', '#ff007f', '#00f0ff'],
  'emerald-mint': ['#34d399', '#2dd4bf', '#fbbf24'],
  'sunset-breeze': ['#f43f5e', '#fb923c', '#2dd4bf']
};

function setupThemeSelector() {
  const select = document.getElementById('theme-select');
  
  // Set theme from storage or default
  const savedTheme = localStorage.getItem('vt-theme') || 'neon-dark';
  select.value = savedTheme;
  document.documentElement.setAttribute('data-theme', savedTheme);
  
  select.addEventListener('change', (e) => {
    const theme = e.target.value;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('vt-theme', theme);
    
    if (particles) {
      particles.setColors(THEME_COLORS[theme] || THEME_COLORS['neon-dark']);
    }
  });
}

/* ==========================================================================
   6. Typing Speed Test Controller
   ========================================================================== */
class TypingTestController {
  constructor() {
    this.currentScreen = 'welcome-screen';
    this.selectedTime = 60; // default 1 min
    this.selectedCategory = 'general';
    this.testText = '';
    
    // Test Stats State
    this.isActive = false;
    this.isFinished = false;
    this.currentIndex = 0;
    this.startTime = null;
    this.timerId = null;
    this.timeLeft = 0;
    
    // Performance Timeline
    this.wpmTimeline = [];
    this.errorTimeline = [];
    
    // Exact tracking counts
    this.totalKeystrokes = 0;
    this.correctKeystrokes = 0;
    this.errorKeystrokes = 0;

    // Elements cache
    this.screens = {
      welcome: document.getElementById('welcome-screen'),
      setup: document.getElementById('setup-screen'),
      test: document.getElementById('test-screen'),
      results: document.getElementById('results-screen')
    };
    
    this.inputField = document.getElementById('keyboard-input');
    this.textDisplay = document.getElementById('text-display-box');
    this.timerDisplay = document.getElementById('timer-display');
    this.liveWpmDisplay = document.getElementById('live-wpm');
    this.liveAccDisplay = document.getElementById('live-accuracy');
    this.arenaPanel = document.getElementById('arena-panel');
    
    this.bindEvents();
  }

  init() {
    setupThemeSelector();
    renderVirtualKeyboard();
    particles = new ParticleSystem();
    particles.setColors(THEME_COLORS[document.getElementById('theme-select').value]);
    
    // Trigger initial layout checks
    this.showScreen('welcome-screen');
  }

  showScreen(screenId) {
    // Hide active screens
    Object.values(this.screens).forEach(screen => {
      screen.classList.remove('active');
    });
    
    // Show selected
    const target = document.getElementById(screenId);
    if (target) {
      target.classList.add('active');
      this.currentScreen = screenId;
    }
  }

  bindEvents() {
    // Logo click to return to home/welcome page
    document.getElementById('logo-btn').addEventListener('click', () => {
      this.stopTimer();
      this.showScreen('welcome-screen');
    });

    // 1) Welcome button
    document.getElementById('btn-get-started').addEventListener('click', () => {
      synth.init();
      this.showScreen('setup-screen');
    });

    // 2) Setup time selection
    const timeCards = document.querySelectorAll('.time-card');
    timeCards.forEach(card => {
      card.addEventListener('click', () => {
        this.selectedTime = parseInt(card.getAttribute('data-time'), 10);
        this.startTestSetup();
      });
    });

    // Setup Category selection buttons
    const catButtons = document.querySelectorAll('.category-buttons button');
    catButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        catButtons.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.selectedCategory = e.target.getAttribute('data-category');
      });
    });

    // 3) Arena Focus logic
    this.arenaPanel.addEventListener('click', () => {
      this.inputField.focus();
    });

    // Real typing listeners
    this.inputField.addEventListener('input', (e) => this.handleTypingInput(e));
    this.inputField.addEventListener('keydown', (e) => this.handleKeyboardDown(e));
    this.inputField.addEventListener('keyup', () => releaseVirtualKeys());
    
    // Remove focus class on blur
    this.inputField.addEventListener('focus', () => this.arenaPanel.classList.add('focused'));
    this.inputField.addEventListener('blur', () => this.arenaPanel.classList.remove('focused'));

    // 4) Test controls
    document.getElementById('btn-reset-test').addEventListener('click', () => this.resetTest());
    document.getElementById('btn-change-duration').addEventListener('click', () => {
      this.stopTimer();
      this.showScreen('setup-screen');
    });

    // 5) Results screen buttons
    document.getElementById('btn-retry').addEventListener('click', () => this.startTestSetup());
    document.getElementById('btn-new-settings').addEventListener('click', () => this.showScreen('setup-screen'));

    // 6) Sound toggle button
    const soundBtn = document.getElementById('sound-toggle');
    soundBtn.addEventListener('click', () => {
      const isEnabled = synth.toggle();
      soundBtn.classList.toggle('active', isEnabled);
      document.querySelector('.icon-sound-on').classList.toggle('hidden', !isEnabled);
      document.querySelector('.icon-sound-off').classList.toggle('hidden', isEnabled);
    });
  }

  startTestSetup() {
    // Reset state values
    this.isActive = false;
    this.isFinished = false;
    this.currentIndex = 0;
    this.timeLeft = this.selectedTime;
    this.wpmTimeline = [];
    this.errorTimeline = [];
    this.totalKeystrokes = 0;
    this.correctKeystrokes = 0;
    this.errorKeystrokes = 0;
    this.inputField.value = '';
    
    this.stopTimer();
    
    // Select text from chosen category
    const texts = TEXT_BANKS[this.selectedCategory];
    const randomIndex = Math.floor(Math.random() * texts.length);
    this.testText = texts[randomIndex];

    // For longer tests, repeat text to ensure enough text block is available
    if (this.selectedTime > 60) {
      this.testText = Array(Math.ceil(this.selectedTime / 60)).fill(this.testText).join(' ');
    }

    // Render characters
    this.renderTextDisplay();
    
    // Format timer
    this.updateTimerDisplay();
    this.liveWpmDisplay.innerHTML = `0 <span class="stat-unit">WPM</span>`;
    this.liveAccDisplay.innerHTML = `100<span class="stat-unit">%</span>`;

    // Show test screen
    this.showScreen('test-screen');
    setTimeout(() => this.inputField.focus(), 100);
  }

  renderTextDisplay() {
    this.textDisplay.innerHTML = '';
    
    for (let i = 0; i < this.testText.length; i++) {
      const span = document.createElement('span');
      span.className = 'char';
      span.textContent = this.testText[i];
      this.textDisplay.appendChild(span);
    }
    
    // Set first character as active
    this.textDisplay.childNodes[0].classList.add('current-char');
  }

  handleKeyboardDown(e) {
    if (this.isFinished) return;
    
    // Synthesize physical virtual keyboard interactions
    highlightVirtualKey(e.key);

    // Prevent scrolling or window shortcuts on backspace
    if (e.key === 'Backspace') {
      if (e.target === this.inputField) {
        e.preventDefault();
      }
    }

    if (e.key === 'Backspace') {
      this.processBackspace();
    }
  }

  handleTypingInput(e) {
    if (this.isFinished) return;

    // Get newly typed text
    const value = this.inputField.value;
    if (!value) return;

    // Start timer on first keystroke
    if (!this.isActive) {
      this.startTimer();
    }

    const typedChar = value.slice(-1);
    const expectedChar = this.testText[this.currentIndex];
    
    const charSpans = this.textDisplay.childNodes;
    const currentSpan = charSpans[this.currentIndex];

    // Reset input field so it stays small and hidden
    this.inputField.value = '';

    this.totalKeystrokes++;

    if (typedChar === expectedChar) {
      // Correct character
      currentSpan.classList.remove('current-char', 'incorrect');
      currentSpan.classList.add('correct');
      this.correctKeystrokes++;
      
      // Sound feedback
      synth.playKey(true);

      // Particle explosion at active letter position
      const rect = currentSpan.getBoundingClientRect();
      particles.spawn(rect.left + window.scrollX + rect.width / 2, rect.top + window.scrollY + rect.height / 2, 8);

      this.currentIndex++;
    } else {
      // Incorrect character
      currentSpan.classList.remove('current-char', 'correct');
      currentSpan.classList.add('incorrect');
      this.errorKeystrokes++;

      // Highlight corresponding key on virtual keyboard in error red
      highlightVirtualKey(typedChar, true);
      
      // Audio buzz feedback
      synth.playKey(false);

      this.currentIndex++;
    }

    // Set next cursor
    if (this.currentIndex < this.testText.length) {
      charSpans.forEach(span => span.classList.remove('current-char'));
      charSpans[this.currentIndex].classList.add('current-char');
      
      // Auto-scroll typing container if active character moves down
      this.scrollActiveIntoView(charSpans[this.currentIndex]);
    } else {
      // Reached the end of text block
      this.finishTest();
    }

    // Calculate real-time speed/accuracy metrics
    this.calculateLiveStats();
  }

  processBackspace() {
    if (this.currentIndex === 0) return;

    const charSpans = this.textDisplay.childNodes;
    
    // Remove states from current cursor
    if (this.currentIndex < charSpans.length) {
      charSpans[this.currentIndex].classList.remove('current-char');
    }

    // Backtrack index
    this.currentIndex--;
    const prevSpan = charSpans[this.currentIndex];
    prevSpan.classList.remove('correct', 'incorrect');
    prevSpan.classList.add('current-char');
    
    // Play light clack sound for backspacing
    synth.playKey(true);
    
    this.scrollActiveIntoView(prevSpan);
    this.calculateLiveStats();
  }

  scrollActiveIntoView(span) {
    const arena = this.textDisplay;
    const spanOffsetTop = span.offsetTop;
    const spanHeight = span.offsetHeight;
    const arenaHeight = arena.parentElement.clientHeight;

    // Scroll display box dynamically to keep cursor in view
    if (spanOffsetTop > (arena.parentElement.scrollTop + arenaHeight - 80)) {
      arena.parentElement.scrollTop = spanOffsetTop - 80;
    } else if (spanOffsetTop < arena.parentElement.scrollTop + 30) {
      arena.parentElement.scrollTop = Math.max(0, spanOffsetTop - 30);
    }
  }

  startTimer() {
    this.isActive = true;
    this.startTime = Date.now();
    
    this.timerId = setInterval(() => {
      this.timeLeft--;
      this.updateTimerDisplay();
      
      // Calculate WPM at this second to record timeline history
      const elapsedSeconds = this.selectedTime - this.timeLeft;
      const currentWpm = this.getCurrentWpm(elapsedSeconds);
      const errorsInLastSecond = this.errorKeystrokes - (this.errorTimeline.reduce((a, b) => a + b, 0));
      
      this.wpmTimeline.push(currentWpm);
      this.errorTimeline.push(errorsInLastSecond);

      if (this.timeLeft <= 0) {
        this.finishTest();
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    this.isActive = false;
  }

  updateTimerDisplay() {
    const mins = Math.floor(this.timeLeft / 60);
    const secs = this.timeLeft % 60;
    this.timerDisplay.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  getCurrentWpm(elapsedSeconds) {
    if (elapsedSeconds <= 0) return 0;
    
    // Standard words = typedCharacters / 5
    const minutes = elapsedSeconds / 60;
    const grossWpm = (this.currentIndex / 5) / minutes;
    
    // Calculate uncorrected errors
    let uncorrectedErrors = 0;
    const charSpans = this.textDisplay.childNodes;
    for (let i = 0; i < this.currentIndex; i++) {
      if (charSpans[i].classList.contains('incorrect')) {
        uncorrectedErrors++;
      }
    }
    
    const netWpm = grossWpm - (uncorrectedErrors / minutes);
    return Math.max(0, Math.round(netWpm));
  }

  calculateLiveStats() {
    if (this.currentIndex === 0) return;

    const elapsedSeconds = this.selectedTime - this.timeLeft;
    const liveWpm = this.getCurrentWpm(elapsedSeconds || 1);
    
    const accuracy = this.totalKeystrokes > 0 
      ? Math.round((this.correctKeystrokes / this.totalKeystrokes) * 100) 
      : 100;

    this.liveWpmDisplay.innerHTML = `${liveWpm} <span class="stat-unit">WPM</span>`;
    this.liveAccDisplay.innerHTML = `${accuracy}<span class="stat-unit">%</span>`;
  }

  resetTest() {
    this.startTestSetup();
  }

  finishTest() {
    this.stopTimer();
    this.isFinished = true;
    
    // Play completion chime chords
    synth.playChime();
    
    // Compute final results
    const totalTimeTaken = this.selectedTime - this.timeLeft || 1;
    const minutes = totalTimeTaken / 60;
    
    // Uncorrected errors check
    let uncorrectedErrors = 0;
    const charSpans = this.textDisplay.childNodes;
    for (let i = 0; i < this.currentIndex; i++) {
      if (charSpans[i].classList.contains('incorrect')) {
        uncorrectedErrors++;
      }
    }

    const grossWpm = Math.round((this.currentIndex / 5) / minutes);
    const netWpm = Math.max(0, Math.round(grossWpm - (uncorrectedErrors / minutes)));
    const accuracy = this.totalKeystrokes > 0
      ? Math.round((this.correctKeystrokes / this.totalKeystrokes) * 100)
      : 100;
      
    const correctCount = this.currentIndex - uncorrectedErrors;

    // Display values in results dashboard
    document.getElementById('result-wpm').textContent = netWpm;
    document.getElementById('result-accuracy').textContent = `${accuracy}%`;
    document.getElementById('result-correct-chars').textContent = correctCount;
    document.getElementById('result-error-chars').textContent = uncorrectedErrors;
    document.getElementById('result-gross-wpm').textContent = grossWpm;

    // Build timeline charts
    this.renderPerformanceChart();

    // Transition to results screen
    this.showScreen('results-screen');
  }

  /* ==========================================================================
     7. SVG Chart Plotter
     ========================================================================== */
  renderPerformanceChart() {
    const container = document.getElementById('svg-chart-box');
    container.innerHTML = '';

    const dataPoints = this.wpmTimeline;
    const errorPoints = this.errorTimeline;
    
    if (dataPoints.length === 0) {
      container.innerHTML = `<div class="chart-empty-msg font-mono">No data points logged</div>`;
      return;
    }

    const width = container.clientWidth || 550;
    const height = 220;
    const padding = { top: 20, right: 30, bottom: 30, left: 35 };

    // Max values for plotting scale
    const maxWpm = Math.max(...dataPoints, 40); // default peak 40 WPM scale min
    const maxErrors = Math.max(...errorPoints, 5);

    // Calculate grid intervals
    const xInterval = (width - padding.left - padding.right) / (dataPoints.length - 1 || 1);
    
    // Draw SVG
    let svg = `<svg width="100%" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <!-- Chart Gradients -->
      <defs>
        <linearGradient id="wpm-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--primary)" stop-opacity="0.3" />
          <stop offset="100%" stop-color="var(--primary)" stop-opacity="0.0" />
        </linearGradient>
      </defs>
    `;

    // 1) Render horizontal helper grid lines
    const gridRows = 4;
    for (let i = 0; i <= gridRows; i++) {
      const yVal = padding.top + (i / gridRows) * (height - padding.top - padding.bottom);
      const labelWpm = Math.round(maxWpm - (i / gridRows) * maxWpm);
      
      svg += `
        <line x1="${padding.left}" y1="${yVal}" x2="${width - padding.right}" y2="${yVal}" class="chart-grid" />
        <text x="${padding.left - 10}" y="${yVal + 3}" text-anchor="end" class="chart-text">${labelWpm}</text>
      `;
    }

    // 2) Render WPM Polyline coordinates mapping
    let polylinePoints = '';
    let areaPathPoints = `M ${padding.left} ${height - padding.bottom} `;
    let pointCircles = '';

    dataPoints.forEach((wpm, idx) => {
      const x = padding.left + idx * xInterval;
      // y-scale inverted (SVG top is 0)
      const y = padding.top + (1 - wpm / maxWpm) * (height - padding.top - padding.bottom);
      
      polylinePoints += `${x},${y} `;
      areaPathPoints += `L ${x} ${y} `;
      
      // Draw interactive speed markers on hover
      pointCircles += `<circle cx="${x}" cy="${y}" r="3.5" class="chart-point-wpm">
        <title>Second ${idx + 1}: ${wpm} WPM</title>
      </circle>`;
    });

    areaPathPoints += `L ${padding.left + (dataPoints.length - 1) * xInterval} ${height - padding.bottom} Z`;

    // 3) Plot Error Bars
    errorPoints.forEach((err, idx) => {
      if (err <= 0) return;
      
      const x = padding.left + idx * xInterval - 2; // Offset center bar
      const barHeight = (err / maxErrors) * (height - padding.top - padding.bottom - 40);
      const y = height - padding.bottom - barHeight;
      
      svg += `<rect x="${x}" y="${y}" width="4" height="${barHeight}" class="chart-bar-error">
        <title>Errors: ${err}</title>
      </rect>`;
    });

    // 4) Add speed lines and fill areas
    svg += `
      <path d="${areaPathPoints}" class="chart-area-wpm" />
      <polyline points="${polylinePoints.trim()}" class="chart-line-wpm" />
      ${pointCircles}
    `;

    // 5) Render primary bottom time scale axis
    svg += `
      <line x1="${padding.left}" y1="${height - padding.bottom}" x2="${width - padding.right}" y2="${height - padding.bottom}" class="chart-axis" />
    `;

    // X Axis time labels
    const maxLabels = 10;
    const labelSpacing = Math.max(1, Math.floor(dataPoints.length / maxLabels));
    
    dataPoints.forEach((_, idx) => {
      if (idx % labelSpacing === 0 || idx === dataPoints.length - 1) {
        const x = padding.left + idx * xInterval;
        svg += `
          <line x1="${x}" y1="${height - padding.bottom}" x2="${x}" y2="${height - padding.bottom + 5}" class="chart-axis" />
          <text x="${x}" y="${height - padding.bottom + 18}" text-anchor="middle" class="chart-text">${idx + 1}s</text>
        `;
      }
    });

    svg += `</svg>`;
    container.innerHTML = svg;
  }
}

/* ==========================================================================
   8. Application Initialization
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const controller = new TypingTestController();
  controller.init();
});
