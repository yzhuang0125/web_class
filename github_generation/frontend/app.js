const canvas = document.getElementById('officeCanvas');
const ctx = canvas.getContext('2d');
const playerStatus = document.getElementById('playerStatus');
const npcContext = document.getElementById('npcContext');
const npcQuestion = document.getElementById('npcQuestion');
const optionsContainer = document.getElementById('options');
const scoreDisplay = document.getElementById('score');
const scoreChart = document.getElementById('scoreChart');

const gridCells = 8;
const cellSize = canvas.width / gridCells;
let score = 0;
let correctCount = 0;
let wrongCount = 0;
let currentQuestion = null;

const characterImage = new Image();
characterImage.src = '/static/images/main_role.png';

const spriteConfig = {
  width: 64,
  height: 64,
  frames: 4,
  directions: {
    down: 0,
    right: 1,
    left: 2,
    up: 3
  }
};

const player = {
  x: 1,
  y: 0,
  direction: 'down',
  frameIndex: 1,
  drawSize: 56
};

const npcs = [
  { name: 'Alice', x: 3, y: 2, color: '#2563eb', status: '需要你幫忙檢查郵件。' },
  { name: 'Bob', x: 6, y: 3, color: '#ef4444', status: '要你討論會議安排。' },
  { name: 'Carol', x: 2, y: 5, color: '#10b981', status: '想確認是否能訂會議室。' },
  { name: 'Dave', x: 5, y: 1, color: '#f59e0b', status: '想聊新的演示文稿。' }
];

function drawOffice() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 1;

  for (let i = 0; i <= gridCells; i++) {
    ctx.beginPath();
    ctx.moveTo(i * cellSize, 0);
    ctx.lineTo(i * cellSize, canvas.height);
    ctx.moveTo(0, i * cellSize);
    ctx.lineTo(canvas.width, i * cellSize);
    ctx.stroke();
  }

  npcs.forEach(npc => {
    const centerX = npc.x * cellSize + cellSize / 2;
    const centerY = npc.y * cellSize + cellSize / 2;
    ctx.fillStyle = npc.color;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(npc.name, centerX, centerY + 4);
  });

  drawPlayer();
}

function drawPlayer() {
  const frameX = player.frameIndex * spriteConfig.width;
  const frameY = spriteConfig.directions[player.direction] * spriteConfig.height;
  const drawX = player.x * cellSize + (cellSize - player.drawSize) / 2;
  const drawY = player.y * cellSize + (cellSize - player.drawSize) / 2;

  if (characterImage.complete && characterImage.naturalWidth > 0) {
    ctx.drawImage(
      characterImage,
      frameX,
      frameY,
      spriteConfig.width,
      spriteConfig.height,
      drawX,
      drawY,
      player.drawSize,
      player.drawSize
    );
  } else {
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(player.x * cellSize + cellSize / 2, player.y * cellSize + cellSize / 2, 12, 0, Math.PI * 2);
    ctx.fill();
  }
}

function updateChart() {
  const chartData = [{
    x: ['Correct', 'Wrong'],
    y: [correctCount, wrongCount],
    type: 'bar',
    marker: { color: ['#16a34a', '#dc2626'] }
  }];
  const layout = {
    margin: { t: 20, b: 30, l: 30, r: 20 },
    yaxis: { title: '次數', rangemode: 'tozero' }
  };
  Plotly.newPlot(scoreChart, chartData, layout, { responsive: true });
}

function displayQuestion(data) {
  currentQuestion = data;
  npcContext.textContent = `${data.npc}：${data.context}`;
  npcQuestion.textContent = data.question;
  optionsContainer.innerHTML = '';

  data.options.forEach((text, index) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = text;
    btn.addEventListener('click', () => submitAnswer(index, btn));
    optionsContainer.appendChild(btn);
  });
}

function submitAnswer(index, button) {
  if (!currentQuestion) {
    return;
  }

  fetch('/api/evaluate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: currentQuestion.id, selected: index })
  })
    .then(response => response.json())
    .then(result => {
      if (result.correct) {
        score += 10;
        correctCount += 1;
        button.classList.add('correct');
      } else {
        wrongCount += 1;
        button.classList.add('wrong');
      }
      scoreDisplay.textContent = score;
      playerStatus.textContent = result.message;
      updateChart();
      highlightCorrectOption(result.correctIndex);
    })
    .catch(() => {
      playerStatus.textContent = '取得題目失敗，請稍後再試。';
    });
}

function highlightCorrectOption(correctIndex) {
  const buttons = optionsContainer.querySelectorAll('button');
  buttons.forEach((btn, idx) => {
    if (idx === correctIndex) {
      btn.classList.add('correct');
    }
    btn.disabled = true;
  });
}

function getQuestionForNearbyNPC(npc) {
  fetch('/api/question')
    .then(response => response.json())
    .then(displayQuestion)
    .catch(() => {
      playerStatus.textContent = '無法連接後端 API。';
    });
}

function isNearNPC(npc) {
  const dx = player.x - npc.x;
  const dy = player.y - npc.y;
  return Math.abs(dx) <= 1 && Math.abs(dy) <= 1;
}

function getDirectionFromMovement(dx, dy) {
  if (Math.abs(dx) > Math.abs(dy)) {
    return dx > 0 ? 'left' : 'right';
  }
  if (Math.abs(dy) > 0) {
    return dy > 0 ? 'down' : 'up';
  }
  return player.direction;
}

function movePlayer(dx, dy) {
  const nextX = Math.max(0, Math.min(gridCells - 1, player.x + dx));
  const nextY = Math.max(0, Math.min(gridCells - 1, player.y + dy));

  if (nextX === player.x && nextY === player.y) {
    return;
  }

  player.direction = getDirectionFromMovement(dx, dy);
  player.frameIndex = (player.frameIndex + 1) % spriteConfig.frames;
  player.x = nextX;
  player.y = nextY;
  drawOffice();

  const nearbyNPC = npcs.find(isNearNPC);
  if (nearbyNPC) {
    playerStatus.textContent = `靠近 ${nearbyNPC.name}：${nearbyNPC.status}`;
    getQuestionForNearbyNPC(nearbyNPC);
  } else {
    playerStatus.textContent = '已移動至新位置，請靠近 NPC 開始對話。';
    npcContext.textContent = '靠近 NPC 後開始對話。';
    npcQuestion.textContent = '';
    optionsContainer.innerHTML = '';
  }
}

canvas.addEventListener('click', event => {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const gridX = Math.floor(x / cellSize);
  const gridY = Math.floor(y / cellSize);
  const dx = gridX - player.x;
  const dy = gridY - player.y;

  movePlayer(dx, dy);
});

window.addEventListener('keydown', event => {
  const key = event.key;
  let dx = 0;
  let dy = 0;

  if (key === 'ArrowUp' || key === 'w' || key === 'W') {
    dy = -1;
  } else if (key === 'ArrowDown' || key === 's' || key === 'S') {
    dy = 1;
  } else if (key === 'ArrowLeft' || key === 'a' || key === 'A') {
    dx = -1;
  } else if (key === 'ArrowRight' || key === 'd' || key === 'D') {
    dx = 1;
  } else {
    return;
  }

  event.preventDefault();
  movePlayer(dx, dy);
});

window.addEventListener('load', () => {
  if (characterImage.complete) {
    drawOffice();
  } else {
    characterImage.onload = drawOffice;
  }
  updateChart();
  playerStatus.textContent = '使用上下左右鍵移動角色。';
});
