// app.js - DİNGA main script
(function(){
  // helpers
  const $ = id => document.getElementById(id);
  function shuffleArray(a){ for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]] } }

  // DOM
  const startScreen = $('startScreen');
  const gameScreen  = $('gameScreen');
  const finalScreen = $('finalScreen');

  const nameInput = $('nameInput');
  const startBtn  = $('startBtn');
  const howBtn    = $('howBtn');

  const playerLabel = $('playerLabel');
  const progressLabel = $('progressLabel');
  const questionEl = $('question');
  const answerEl   = $('answer');
  const submitBtn  = $('submitBtn');
  const skipBtn    = $('skipBtn');
  const nextBtn    = $('nextBtn');
  const resultMsg  = $('resultMessage');
  const endBtn     = $('endBtn');

  const finalTitle = $('finalTitle');
  const finalMsg   = $('finalMsg');
  const restartBtn = $('restartBtn');
  const downloadBtn= $('downloadBtn');

  // Data
  let questions = []; // will fill from QUESTIONS
  let currentIndex = 0;
  let correctCount = 0;
  let playerName = '';

  // Init
  function init(){
    if(typeof QUESTIONS === 'undefined' || !Array.isArray(QUESTIONS) || QUESTIONS.length===0){
      questionEl.textContent = "Sorular bulunamadı!";
      startBtn.disabled = true;
      return;
    }
    // clone questions to local array
    questions = QUESTIONS.map(q => ({ q: q.q, a: q.a }));
    shuffleArray(questions);
    // load saved name
    const saved = localStorage.getItem('dinga_player');
    if(saved) nameInput.value = saved;
    attachEvents();
  }

  function attachEvents(){
    startBtn.addEventListener('click', startGame);
    howBtn.addEventListener('click', ()=> alert("Oyna: İsmini yaz > Başla > soruyu oku > cevabı yaz > Gönder. Doğruysa taş çekme hakkı kazanırsın. Bitir ile istediğin zaman çıkabilirsin."))
    submitBtn.addEventListener('click', submitAnswer);
    skipBtn.addEventListener('click', skipQuestion);
    nextBtn.addEventListener('click', nextQuestion);
    endBtn.addEventListener('click', endGame);
    restartBtn.addEventListener('click', restartGame);
    downloadBtn.addEventListener('click', downloadQuestions);
    answerEl.addEventListener('keydown', (e)=>{ if(e.key==='Enter') submitAnswer(); });
    nameInput.addEventListener('keydown', (e)=>{ if(e.key==='Enter') startGame(); });
  }

  // Start game
  function startGame(){
    playerName = nameInput.value.trim() || 'Misafir';
    localStorage.setItem('dinga_player', playerName);
    playerLabel.textContent = `Oyuncu: ${playerName}`;
    currentIndex = 0;
    correctCount = 0;
    // ensure shuffled
    shuffleArray(questions);
    showScreen('game');
    showQuestion(currentIndex);
  }

  // Show screen helper
  function showScreen(name){
    if(name==='game'){
      startScreen.classList.add('hidden'); startScreen.setAttribute('aria-hidden','true');
      finalScreen.classList.add('hidden'); finalScreen.setAttribute('aria-hidden','true');
      gameScreen.classList.remove('hidden'); gameScreen.setAttribute('aria-hidden','false');
      answerEl.style.display = ''; submitBtn.style.display = ''; skipBtn.style.display = '';
    } else if(name==='final'){
      gameScreen.classList.add('hidden'); gameScreen.setAttribute('aria-hidden','true');
      startScreen.classList.add('hidden'); startScreen.setAttribute('aria-hidden','true');
      finalScreen.classList.remove('hidden'); finalScreen.setAttribute('aria-hidden','false');
    } else {
      startScreen.classList.remove('hidden'); startScreen.setAttribute('aria-hidden','false');
      gameScreen.classList.add('hidden'); gameScreen.setAttribute('aria-hidden','true');
      finalScreen.classList.add('hidden'); finalScreen.setAttribute('aria-hidden','true');
    }
  }

  // Show question
  function showQuestion(idx){
    if(idx >= questions.length){
      showFinalScreen();
      return;
    }
    const obj = questions[idx];
    questionEl.textContent = obj.q;
    answerEl.value = '';
    resultMsg.textContent = '';
    nextBtn.classList.add('hidden');
    skipBtn.classList.remove('hidden');
    updateProgress();
    answerEl.focus();
  }

  function updateProgress(){
    progressLabel.textContent = `Soru: ${Math.min(currentIndex+1, questions.length)} / ${questions.length}`;
  }

  // Submit
  function submitAnswer(){
    const val = answerEl.value.trim();
    if(val === '') return;
    const correct = questions[currentIndex].a;
    if(normalize(val) === normalize(correct)){
      resultMsg.style.color = 'var(--accent-2)';
      resultMsg.textContent = `✅ Doğru cevap! Taş çekebilirsiniz.`;
      correctCount++;
      nextBtn.classList.remove('hidden');
      skipBtn.classList.add('hidden');
    } else {
      resultMsg.style.color = '#ff6b6b';
      resultMsg.innerHTML = `❌ Yanlış cevap! <br> Doğru cevap: <strong>${escapeHtml(correct)}</strong>`;
      // allow player to read and then skip
      skipBtn.classList.remove('hidden');
      nextBtn.classList.add('hidden');
    }
  }

  function normalize(s){
    return s.toString().trim().toLowerCase().replace(/ğ/g,'g').replace(/ü/g,'u').replace(/ş/g,'s').replace(/ı/g,'i').replace(/ö/g,'o').replace(/ç/g,'c');
  }

  function escapeHtml(str){
    return (''+str).replace(/[&<>"'`=\/]/g, function(s){ return '&#'+s.charCodeAt(0)+';'; });
  }

  // Skip
  function skipQuestion(){
    currentIndex++;
    showQuestion(currentIndex);
  }

  // Next (after correct)
  function nextQuestion(){
    currentIndex++;
    showQuestion(currentIndex);
  }

  // End game (confirm)
  function endGame(){
    const ok = confirm("Oyunu bitirmek istediğine emin misin?");
    if(ok){
      showFinalScreen();
    }
  }

  function showFinalScreen(){
    showScreen('final');
    finalMsg.innerHTML = `Tüm soruları tamamladınız.<br>Skorunuz: ${correctCount} / ${questions.length}`;
  }

  function restartGame(){
    // reset and go to start
    correctCount = 0;
    currentIndex = 0;
    showScreen('start');
  }

  function downloadQuestions(){
    const text = questions.map((x,i)=> `${i+1}. ${x.q} — Cevap: ${x.a}`).join("\n\n");
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'dinga_sorular.txt'; document.body.appendChild(a); a.click();
    setTimeout(()=>{ URL.revokeObjectURL(url); a.remove(); }, 500);
  }

  // init on dom ready
  document.addEventListener('DOMContentLoaded', init);
})();
