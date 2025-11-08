<template>
  <canvas 
    ref="canvas"
    class="game-canvas"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
    @click="handleClick"
  ></canvas>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { FallingObjectFactory } from '../game/FallingObjectsConfig.js'

const props = defineProps({
  gameState: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['game-over', 'score-update'])

const canvas = ref(null)
let ctx = null
let animationId = null

// Configurazioni del gioco
const LANES = 3
let GAME_WIDTH = 600 // Larghezza che si adatta allo schermo
let LANE_WIDTH = GAME_WIDTH / LANES
let CANVAS_WIDTH = GAME_WIDTH
let CANVAS_HEIGHT = 800

// Touch controls per mobile
const touchData = ref({
  startX: 0,
  startY: 0,
  moveX: 0,
  isDragging: false
})

// Stato del gioco
const gameData = ref({
  isPlaying: false,
  score: 0,
  gameSpeed: 4.5, // Aumentato da 3 a 4.5 per mobile
  frameCount: 0
})

// Effetti visivi
const visualEffects = ref({
  screenFlash: null, // 'hit' per rosso, 'collect' per dorato
  flashIntensity: 0
})

// Player
const player = ref({
  lane: 1,
  targetLane: 1,
  x: GAME_WIDTH / 2, // Centro della board
  y: 650, // Sarà aggiornato da resizeCanvas
  width: 100,
  height: 130,
  color: '#ff6b6b',
  speed: 10,
  image: null,
  imageLoaded: false
})

// Arrays per ostacoli e oggetti da raccogliere
const obstacles = ref([])
const collectibles = ref([])

// Array per i punteggi che volano via
const floatingScores = ref([])

// Oggetto per l'animazione di death
const deathAnimation = ref({
  active: false,
  object: null,
  scale: 1,
  targetScale: 10,
  duration: 1000, // 1 secondo
  startTime: null
})

// Elementi decorativi per lo sfondo
const backgroundElements = ref([])

function initBackgroundElements() {
  backgroundElements.value = []
  
  // Crea elementi decorativi fissi nello sfondo
  const elementTypes = ['🏠', '🌳', '☁️', '🏢', '🌿', '🏫']
  
  for (let i = 0; i < 12; i++) {
    backgroundElements.value.push({
      type: elementTypes[Math.floor(Math.random() * elementTypes.length)],
      x: Math.random() * CANVAS_WIDTH,
      y: Math.random() * CANVAS_HEIGHT,
      size: 20 + Math.random() * 30,
      opacity: 0.15 + Math.random() * 0.15,
      speed: 0.3 + Math.random() * 0.5
    })
  }
}

onMounted(() => {
  // Imposta le dimensioni del canvas
  resizeCanvas()
  
  ctx = canvas.value.getContext('2d')
  setupKeyboardListeners()
  
  // Carica l'immagine del player
  loadPlayerImage()
  
  // Inizializza elementi decorativi
  initBackgroundElements()
  
  // Aggiungi listener per il ridimensionamento
  window.addEventListener('resize', resizeCanvas)
  
  draw() // Disegna lo stato iniziale
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  removeKeyboardListeners()
  window.removeEventListener('resize', resizeCanvas)
})

watch(() => props.gameState, (newState) => {
  if (newState === 'playing') {
    gameData.value.isPlaying = true
    // Ferma il loop precedente se esiste
    if (animationId) {
      cancelAnimationFrame(animationId)
      animationId = null
    }
    // Avvia sempre un nuovo game loop
    gameLoop()
  } else {
    gameData.value.isPlaying = false
    if (animationId) {
      cancelAnimationFrame(animationId)
      animationId = null
    }
  }
})

function setupKeyboardListeners() {
  document.addEventListener('keydown', handleKeydown)
}

function removeKeyboardListeners() {
  document.removeEventListener('keydown', handleKeydown)
}

function loadPlayerImage() {
  player.value.image = new Image()
  player.value.image.onload = () => {
    player.value.imageLoaded = true
    draw() // Ridisegna quando l'immagine è caricata
  }
  player.value.image.onerror = () => {
    console.warn('Errore nel caricamento dell\'immagine del player')
    player.value.imageLoaded = false
  }
  player.value.image.src = '/images/player.webp'
}

function resizeCanvas() {
  if (!canvas.value) return
  
  // Adatta la larghezza allo schermo su mobile, max 600px su desktop
  const isMobile = window.innerWidth < 768
  GAME_WIDTH = isMobile ? Math.min(window.innerWidth, 600) : 600
  CANVAS_WIDTH = GAME_WIDTH
  CANVAS_HEIGHT = window.innerHeight
  LANE_WIDTH = CANVAS_WIDTH / LANES
  
  canvas.value.width = CANVAS_WIDTH
  canvas.value.height = CANVAS_HEIGHT
  
  // Aggiorna la posizione del player
  player.value.x = LANE_WIDTH * player.value.targetLane + LANE_WIDTH / 2
  player.value.y = CANVAS_HEIGHT - 150
  
  // Re-inizializza elementi decorativi quando si ridimensiona
  if (backgroundElements.value.length > 0) {
    initBackgroundElements()
  }
}

function handleKeydown(e) {
  if (!gameData.value.isPlaying) return
  
  if (e.key === 'ArrowLeft' && player.value.targetLane > 0) {
    player.value.targetLane--
  } else if (e.key === 'ArrowRight' && player.value.targetLane < LANES - 1) {
    player.value.targetLane++
  }
}

function handleClick() {
  // Controlli touch per mobile - determina la corsia in base alla posizione del click
  if (!gameData.value.isPlaying) return
  
  const rect = canvas.value.getBoundingClientRect()
  const clickX = event.clientX - rect.left
  const clickedLane = Math.floor(clickX / LANE_WIDTH)
  
  if (clickedLane >= 0 && clickedLane < LANES) {
    player.value.targetLane = clickedLane
  }
}

function handleTouchStart(e) {
  if (!gameData.value.isPlaying) return
  e.preventDefault()
  
  const touch = e.touches[0]
  touchData.value.startX = touch.clientX
  touchData.value.startY = touch.clientY
  touchData.value.isDragging = true
}

function handleTouchMove(e) {
  if (!gameData.value.isPlaying || !touchData.value.isDragging) return
  e.preventDefault()
  
  const touch = e.touches[0]
  touchData.value.moveX = touch.clientX
}

function handleTouchEnd(e) {
  if (!gameData.value.isPlaying || !touchData.value.isDragging) return
  e.preventDefault()
  
  const deltaX = touchData.value.moveX - touchData.value.startX
  const swipeThreshold = 30 // pixel minimi per considerarlo uno swipe
  
  // Swipe verso destra
  if (deltaX > swipeThreshold && player.value.targetLane < LANES - 1) {
    player.value.targetLane++
  } 
  // Swipe verso sinistra
  else if (deltaX < -swipeThreshold && player.value.targetLane > 0) {
    player.value.targetLane--
  }
  // Se non è uno swipe, considera come tap e vai alla corsia più vicina
  else if (Math.abs(deltaX) < swipeThreshold) {
    const rect = canvas.value.getBoundingClientRect()
    const tapX = touchData.value.startX - rect.left
    const tappedLane = Math.floor(tapX / LANE_WIDTH)
    
    if (tappedLane >= 0 && tappedLane < LANES) {
      player.value.targetLane = tappedLane
    }
  }
  
  touchData.value.isDragging = false
  touchData.value.startX = 0
  touchData.value.moveX = 0
}

function spawnObstacle() {
  const lane = Math.floor(Math.random() * LANES)
  const obstacle = FallingObjectFactory.createObstacle()
  obstacle.setLane(lane, LANE_WIDTH)
  obstacles.value.push(obstacle)
}

function spawnCollectible() {
  const lane = Math.floor(Math.random() * LANES)
  const collectible = FallingObjectFactory.createCollectible()
  collectible.setLane(lane, LANE_WIDTH)
  collectibles.value.push(collectible)
}

function updatePlayer() {
  const targetX = LANE_WIDTH * player.value.targetLane + LANE_WIDTH / 2
  if (Math.abs(player.value.x - targetX) > 1) {
    player.value.x += (targetX - player.value.x) * 0.2
  } else {
    player.value.x = targetX
    player.value.lane = player.value.targetLane
  }
}

function updateObstacles() {
  obstacles.value = obstacles.value.filter(obs => !obs.isOffScreen(CANVAS_HEIGHT))
  
  obstacles.value.forEach(obs => {
    obs.update(gameData.value.gameSpeed)
  })

  // Spawn più distanziato: da 80 a 110 frames (quasi 2 secondi a 60fps)
  if (gameData.value.frameCount % 110 === 0) {
    spawnObstacle()
  }
}

function updateCollectibles() {
  collectibles.value = collectibles.value.filter(col => !col.isOffScreen(CANVAS_HEIGHT))
  
  for (let i = collectibles.value.length - 1; i >= 0; i--) {
    let col = collectibles.value[i]
    col.update(gameData.value.gameSpeed)

    if (checkCollision(player.value, col)) {
      // Crea punteggio volante
      createFloatingScore(col.gameplay.points, col.position.x, col.position.y)
      
      // Rimuovi oggetto
      collectibles.value.splice(i, 1)
      
      // Aggiorna punteggio
      gameData.value.score += col.gameplay.points
      
      // Effetto visivo positivo
      visualEffects.value.screenFlash = 'collect'
      visualEffects.value.flashIntensity = 0.3
      
      emit('score-update', gameData.value.score)
    }
  }

  // Spawn più distanziato: da 150 a 180 frames (3 secondi a 60fps)
  if (gameData.value.frameCount % 180 === 0) {
    spawnCollectible()
  }
}

function checkCollision(rect1, obj2) {
  // Usa la nuova hitbox per oggetti più precisi
  const hitbox2 = obj2.getHitbox ? obj2.getHitbox() : {
    x: obj2.x - obj2.width / 2,
    y: obj2.y - obj2.height / 2,
    width: obj2.width,
    height: obj2.height
  }
  
  const r1 = {
    x: rect1.x - rect1.width / 2,
    y: rect1.y - rect1.height / 2,
    width: rect1.width,
    height: rect1.height
  }
  
  return r1.x < hitbox2.x + hitbox2.width &&
         r1.x + r1.width > hitbox2.x &&
         r1.y < hitbox2.y + hitbox2.height &&
         r1.y + r1.height > hitbox2.y
}

function checkCollectibles() {
  for (let i = collectibles.value.length - 1; i >= 0; i--) {
    let coll = collectibles.value[i]
    if (Math.abs(player.value.lane - coll.position.lane) < 0.3 && checkCollision(player.value, coll)) {
      console.log('Collectible hit! Points:', coll.points)
      
      // Crea punteggio volante
      createFloatingScore(coll.points, coll.position.x, coll.position.y)
      
      // Effetto visivo positivo
      visualEffects.value.screenFlash = 'collect'
      visualEffects.value.flashIntensity = 0.3
      
      // Aggiorna punteggio
      gameData.value.score += coll.points
      emit('score-update', gameData.value.score)
      
      // Rimuovi oggetto
      collectibles.value.splice(i, 1)
    }
  }
}

/**
 * Crea un punteggio che vola via dalla posizione dell'oggetto
 */
function createFloatingScore(points, x, y) {
  floatingScores.value.push({
    points: points,
    x: x,
    y: y,
    initialY: y,
    opacity: 1,
    scale: 1,
    life: 60 // frames di vita (1 secondo a 60fps)
  })
}

/**
 * Aggiorna e disegna i punteggi volanti
 */
function updateFloatingScores() {
  for (let i = floatingScores.value.length - 1; i >= 0; i--) {
    let score = floatingScores.value[i]
    
    // Movimento verso l'alto e fade out
    score.y -= 2
    score.life--
    score.opacity = score.life / 60
    score.scale = 1 + (60 - score.life) * 0.02 // Cresce leggermente
    
    // Rimuovi quando la vita è finita
    if (score.life <= 0) {
      floatingScores.value.splice(i, 1)
    }
  }
}

/**
 * Disegna i punteggi volanti
 */
function drawFloatingScores() {
  floatingScores.value.forEach(score => {
    ctx.save()
    
    // Imposta trasparenza e scala
    ctx.globalAlpha = score.opacity
    ctx.font = `${24 * score.scale}px Arial Black`
    ctx.fillStyle = '#4CAF50'
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 3
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    
    // Testo con outline
    ctx.strokeText(`+${score.points}`, score.x, score.y)
    ctx.fillText(`+${score.points}`, score.x, score.y)
    
    ctx.restore()
  })
}

/**
 * Inizia l'animazione di morte quando si colpisce un ostacolo
 */
function startDeathAnimation(obstacle) {
  deathAnimation.value = {
    active: true,
    object: obstacle,
    scale: 1,
    targetScale: 8,
    duration: 1000,
    startTime: Date.now()
  }
  
  // NON fermare il gioco qui, lascia che il game loop continui per l'animazione
  // gameData.value.isPlaying = false
}

/**
 * Aggiorna l'animazione di morte
 */
function updateDeathAnimation() {
  if (!deathAnimation.value.active) return
  
  const elapsed = Date.now() - deathAnimation.value.startTime
  const progress = Math.min(elapsed / deathAnimation.value.duration, 1)
  
  // Easing per l'animazione
  const easeOut = 1 - Math.pow(1 - progress, 3)
  deathAnimation.value.scale = 1 + (deathAnimation.value.targetScale - 1) * easeOut
  
  // Quando l'animazione è finita, mostra game over
  if (progress >= 1) {
    deathAnimation.value.active = false
    setTimeout(() => {
      emit('game-over', gameData.value.score)
    }, 200)
  }
}

/**
 * Disegna l'animazione di morte
 */
function drawDeathAnimation() {
  if (!deathAnimation.value.active) return
  
  const obj = deathAnimation.value.object
  const scale = deathAnimation.value.scale
  
  ctx.save()
  
  // Centra l'oggetto nello schermo
  const centerX = CANVAS_WIDTH / 2
  const centerY = CANVAS_HEIGHT / 2
  
  // Sfondo scuro che aumenta
  const alpha = Math.min(scale / 4, 0.8)
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
  
  // Salva la posizione originale dell'oggetto
  const originalX = obj.position.x
  const originalY = obj.position.y
  
  // Imposta temporaneamente la posizione dell'oggetto al centro
  obj.position.x = centerX
  obj.position.y = centerY
  
  // Disegna l'oggetto ingrandito
  ctx.translate(centerX, centerY)
  ctx.scale(scale, scale)
  ctx.translate(-centerX, -centerY)
  
  // Disegna l'oggetto
  obj.draw(ctx)
  
  // Ripristina la posizione originale
  obj.position.x = originalX
  obj.position.y = originalY
  
  ctx.restore()
}

function checkGameOver() {
  for (let obs of obstacles.value) {
    if (Math.abs(player.value.lane - obs.position.lane) < 0.3 && checkCollision(player.value, obs)) {
      // Ferma il gioco PRIMA di iniziare l'animazione
      gameData.value.isPlaying = false
      
      // Inizia l'animazione di morte
      startDeathAnimation(obs)
      return
    }
  }
}

function gameOver() {
  gameData.value.isPlaying = false
  emit('game-over', gameData.value.score)
}

function draw() {
  if (!ctx) return
  
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

  // Sfondo con colori Google
  const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT)
  gradient.addColorStop(0, '#E3F2FD') // Azzurro chiaro
  gradient.addColorStop(0.4, '#4285F4') // Google Blue
  gradient.addColorStop(0.7, '#34A853') // Google Green
  gradient.addColorStop(1, '#FBBC04') // Google Yellow
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
  
  // Disegna elementi decorativi nello sfondo
  drawBackgroundElements()

  // Overlay semi-trasparente per dare profondità e rappresentare il peso delle responsabilità
  ctx.fillStyle = 'rgba(0, 0, 0, 0.08)'
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

  // Disegna le corsie con linee più visibili
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)'
  ctx.lineWidth = 2
  ctx.setLineDash([15, 10])
  for (let i = 1; i < LANES; i++) {
    ctx.beginPath()
    ctx.moveTo(i * LANE_WIDTH, 0)
    ctx.lineTo(i * LANE_WIDTH, CANVAS_HEIGHT)
    ctx.stroke()
  }
  ctx.setLineDash([])

  // Indicatore corsia obiettivo con effetto glow
  if (gameData.value.isPlaying) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)'
    ctx.fillRect(LANE_WIDTH * player.value.targetLane, 0, LANE_WIDTH, CANVAS_HEIGHT)
    
    // Bordi della corsia attiva
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
    ctx.lineWidth = 3
    ctx.strokeRect(LANE_WIDTH * player.value.targetLane, 0, LANE_WIDTH, CANVAS_HEIGHT)
  }

  // Player
  if (player.value.imageLoaded && player.value.image) {
    // Disegna l'immagine del player
    ctx.drawImage(
      player.value.image,
      player.value.x - player.value.width/2,
      player.value.y - player.value.height/2,
      player.value.width,
      player.value.height
    )
  } else {
    // Fallback al disegno originale se l'immagine non è caricata
    ctx.fillStyle = player.value.color
    ctx.fillRect(
      player.value.x - player.value.width/2, 
      player.value.y - player.value.height/2, 
      player.value.width, 
      player.value.height
    )
    
    // Testa del player
    ctx.fillStyle = '#ffcc99'
    ctx.beginPath()
    ctx.arc(player.value.x, player.value.y - player.value.height/2 + 15, 15, 0, Math.PI * 2)
    ctx.fill()

    // Occhi
    ctx.fillStyle = 'black'
    ctx.fillRect(player.value.x - 8, player.value.y - player.value.height/2 + 12, 4, 4)
    ctx.fillRect(player.value.x + 4, player.value.y - player.value.height/2 + 12, 4, 4)
  }

  // Ostacoli
  obstacles.value.forEach(obs => {
    obs.draw(ctx)
  })

  // Collectibles
  collectibles.value.forEach(col => {
    col.draw(ctx)
  })
  
  // Punteggi volanti
  drawFloatingScores()
  
  // Effetti di feedback visivo
  drawVisualEffects(ctx)
  
  // Animazione di morte (deve essere disegnata per ultima per coprire tutto)
  if (deathAnimation.value.active) {
    drawDeathAnimation()
  }
}

function drawVisualEffects(ctx) {
  // Diminuisci gradualmente l'intensità dell'effetto
  if (visualEffects.value.flashIntensity > 0) {
    visualEffects.value.flashIntensity -= 0.02
    
    if (visualEffects.value.screenFlash === 'hit') {
      // Flash rosso per colpo
      ctx.fillStyle = `rgba(255, 100, 100, ${visualEffects.value.flashIntensity})`
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    } else if (visualEffects.value.screenFlash === 'collect') {
      // Flash dorato per raccolta
      ctx.fillStyle = `rgba(255, 215, 0, ${visualEffects.value.flashIntensity})`
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    }
    
    if (visualEffects.value.flashIntensity <= 0) {
      visualEffects.value.screenFlash = null
    }
  }
}

/**
 * Disegna elementi decorativi nello sfondo
 */
function drawBackgroundElements() {
  backgroundElements.value.forEach(elem => {
    ctx.save()
    ctx.globalAlpha = elem.opacity
    ctx.font = `${elem.size}px Arial`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(elem.type, elem.x, elem.y)
    ctx.restore()
  })
}

/**
 * Aggiorna gli elementi decorativi (scrolling lento)
 */
function updateBackgroundElements() {
  backgroundElements.value.forEach(elem => {
    elem.y += elem.speed
    
    // Riposiziona in alto quando esce dallo schermo
    if (elem.y > CANVAS_HEIGHT + 50) {
      elem.y = -50
      elem.x = Math.random() * CANVAS_WIDTH
    }
  })
}

function gameLoop() {
  // Aggiorna sempre l'animazione di morte, anche se il gioco non sta girando
  if (deathAnimation.value.active) {
    updateDeathAnimation()
    draw()
    animationId = requestAnimationFrame(gameLoop)
    return
  }

  if (!gameData.value.isPlaying) {
    return
  }

  gameData.value.frameCount++
  updatePlayer()
  updateObstacles()
  updateCollectibles() // Questa già gestisce le collisioni
  updateFloatingScores() // Aggiorna i punteggi volanti
  updateBackgroundElements() // Aggiorna elementi decorativi
  
  // Controlla game over SOLO se non c'è animazione di morte attiva
  if (!deathAnimation.value.active) {
    checkGameOver()
  }

  // Se il gioco è finito durante checkGameOver, non continuare
  if (!gameData.value.isPlaying && !deathAnimation.value.active) return

  // Aumenta velocità più frequentemente: ogni 250 frames (circa 4 secondi a 60fps)
  if (gameData.value.frameCount % 250 === 0) {
    gameData.value.gameSpeed += 0.4 // Incremento leggermente maggiore
  }

  draw()
  animationId = requestAnimationFrame(gameLoop)
}

// Metodo esposto per inizializzare il gioco
function initGame() {
  if (!ctx) {
    return
  }
  
  gameData.value.score = 0
  gameData.value.gameSpeed = 4.5 // Aumentato da 3 a 4.5
  gameData.value.frameCount = 0
  obstacles.value = []
  collectibles.value = []
  floatingScores.value = [] // Reset punteggi volanti
  player.value.lane = 1
  player.value.targetLane = 1
  player.value.x = LANE_WIDTH * 1 + LANE_WIDTH / 2
  player.value.y = CANVAS_HEIGHT - 150
  
  // Reset effetti visivi
  visualEffects.value.screenFlash = null
  visualEffects.value.flashIntensity = 0
  
  // Reset animazione di morte
  deathAnimation.value = {
    active: false,
    object: null,
    scale: 1,
    targetScale: 10,
    duration: 1000,
    startTime: null
  }
  
  if (animationId) {
    cancelAnimationFrame(animationId)
    animationId = null
  }
  
  // Imposta isPlaying e avvia direttamente il game loop
  gameData.value.isPlaying = true
  gameLoop()
}

// Esponi il metodo per il componente parent
defineExpose({
  initGame
})
</script>

<style scoped>
.game-canvas {
  display: block;
  width: 100%;
  max-width: 600px;
  height: 100vh;
  margin: 0 auto;
  background: linear-gradient(to bottom, #E3F2FD 0%, #4285F4 40%, #34A853 70%, #FBBC04 100%);
  cursor: pointer;
  touch-action: none; /* Previene lo scroll durante il gioco */
  user-select: none; /* Previene la selezione del testo */
  -webkit-user-select: none;
  -webkit-touch-callout: none; /* Previene il menu contestuale su iOS */
}

@media (max-width: 768px) {
  .game-canvas {
    width: 100vw;
    max-width: 100vw;
  }
}
</style>