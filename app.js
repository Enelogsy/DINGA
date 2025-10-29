// HTML öğeleri
const startBtn = document.getElementById("startBtn");
const endBtn = document.getElementById("endBtn");
const restartBtn = document.getElementById("restartBtn");
const submitBtn = document.getElementById("submitBtn");
const skipBtn = document.getElementById("skipBtn");
const nameInput = document.getElementById("nameInput");
const questionEl = document.getElementById("question");
const answerInput = document.getElementById("answer");
const resultMessage = document.getElementById("resultMessage");
const playerLabel = document.getElementById("playerLabel");
const scoreLabel = document.getElementById("scoreLabel");

const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");
const finalScreen = document.getElementById("finalScreen");
const finalMsg = document.getElementById("finalMsg");

// Sorular questions.js dosyasından geliyor
let questions = QUESTIONS;

let currentIndex = 0;
let score = 0;
let playerName = "";

// Türkçe karakterleri normalize et
function normalize(str) {
  return str
    .toLowerCase()
    .replace(/ı/g, "i")
    .replace(/ü/g, "u")
    .replace(/ö/g, "o")
    .replace(/ş/g, "s")
    .replace(/ç/g, "c")
    .replace(/ğ/g, "g")
    .trim();
}

// Soruları karıştır
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Oyunu başlat
function startGame() {
  playerName = nameInput.value.trim() || "Oyuncu";
  playerLabel.textContent = `Oyuncu: ${playerName}`;
  score = 0;
  scoreLabel.textContent = `Skor: ${score}`;
  shuffle(questions);
  currentIndex = 0;

  startScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
  finalScreen.classList.add("hidden");
  loadQuestion();
}

// Soru yükle
function loadQuestion() {
  if (currentIndex >= questions.length) {
    shuffle(questions);
    currentIndex = 0;
  }
  const q = questions[currentIndex];
  questionEl.textContent = q.q;
  answerInput.value = "";
  resultMessage.textContent = "";
  submitBtn.disabled = false; // yeni soru gelince buton tekrar aktif olur
}

// Cevabı kontrol et
function submitAnswer() {
  const userAns = normalize(answerInput.value);
  const correctAns = normalize(questions[currentIndex].a);

  if (!userAns) {
    resultMessage.textContent = "⚠️ Lütfen bir cevap yaz.";
    return;
  }

  submitBtn.disabled = true; // buton devre dışı

  if (userAns === correctAns) {
    score += 5;
    resultMessage.style.color = "#16a34a";
    resultMessage.textContent = "✅ Doğru!";
  } else {
    score -= 2;
    resultMessage.style.color = "#ef4444";
    resultMessage.textContent = `❌ Yanlış! Doğru cevap: ${questions[currentIndex].a}`;
  }

  scoreLabel.textContent = `Skor: ${score}`;
}

// Soruyu manuel geç
function skipQuestion() {
  currentIndex++;
  loadQuestion();
}

// Oyunu bitir
function endGame() {
  const confirmEnd = confirm("Kuleyi sen mi devirdin?");
  if (confirmEnd) {
    score -= 15;
  }

  gameScreen.classList.add("hidden");
  finalScreen.classList.remove("hidden");
  finalMsg.textContent = `Skorunuz: ${score}`;
}

// Yeniden başlat
function restartGame() {
  startScreen.classList.remove("hidden");
  gameScreen.classList.add("hidden");
  finalScreen.classList.add("hidden");
}

// Eventler
startBtn.addEventListener("click", startGame);
submitBtn.addEventListener("click", submitAnswer);
skipBtn.addEventListener("click", skipQuestion);
endBtn.addEventListener("click", endGame);
restartBtn.addEventListener("click", restartGame);
