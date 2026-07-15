(() => {
  const navToggle = document.querySelector(".nav-toggle");
  const siteHeader = document.querySelector(".site-header");
  const stageSections = Array.from(document.querySelectorAll("[data-required-stage]"));
  const stageItems = Array.from(document.querySelectorAll("[data-stage-target]"));
  const overlayTitle = document.getElementById("overlay-title");
  const overlayCopy = document.getElementById("overlay-copy");
  const currentStageEl = document.getElementById("current-stage");
  const bestScoreEl = document.getElementById("best-score");
  const gameStateEl = document.getElementById("game-state");
  const unlockedCountEl = document.getElementById("unlocked-count");
  const scoreValueEl = document.getElementById("score-value");
  const stageValueEl = document.getElementById("stage-value");
  const bestValueEl = document.getElementById("best-value");
  const canvas = document.getElementById("game-canvas");
  const ctx = canvas.getContext("2d");
  const btnFlap = document.getElementById("btn-flap");
  const btnDive = document.getElementById("btn-dive");
  const btnStart = document.getElementById("btn-start");
  const btnPause = document.getElementById("btn-pause");
  const btnRestart = document.getElementById("btn-restart");

  const STORAGE_STAGE = "kimdasomee.unlockStage";
  const STORAGE_BEST = "kimdasomee.bestScore";

  const state = {
    running: false,
    paused: false,
    gameOver: false,
    score: 0,
    bestScore: Number(localStorage.getItem(STORAGE_BEST) || 0),
    stage: 0,
    unlockStage: Number(localStorage.getItem(STORAGE_STAGE) || 0),
    bird: { x: 0, y: 0, vy: 0 },
    pipes: [],
    spawnTimer: 0,
    lastFrame: 0,
    runId: 0,
    dimensions: { width: 960, height: 540 },
  };

  const config = {
    gravity: 1800,
    flapVelocity: -560,
    diveVelocity: 350,
    birdRadius: 18,
    pipeWidth: 82,
    gapMin: 164,
    gapMax: 222,
    pipeSpeed: 240,
    spawnInterval: 1.65,
    stageThresholds: [0, 1, 2, 3, 4, 5],
  };

  const stageLabels = [
    "대기",
    "1단계",
    "2단계",
    "3단계",
    "4단계",
    "최종 단계",
  ];

  const saveProgress = () => {
    localStorage.setItem(STORAGE_STAGE, String(state.unlockStage));
    localStorage.setItem(STORAGE_BEST, String(state.bestScore));
  };

  const setOverlay = (title, copy) => {
    overlayTitle.textContent = title;
    overlayCopy.textContent = copy;
  };

  const setGameState = (label) => {
    gameStateEl.textContent = label;
  };

  const updateHud = () => {
    currentStageEl.textContent = stageLabels[state.stage] || "대기";
    scoreValueEl.textContent = String(state.score);
    stageValueEl.textContent = String(state.stage);
    bestScoreEl.textContent = String(state.bestScore);
    bestValueEl.textContent = String(state.bestScore);
    unlockedCountEl.textContent = `${state.unlockStage} / 5`;
  };

  const setUnlockedStage = (stage) => {
    state.unlockStage = Math.max(state.unlockStage, stage);
    stageSections.forEach((section) => {
      const required = Number(section.dataset.requiredStage);
      const unlocked = state.unlockStage >= required;
      section.classList.toggle("is-unlocked", unlocked);
    });
    stageItems.forEach((item) => {
      const target = Number(item.dataset.stageTarget);
      item.classList.toggle("is-cleared", state.unlockStage >= target);
      item.classList.toggle("is-active", state.stage === target);
    });
    saveProgress();
    updateHud();
  };

  const setStageFromScore = () => {
    const nextStage = Math.max(
      0,
      ...config.stageThresholds.filter((threshold) => state.score >= threshold)
    );
    if (nextStage !== state.stage) {
      state.stage = nextStage;
      setOverlay(stageLabels[nextStage], nextStage === 5 ? "최종 단계가 열렸습니다." : "섹션 잠금이 해제되었습니다.");
      setUnlockedStage(nextStage);
    } else {
      updateHud();
    }
  };

  const resizeCanvas = () => {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const width = Math.max(320, Math.round(rect.width));
    const height = Math.max(380, Math.round(rect.height));
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    state.dimensions.width = width;
    state.dimensions.height = height;
    if (state.bird.y === 0) {
      state.bird.x = Math.round(width * 0.24);
      state.bird.y = Math.round(height * 0.5);
    }
  };

  const resetBird = () => {
    state.bird.x = Math.round(state.dimensions.width * 0.24);
    state.bird.y = Math.round(state.dimensions.height * 0.5);
    state.bird.vy = 0;
  };

  const resetRun = (keepProgress = true) => {
    state.runId += 1;
    state.running = false;
    state.paused = false;
    state.gameOver = false;
    state.score = 0;
    state.stage = keepProgress ? state.unlockStage : 0;
    state.pipes = [];
    state.spawnTimer = 0;
    state.lastFrame = 0;
    resetBird();
    updateHud();
    setOverlay("준비 완료", "시작 버튼이나 위 버튼으로 게임을 시작하세요.");
    setGameState("대기");
    btnPause.textContent = "일시정지";
  };

  const startRun = () => {
    if (state.gameOver) {
      resetRun(true);
    }
    if (state.running && !state.gameOver) {
      return;
    }
    state.running = true;
    state.paused = false;
    setOverlay("게임 진행 중", "위/Space 또는 위 버튼으로 비행하세요.");
    setGameState("진행 중");
    btnPause.textContent = "일시정지";
    state.lastFrame = performance.now();
    const activeRunId = state.runId;
    requestAnimationFrame((time) => loop(time, activeRunId));
  };

  const togglePause = () => {
    if (!state.running || state.gameOver) return;
    state.paused = !state.paused;
    setGameState(state.paused ? "일시정지" : "진행 중");
    btnPause.textContent = state.paused ? "재개" : "일시정지";
    setOverlay(state.paused ? "일시정지" : "게임 진행 중", state.paused ? "재개하면 계속 진행됩니다." : "계속 앞으로 나아가세요.");
    if (!state.paused) {
      state.lastFrame = performance.now();
      const activeRunId = state.runId;
      requestAnimationFrame((time) => loop(time, activeRunId));
    }
  };

  const flap = () => {
    if (state.gameOver) return;
    if (!state.running) {
      startRun();
    }
    state.bird.vy = config.flapVelocity;
    setGameState("진행 중");
    setOverlay("비행 중", "장애물을 피하며 스테이지를 클리어하세요.");
  };

  const dive = () => {
    if (!state.running || state.paused || state.gameOver) return;
    state.bird.vy = config.diveVelocity;
    setOverlay("하강 중", "고도를 조정할 때만 잠깐 사용하세요.");
  };

  const createPipe = () => {
    const height = state.dimensions.height;
    const gapSize = Math.max(config.gapMin, Math.min(config.gapMax, height * 0.32));
    const safeTop = 70;
    const maxGapTop = Math.max(safeTop + 40, height - gapSize - 100);
    const gapTop = Math.round(safeTop + Math.random() * (maxGapTop - safeTop));
    state.pipes.push({
      x: state.dimensions.width + 40,
      gapTop,
      gapHeight: gapSize,
      scored: false,
    });
  };

  const circleRectHit = (cx, cy, radius, rect) => {
    const nearestX = Math.max(rect.x, Math.min(cx, rect.x + rect.w));
    const nearestY = Math.max(rect.y, Math.min(cy, rect.y + rect.h));
    const dx = cx - nearestX;
    const dy = cy - nearestY;
    return dx * dx + dy * dy <= radius * radius;
  };

  const endGame = () => {
    state.running = false;
    state.gameOver = true;
    state.paused = false;
    state.bestScore = Math.max(state.bestScore, state.score);
    saveProgress();
    updateHud();
    setGameState("게임 오버");
    setOverlay("게임 오버", "재시작 버튼으로 다시 도전하세요.");
    btnPause.textContent = "일시정지";
  };

  const update = (delta) => {
    if (!state.running || state.paused || state.gameOver) return;

    state.spawnTimer += delta;
    if (state.spawnTimer >= config.spawnInterval) {
      state.spawnTimer = 0;
      createPipe();
    }

    state.bird.vy += config.gravity * delta;
    state.bird.y += state.bird.vy * delta;

    const floor = state.dimensions.height - 26;
    if (state.bird.y + config.birdRadius >= floor || state.bird.y - config.birdRadius <= 20) {
      endGame();
      return;
    }

    state.pipes.forEach((pipe) => {
      pipe.x -= config.pipeSpeed * delta;
      if (!pipe.scored && pipe.x + config.pipeWidth < state.bird.x) {
        pipe.scored = true;
        state.score += 1;
        state.bestScore = Math.max(state.bestScore, state.score);
        setStageFromScore();
        saveProgress();
        setGameState("진행 중");
      }
    });

    while (state.pipes.length && state.pipes[0].x + config.pipeWidth < -40) {
      state.pipes.shift();
    }

    const birdRect = {
      x: state.bird.x - config.birdRadius,
      y: state.bird.y - config.birdRadius,
      w: config.birdRadius * 2,
      h: config.birdRadius * 2,
    };

    for (const pipe of state.pipes) {
      const topRect = { x: pipe.x, y: 0, w: config.pipeWidth, h: pipe.gapTop };
      const bottomRect = {
        x: pipe.x,
        y: pipe.gapTop + pipe.gapHeight,
        w: config.pipeWidth,
        h: state.dimensions.height,
      };

      if (
        circleRectHit(state.bird.x, state.bird.y, config.birdRadius, topRect) ||
        circleRectHit(state.bird.x, state.bird.y, config.birdRadius, bottomRect)
      ) {
        endGame();
        return;
      }
      if (
        birdRect.x < pipe.x + config.pipeWidth &&
        birdRect.x + birdRect.w > pipe.x &&
        birdRect.y < pipe.gapTop &&
        birdRect.y + birdRect.h > 0
      ) {
        endGame();
        return;
      }
    }

    updateHud();
  };

  const drawBackground = () => {
    const { width, height } = state.dimensions;
    const sky = ctx.createLinearGradient(0, 0, 0, height);
    sky.addColorStop(0, "#0a1621");
    sky.addColorStop(0.55, "#10283a");
    sky.addColorStop(1, "#050b11");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, width, height);

    const glow = ctx.createRadialGradient(width * 0.24, height * 0.18, 24, width * 0.24, height * 0.18, width * 0.8);
    glow.addColorStop(0, "rgba(100, 240, 200, 0.14)");
    glow.addColorStop(1, "transparent");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "rgba(255,255,255,0.05)";
    for (let i = 0; i < 18; i += 1) {
      const x = (i * 73 + (state.score * 7)) % width;
      const y = (i * 41 + 30) % height;
      ctx.fillRect(x, y, 2, 2);
    }
  };

  const drawPipes = () => {
    const { width, height } = state.dimensions;
    state.pipes.forEach((pipe) => {
      const pipeGradient = ctx.createLinearGradient(pipe.x, 0, pipe.x + config.pipeWidth, 0);
      pipeGradient.addColorStop(0, "#38f7d0");
      pipeGradient.addColorStop(0.5, "#1da7ff");
      pipeGradient.addColorStop(1, "#0d526a");

      ctx.fillStyle = pipeGradient;
      ctx.fillRect(pipe.x, 0, config.pipeWidth, pipe.gapTop);
      ctx.fillRect(pipe.x, pipe.gapTop + pipe.gapHeight, config.pipeWidth, height);

      ctx.fillStyle = "rgba(255,255,255,0.12)";
      ctx.fillRect(pipe.x + config.pipeWidth - 12, 0, 12, pipe.gapTop);
      ctx.fillRect(pipe.x + config.pipeWidth - 12, pipe.gapTop + pipe.gapHeight, 12, height);

      ctx.fillStyle = "rgba(255,255,255,0.24)";
      ctx.fillRect(pipe.x - 4, pipe.gapTop - 14, config.pipeWidth + 8, 14);
      ctx.fillRect(pipe.x - 4, pipe.gapTop + pipe.gapHeight, config.pipeWidth + 8, 14);
    });

    ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
    ctx.fillRect(0, height - 26, width, 26);
  };

  const drawBird = () => {
    ctx.save();
    ctx.translate(state.bird.x, state.bird.y);
    const tilt = Math.max(-0.7, Math.min(0.9, state.bird.vy / 650));
    ctx.rotate(tilt);

    const body = ctx.createRadialGradient(-4, -4, 4, 0, 0, config.birdRadius + 12);
    body.addColorStop(0, "#ffffff");
    body.addColorStop(0.35, "#b4fff0");
    body.addColorStop(1, "#4ed6ff");
    ctx.fillStyle = body;
    ctx.beginPath();
    ctx.arc(0, 0, config.birdRadius + 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#051016";
    ctx.beginPath();
    ctx.arc(8, -4, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ffd36a";
    ctx.beginPath();
    ctx.moveTo(12, 2);
    ctx.lineTo(23, 5);
    ctx.lineTo(12, 10);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  };

  const drawHud = () => {
    const { width } = state.dimensions;
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.font = "600 18px Inter, Arial, sans-serif";
    ctx.fillText(`점수 ${state.score}`, 18, 30);
    ctx.fillText(`단계 ${state.stage}`, 18, 54);
    ctx.fillText(`최고 ${state.bestScore}`, width - 120, 30);
  };

  const render = () => {
    drawBackground();
    drawPipes();
    drawBird();
    drawHud();
  };

  const loop = (time, runId) => {
    if (runId !== state.runId) return;
    if (!state.lastFrame) state.lastFrame = time;
    const delta = Math.min(0.033, (time - state.lastFrame) / 1000);
    state.lastFrame = time;
    update(delta);
    render();
    if (state.running && !state.paused && !state.gameOver) {
      requestAnimationFrame((nextTime) => loop(nextTime, runId));
    }
  };

  const handleKeydown = (event) => {
    const key = event.key.toLowerCase();
    if (key === " " || key === "arrowup" || key === "w") {
      event.preventDefault();
      flap();
    } else if (key === "arrowdown" || key === "s") {
      event.preventDefault();
      dive();
    } else if (key === "p") {
      event.preventDefault();
      togglePause();
    } else if (key === "r") {
      event.preventDefault();
      resetRun(true);
      startRun();
    }
  };

  navToggle?.addEventListener("click", () => {
    const open = siteHeader.dataset.navOpen === "true";
    siteHeader.dataset.navOpen = String(!open);
    navToggle.setAttribute("aria-expanded", String(!open));
  });

  btnFlap?.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    flap();
  });
  btnDive?.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    dive();
  });
  btnStart?.addEventListener("click", startRun);
  btnPause?.addEventListener("click", togglePause);
  btnRestart?.addEventListener("click", () => {
    resetRun(true);
    startRun();
  });
  window.addEventListener("keydown", handleKeydown);
  window.addEventListener("resize", () => {
    resizeCanvas();
    render();
  });

  const init = () => {
    resizeCanvas();
    state.unlockStage = Number(localStorage.getItem(STORAGE_STAGE) || 0);
    state.bestScore = Number(localStorage.getItem(STORAGE_BEST) || 0);
    setUnlockedStage(Math.max(state.unlockStage, 0));
    state.stage = state.unlockStage;
    updateHud();
    render();
    resetRun(true);
    setOverlay("준비 완료", "시작 버튼이나 위 버튼으로 게임을 시작하세요.");
    setGameState("대기");
  };

  init();
})();
