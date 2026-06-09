// ===== HACKERSKÉ NÁSTROJE PRE DETI =====
// Všetko je bezpečné a vzdelávacie. Žiadne ozajstné hackovanie. 👾

// ---------- MATRIX EFEKT ----------
const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');
let cols, drops;
const glyphs = 'アイウエオカ01ハッカー0123456789ABCDEF'.split('');

function resizeMatrix() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  cols = Math.floor(canvas.width / 16);
  drops = Array(cols).fill(1);
}
resizeMatrix();
window.addEventListener('resize', resizeMatrix);

function drawMatrix() {
  ctx.fillStyle = 'rgba(10, 14, 10, 0.08)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#00ff66';
  ctx.font = '15px monospace';
  for (let i = 0; i < drops.length; i++) {
    const ch = glyphs[Math.floor(Math.random() * glyphs.length)];
    ctx.fillText(ch, i * 16, drops[i] * 16);
    if (drops[i] * 16 > canvas.height && Math.random() > 0.975) drops[i] = 0;
    drops[i]++;
  }
}
setInterval(drawMatrix, 55);

// ---------- PREPÍNANIE NÁSTROJOV (TABS) ----------
const tabs = document.querySelectorAll('.tab');
const tools = document.querySelectorAll('.tool');
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tools.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.tool).classList.add('active');
  });
});

// ---------- 1) HACKERSKÝ TERMINÁL ----------
const termOutput = document.getElementById('termOutput');
const termInput = document.getElementById('termInput');

function termPrint(text, isCmd) {
  const div = document.createElement('div');
  div.className = 'line';
  if (isCmd) {
    div.innerHTML = '<span class="prompt">hacker@deti:~$</span> ' + escapeHtml(text);
  } else {
    div.textContent = text;
  }
  termOutput.appendChild(div);
  termOutput.scrollTop = termOutput.scrollHeight;
}

function escapeHtml(s) {
  return s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

const commands = {
  help: () => `Dostupné príkazy:
  help      - zobrazí túto pomoc
  hack      - spustí (naoko!) hackovanie 😎
  whoami    - kto si?
  joke      - vtip pre hackerov
  matrix    - tajná správa
  date      - dnešný dátum a čas
  hello     - pozdrav
  clear     - vyčistí obrazovku`,
  hack: () => {
    fakeHack();
    return null;
  },
  whoami: () => 'Si super tajný hacker v zácviku! 🕵️',
  joke: () => randomItem([
    'Prečo programátori pletú Vianoce s Halloweenom? Lebo OCT 31 == DEC 25 😄',
    'Koľko hackerov treba na výmenu žiarovky? Žiadneho, to je hardvérový problém! 💡',
    'Aký je obľúbený nápoj hackera? Root-beer! 🍺',
    'Prečo bol počítač studený? Lebo si nechal otvorené okná (Windows)! 🪟'
  ]),
  matrix: () => 'Sleduj zelený dážď v pozadí... toto je Matrix! 🟢 Nasleduj bieleho králika.',
  date: () => new Date().toLocaleString('sk-SK'),
  hello: () => 'Ahoj hacker! Vitaj v tajnej základni. 👋',
  clear: () => { termOutput.innerHTML = ''; return null; }
};

function fakeHack() {
  const steps = [
    'Pripájam sa na server...',
    'Obchádzam firewall... [████░░░░] 50%',
    'Obchádzam firewall... [████████] 100% ✓',
    'Dešifrujem tajné kódy... 0xF4A2B9',
    'Sťahujem dáta... 99%',
    'PRÍSTUP POVOLENÝ! 🎉',
    '...len žartujem! Toto je len pre zábavu. 😄 Ozajstné hackovanie je nelegálne!'
  ];
  let i = 0;
  termInput.disabled = true;
  const t = setInterval(() => {
    if (i >= steps.length) {
      clearInterval(t);
      termInput.disabled = false;
      termInput.focus();
      return;
    }
    termPrint(steps[i++], false);
  }, 600);
}

termInput.addEventListener('keydown', e => {
  if (e.key !== 'Enter') return;
  const raw = termInput.value.trim();
  termInput.value = '';
  if (!raw) return;
  termPrint(raw, true);
  const cmd = raw.toLowerCase().split(' ')[0];
  if (commands[cmd]) {
    const res = commands[cmd]();
    if (res !== null && res !== undefined) termPrint(res, false);
  } else {
    termPrint(`Neznámy príkaz: "${cmd}". Napíš "help" pre pomoc.`, false);
  }
});

// ---------- 2) CAESAROVA ŠIFRA ----------
const cipherText = document.getElementById('cipherText');
const cipherShift = document.getElementById('cipherShift');
const shiftVal = document.getElementById('shiftVal');
const cipherOut = document.getElementById('cipherOut');

cipherShift.addEventListener('input', () => shiftVal.textContent = cipherShift.value);

function caesar(text, shift) {
  return text.replace(/[a-zA-Z]/g, c => {
    const base = c <= 'Z' ? 65 : 97;
    return String.fromCharCode((c.charCodeAt(0) - base + shift + 26) % 26 + base);
  });
}

document.getElementById('encodeBtn').addEventListener('click', () => {
  cipherOut.textContent = caesar(cipherText.value, +cipherShift.value);
});
document.getElementById('decodeBtn').addEventListener('click', () => {
  cipherOut.textContent = caesar(cipherText.value, -cipherShift.value);
});

// ---------- 3) BINÁRNY PREKLADAČ ----------
const binText = document.getElementById('binText');
const binOut = document.getElementById('binOut');

document.getElementById('toBinBtn').addEventListener('click', () => {
  const bin = binText.value.split('').map(c =>
    c.charCodeAt(0).toString(2).padStart(8, '0')
  ).join(' ');
  binOut.textContent = bin || '(prázdne)';
});

document.getElementById('fromBinBtn').addEventListener('click', () => {
  try {
    const text = binText.value.trim().split(/\s+/).map(b =>
      String.fromCharCode(parseInt(b, 2))
    ).join('');
    binOut.textContent = text || '(prázdne)';
  } catch {
    binOut.textContent = '⚠️ To nevyzerá ako binárny kód (len 0 a 1, oddelené medzerou).';
  }
});

// ---------- 4) MORSEOVKA ----------
const MORSE = {
  A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.',
  H: '....', I: '..', J: '.---', K: '-.-', L: '.-..', M: '--', N: '-.',
  O: '---', P: '.--.', Q: '--.-', R: '.-.', S: '...', T: '-', U: '..-',
  V: '...-', W: '.--', X: '-..-', Y: '-.--', Z: '--..',
  0: '-----', 1: '.----', 2: '..---', 3: '...--', 4: '....-',
  5: '.....', 6: '-....', 7: '--...', 8: '---..', 9: '----.'
};
const MORSE_REV = Object.fromEntries(Object.entries(MORSE).map(([k, v]) => [v, k]));

const morseText = document.getElementById('morseText');
const morseOut = document.getElementById('morseOut');

document.getElementById('toMorseBtn').addEventListener('click', () => {
  const m = morseText.value.toUpperCase().split('').map(c => {
    if (c === ' ') return '/';
    return MORSE[c] ?? '';
  }).filter(Boolean).join(' ');
  morseOut.textContent = m || '(prázdne)';
});

document.getElementById('fromMorseBtn').addEventListener('click', () => {
  const t = morseText.value.trim().split(' ').map(code => {
    if (code === '/') return ' ';
    return MORSE_REV[code] ?? '';
  }).join('');
  morseOut.textContent = t || '(prázdne)';
});

// Prehrať morseovku ako zvukové pípanie
document.getElementById('playMorseBtn').addEventListener('click', () => {
  const code = morseOut.textContent;
  if (!/^[.\-/ ]+$/.test(code)) {
    morseOut.textContent = 'Najprv klikni na "Na Morseovku" 😉';
    return;
  }
  playMorse(code);
});

function playMorse(code) {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return;
  const audio = new AudioCtx();
  const unit = 0.1; // dĺžka bodky v sekundách
  let time = audio.currentTime;
  const beep = (dur) => {
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    osc.frequency.value = 600;
    osc.type = 'sine';
    osc.connect(gain);
    gain.connect(audio.destination);
    gain.gain.setValueAtTime(0.25, time);
    osc.start(time);
    osc.stop(time + dur);
    time += dur + unit; // medzera za signálom
  };
  for (const ch of code) {
    if (ch === '.') beep(unit);
    else if (ch === '-') beep(unit * 3);
    else if (ch === ' ') time += unit * 2;
    else if (ch === '/') time += unit * 4;
  }
}

// ---------- 5) GENERÁTOR HESIEL ----------
const pwLen = document.getElementById('pwLen');
const lenVal = document.getElementById('lenVal');
const pwOut = document.getElementById('pwOut');
const pwStrength = document.getElementById('pwStrength');

pwLen.addEventListener('input', () => lenVal.textContent = pwLen.value);

document.getElementById('genPwBtn').addEventListener('click', () => {
  let chars = 'abcdefghijklmnopqrstuvwxyz';
  if (document.getElementById('pwUpper').checked) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (document.getElementById('pwNums').checked) chars += '0123456789';
  if (document.getElementById('pwSyms').checked) chars += '!@#$%^&*?-+';

  const len = +pwLen.value;
  const arr = new Uint32Array(len);
  crypto.getRandomValues(arr); // bezpečné náhodné čísla
  let pw = '';
  for (let i = 0; i < len; i++) pw += chars[arr[i] % chars.length];
  pwOut.textContent = pw;
  showStrength(len, chars.length);
});

function showStrength(len, variety) {
  const score = len * Math.log2(variety); // približná sila v bitoch
  let label, color;
  if (score < 40) { label = '🟠 Slabé – pridaj viac znakov!'; color = '#ff9900'; }
  else if (score < 60) { label = '🟡 Dobré'; color = '#ffe600'; }
  else if (score < 90) { label = '🟢 Silné!'; color = '#00ff66'; }
  else { label = '💪 Super silné – nezlomiteľné!'; color = '#00ff66'; }
  pwStrength.textContent = label;
  pwStrength.style.color = color;
}

// ---------- 6) KVÍZ O BEZPEČNOSTI ----------
const QUIZ = [
  {
    q: 'Aké heslo je najbezpečnejšie?',
    opts: ['123456', 'tvoje meno', 'Tr4ktor!Slon#92', 'heslo'],
    correct: 2
  },
  {
    q: 'Cudzí človek na internete chce tvoju adresu. Čo urobíš?',
    opts: ['Pošlem mu ju', 'Nepošlem a poviem rodičom', 'Pošlem len ulicu', 'Pošlem fotku domu'],
    correct: 1
  },
  {
    q: 'Čo robí ozajstný "etický" hacker?',
    opts: ['Kradne dáta', 'Ničí počítače', 'Pomáha nájsť a opraviť chyby', 'Šíri vírusy'],
    correct: 2
  },
  {
    q: 'Dostaneš email: "Vyhral si milión, klikni sem!". Čo to je?',
    opts: ['Pravda, kliknem!', 'Podvod (phishing), nekliknem', 'Pošlem to kamošom', 'Zadám tam heslo'],
    correct: 1
  },
  {
    q: 'Prečo je dobré mať rôzne heslá na rôznych stránkach?',
    opts: ['Je to zábava', 'Ak jedno uniknú, ostatné sú v bezpečí', 'Netreba to', 'Aby som ich zabudol'],
    correct: 1
  }
];

let quizIndex = 0;
let quizScore = 0;
const quizBox = document.getElementById('quizBox');
const quizScoreEl = document.getElementById('quizScore');

function renderQuiz() {
  if (quizIndex >= QUIZ.length) {
    quizBox.innerHTML = `<p class="quiz-q">🎉 Hotovo! Získal si <strong>${quizScore} / ${QUIZ.length}</strong> bodov.</p>`;
    quizScoreEl.textContent = quizScore === QUIZ.length
      ? '💯 Perfektné! Si ozajstný bezpečnostný expert!'
      : 'Skús to znova a buď ešte lepší! 💪';
    const btn = document.createElement('button');
    btn.textContent = '🔄 Hrať znova';
    btn.onclick = () => { quizIndex = 0; quizScore = 0; quizScoreEl.textContent = ''; renderQuiz(); };
    quizBox.appendChild(btn);
    return;
  }
  const item = QUIZ[quizIndex];
  quizScoreEl.textContent = `Otázka ${quizIndex + 1} / ${QUIZ.length}  ·  Skóre: ${quizScore}`;
  quizBox.innerHTML = `<p class="quiz-q">${item.q}</p>`;
  item.opts.forEach((opt, i) => {
    const b = document.createElement('button');
    b.className = 'quiz-opt';
    b.textContent = opt;
    b.onclick = () => answerQuiz(b, i, item.correct);
    quizBox.appendChild(b);
  });
}

function answerQuiz(btn, chosen, correct) {
  const buttons = quizBox.querySelectorAll('.quiz-opt');
  buttons.forEach(b => b.disabled = true);
  if (chosen === correct) {
    btn.classList.add('correct');
    quizScore++;
  } else {
    btn.classList.add('wrong');
    buttons[correct].classList.add('correct');
  }
  setTimeout(() => { quizIndex++; renderQuiz(); }, 1100);
}
renderQuiz();

// ---------- 7) HACKER TYPER ----------
const typerScreen = document.getElementById('typerScreen');
const HACKER_CODE = `function breakFirewall(target){
  const keys = crypto.generateKeys(2048);
  for (let i = 0; i < 0xFF; i++){
    socket.connect(target, port=8080 + i);
    if (scanPort(i).open){ inject(payload[i % 16]); }
  }
  return decrypt(buffer, keys.private);
}
class Bot extends Node {
  constructor(){ super(); this.status = "ACTIVE"; }
  async deploy(){ await this.ping("10.0.0." + rand()); }
}
const matrix = [...Array(256)].map((_, i) => i ^ 0xAB);
console.log("[OK] system online", matrix.length, "nodes");
`;
let typerPos = 0;
function typerHandle(e) {
  if (e.key === 'Escape') { typerScreen.textContent = ''; typerPos = 0; return; }
  if (e.key.length > 1 && e.key !== 'Enter' && e.key !== ' ') return; // ignoruj Shift, Ctrl...
  e.preventDefault();
  if (typerScreen.textContent.startsWith('▶')) typerScreen.textContent = '';
  // pri každom stlačení pridaj kúsok pripraveného kódu
  for (let i = 0; i < 4; i++) {
    typerScreen.textContent += HACKER_CODE[typerPos];
    typerPos = (typerPos + 1) % HACKER_CODE.length;
  }
  typerScreen.scrollTop = typerScreen.scrollHeight;
}
typerScreen.addEventListener('keydown', typerHandle);
typerScreen.addEventListener('click', () => typerScreen.focus());

// ---------- 8) LEETSPEAK ----------
const LEET = { a: '4', e: '3', i: '1', o: '0', s: '5', t: '7', l: '1', b: '8', g: '9' };
const LEET_REV = { '4': 'a', '3': 'e', '1': 'i', '0': 'o', '5': 's', '7': 't', '8': 'b', '9': 'g' };
const leetText = document.getElementById('leetText');
const leetOut = document.getElementById('leetOut');

document.getElementById('toLeetBtn').addEventListener('click', () => {
  leetOut.textContent = leetText.value.toLowerCase().replace(/[aeiostlbg]/g, c => LEET[c] || c);
});
document.getElementById('fromLeetBtn').addEventListener('click', () => {
  leetOut.textContent = leetText.value.replace(/[0134578]/g, c => LEET_REV[c] || c);
});

// ---------- 9) GENERÁTOR PREZÝVKY ----------
const NICK_ADJ = ['Tieňový', 'Kybernetický', 'Tajný', 'Zelený', 'Bleskový', 'Digitálny', 'Neviditeľný', 'Nočný', 'Kvantový', 'Ľadový'];
const NICK_NOUN = ['Drak', 'Vlk', 'Kód', 'Fantóm', 'Robot', 'Sokol', 'Pixel', 'Bajt', 'Tiger', 'Ninja'];
document.getElementById('genNickBtn').addEventListener('click', () => {
  const num = Math.floor(Math.random() * 1000);
  const nick = randomItem(NICK_ADJ) + randomItem(NICK_NOUN) + '_' + String(num).padStart(3, '0');
  document.getElementById('nickOut').textContent = '👾 ' + nick;
});

// ---------- 10) TEST SILY HESLA ----------
const crackInput = document.getElementById('crackInput');
const crackOut = document.getElementById('crackOut');
const crackBar = document.getElementById('crackBar');

function estimateCrack(pw) {
  if (!pw) return { text: 'Začni písať... ⌨️', label: '', color: '#00cc52' };
  let pool = 0;
  if (/[a-z]/.test(pw)) pool += 26;
  if (/[A-Z]/.test(pw)) pool += 26;
  if (/[0-9]/.test(pw)) pool += 10;
  if (/[^a-zA-Z0-9]/.test(pw)) pool += 30;
  const combos = Math.pow(pool, pw.length);
  const guessesPerSec = 1e9; // moderný počítač ~ miliarda pokusov/s
  const seconds = combos / guessesPerSec;
  return { text: '⏱️ Prelomenie by trvalo približne: ' + humanTime(seconds), ...verdict(seconds) };
}

function humanTime(s) {
  if (s < 1) return 'menej než sekundu 😱';
  const units = [
    ['rok', 31557600], ['deň', 86400], ['hodinu', 3600], ['minútu', 60], ['sekundu', 1]
  ];
  for (const [name, val] of units) {
    if (s >= val) {
      const n = Math.floor(s / val);
      if (n > 1e12) return 'miliardy rokov 🔒';
      return n.toLocaleString('sk-SK') + ' ' + plural(n, name);
    }
  }
  return 'okamih';
}
function plural(n, base) {
  const map = { 'rok': ['rok', 'roky', 'rokov'], 'deň': ['deň', 'dni', 'dní'],
    'hodinu': ['hodinu', 'hodiny', 'hodín'], 'minútu': ['minútu', 'minúty', 'minút'],
    'sekundu': ['sekundu', 'sekundy', 'sekúnd'] };
  const f = map[base];
  if (n === 1) return f[0];
  if (n >= 2 && n <= 4) return f[1];
  return f[2];
}
function verdict(seconds) {
  if (seconds < 60) return { label: '🟠 Slabé heslo! Pridaj viac znakov.', color: '#ff9900' };
  if (seconds < 31557600) return { label: '🟡 Dalo by sa lepšie.', color: '#ffe600' };
  return { label: '🟢 Silné heslo! Super práca.', color: '#00ff66' };
}
function updateCrack() {
  const r = estimateCrack(crackInput.value);
  crackOut.textContent = r.text;
  crackBar.textContent = r.label;
  crackBar.style.color = r.color;
}
crackInput.addEventListener('input', updateCrack);
updateCrack();

// ---------- 11) EMOJI ŠIFRA ----------
const EMOJI_SET = ['😀','😎','👾','🚀','🐱','🌟','🍕','🎸','🐉','🔥','🌈','⚡','🦄','🍀','🎈','🐢','🌊','🍎','🎁','🐙','🌙','🦊','🍩','🛸','🎯','🐝','🌵','🍔'];
const emojiText = document.getElementById('emojiText');
const emojiOut = document.getElementById('emojiOut');

document.getElementById('toEmojiBtn').addEventListener('click', () => {
  const out = [...emojiText.value].map(c => {
    const code = c.charCodeAt(0);
    // každý znak na 2 emoji (vysoká a nízka číslica v 28-kovej sústave)
    return EMOJI_SET[Math.floor(code / 28) % 28] + EMOJI_SET[code % 28];
  }).join(' ');
  emojiOut.textContent = out || '(prázdne)';
});
document.getElementById('fromEmojiBtn').addEventListener('click', () => {
  try {
    const pairs = emojiText.value.trim().split(/\s+/);
    const text = pairs.map(p => {
      const chars = [...p];
      const hi = EMOJI_SET.indexOf(chars[0]);
      const lo = EMOJI_SET.indexOf(chars[1]);
      if (hi < 0 || lo < 0) return '';
      return String.fromCharCode(hi * 28 + lo);
    }).join('');
    emojiOut.textContent = text || '⚠️ To nevyzerá ako emoji šifra.';
  } catch {
    emojiOut.textContent = '⚠️ To nevyzerá ako emoji šifra.';
  }
});

// ---------- 12) SIEŤOVÝ SKENER (naoko) ----------
const scanOut = document.getElementById('scanOut');
document.getElementById('scanBtn').addEventListener('click', () => {
  scanOut.innerHTML = '';
  const devices = [
    'Router (brána do internetu)', 'Mobil v obývačke', 'Smart TV',
    'Notebook', 'Tlačiareň', 'Herná konzola', 'Chladnička 🧊', 'Tablet'
  ];
  const lines = ['🔍 Skenujem sieť 192.168.1.0 ...', ''];
  let i = 0;
  const print = (t) => { const d = document.createElement('div'); d.className = 'line'; d.textContent = t; scanOut.appendChild(d); scanOut.scrollTop = scanOut.scrollHeight; };
  const t = setInterval(() => {
    if (i < lines.length) { print(lines[i++]); return; }
    const idx = i - lines.length;
    if (idx < devices.length) {
      const ip = '192.168.1.' + (10 + idx);
      print('✓ ' + ip.padEnd(15) + ' → ' + devices[idx]);
      i++;
    } else {
      clearInterval(t);
      print('');
      print('Našiel som ' + devices.length + ' zariadení! 🎉');
      print('💡 IP adresa je ako adresa domu – hovorí, kam poslať dáta.');
      print('(Toto sú len vymyslené ukážkové zariadenia.)');
    }
  }, 350);
});

// ---------- POMOCNÉ ----------
function randomItem(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

// Privítanie v konzole pre zvedavých hackerov 😉
console.log('%c👾 Ahoj zvedavý hacker!', 'color:#00ff66;font-size:20px;font-weight:bold');
console.log('%cVšimol si si, že si otvoril vývojársku konzolu? Presne toto robia ozajstní programátori! Buď zvedavý a uč sa. 🟢', 'color:#00ff66');
