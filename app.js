// app.js
let playerName = "";
let score = 0;
let hesoyamUsed = false; // sadece 1 defa kullanılabilir
let currentQuestion = {};
let shuffledQuestions = [];
let currentIndex = 0;

const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");
const finalScreen = document.getElementById("finalScreen");

const nameInput = document.getElementById("nameInput");
const playerLabel = document.getElementById("playerLabel");
const questionEl = document.getElementById("question");
const answerEl = document.getElementById("answer");
const resultMessage = document.getElementById("resultMessage");
const submitBtn = document.getElementById("submitBtn");
const skipBtn = document.getElementById("skipBtn");
const endBtn = document.getElementById("endBtn");
const restartBtn = document.getElementById("restartBtn");
const finalMsg = document.getElementById("finalMsg");

// Başlat
document.getElementById("startBtn").addEventListener("click", () => {
  const name = nameInput.value.trim();
  if (!name) return alert("Lütfen adını yaz");

  playerName = name;
  score = 0;
  hesoyamUsed = false;

  startScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
  playerLabel.textContent = `Oyuncu: ${playerName}`;
  loadNewQuestion();
  updateScore();
});

// Yeni soru yükle
function loadNewQuestion() {
  if (shuffledQuestions.length === 0) {
    shuffledQuestions = [...QUESTIONS].sort(() => Math.random() - 0.5);
  }

  currentQuestion = shuffledQuestions.pop();
  questionEl.textContent = currentQuestion.q;
  answerEl.value = "";
  resultMessage.textContent = "";
  submitBtn.disabled = false;
}

// Skor güncelle
function updateScore() {
  playerLabel.textContent = `${playerName} | Puan: ${score}`;
}

// Cevap kontrolü
submitBtn.addEventListener("click", () => {
  if (submitBtn.disabled) return;
  const answer = answerEl.value.trim().toLowerCase();
  submitBtn.disabled = true;

  // 🧩 HESOYAM kodu
  if (answer === "hesoyam" && !hesoyamUsed) {
    hesoyamUsed = true;
    score += 250;
    updateScore();
    showCJOverlay(() => {
      loadNewQuestion();
    });
    return;
  }

  // Normal cevap kontrolü
  const correctAnswer = currentQuestion.a.toLowerCase();
  if (normalize(answer) === normalize(correctAnswer)) {
    score += 5;
    resultMessage.textContent = "✅ Doğru!";
  } else {
    score -= 2;
    resultMessage.textContent = `❌ Yanlış! Doğru cevap: ${currentQuestion.a}`;
  }

  updateScore();

  setTimeout(() => {
    loadNewQuestion();
  }, 1000);
});

// Geç
skipBtn.addEventListener("click", () => {
  loadNewQuestion();
});

// Bitir
endBtn.addEventListener("click", () => {
  const towerDown = confirm("Kuleyi sen mi devirdin?");

  if (towerDown) {
    score -= 15;
  }

  gameScreen.classList.add("hidden");
  finalScreen.classList.remove("hidden");

  document.getElementById("finalTitle").textContent = "🎉 Tebrikler!";
  finalMsg.innerHTML = `Skorunuz: ${score}`;
});

// Tekrar oyna
restartBtn.addEventListener("click", () => {
  finalScreen.classList.add("hidden");
  startScreen.classList.remove("hidden");
});

// Türkçe karakter hatalarını önlemek için normalize fonksiyonu
function normalize(text) {
  return text
    .replaceAll("ı", "i")
    .replaceAll("ğ", "g")
    .replaceAll("ü", "u")
    .replaceAll("ş", "s")
    .replaceAll("ö", "o")
    .replaceAll("ç", "c")
    .toLowerCase();
}

// CJ görseli oluşturma + ses efekti
function showCJOverlay(nextQuestionCallback) {
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = 0;
  overlay.style.left = 0;
  overlay.style.width = "100vw";
  overlay.style.height = "100vh";
  overlay.style.backgroundColor = "black";
  overlay.style.display = "flex";
  overlay.style.flexDirection = "column";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";
  overlay.style.zIndex = "9999";
  overlay.style.opacity = 0;
  overlay.style.transition = "opacity 0.8s ease";

  overlay.innerHTML = `
    <img src="https://media1.tenor.com/m/jr9t3yabkH8AAAAC/ah-shit-here-we-go-again.gif"
         alt="CJ"
         style="max-width:80%;border-radius:12px;box-shadow:0 0 20px rgba(0,0,0,0.7)">
  `;

  document.body.appendChild(overlay);

  requestAnimationFrame(() => (overlay.style.opacity = 1));

  // 🔊 Ses dosyası
  const audio = new Audio("https://cdn.pixabay.com/download/audio/2023/09/20/audio_8c6e2f2f9a.mp3?filename=oh-shit-here-we-go-again-181990.mp3");
  audio.volume = 0.6;
  audio.play().catch(() => {
    console.warn("Ses oynatılamadı (tarayıcı izin vermedi).");
  });

  setTimeout(() => {
    overlay.style.opacity = 0;
    setTimeout(() => {
      overlay.remove();
      if (typeof nextQuestionCallback === "function") {
        nextQuestionCallback();
      }
    }, 800);
  }, 5000);
}
