<template>
  <div class="game-container">
    <StartScreen 
      v-if="gameState === 'start'" 
      @start-game="startGame" 
    />
    
    <GameOverScreen 
      v-if="gameState === 'gameOver'" 
      :score="score"
      :high-score="highScore"
      @restart-game="restartGame"
    />
    
    <GameHUD 
      v-if="gameState === 'playing'"
      :score="score"
      :high-score="highScore"
    />
    
    <GameCanvas 
      ref="gameCanvas"
      :game-state="gameState"
      @game-over="handleGameOver"
      @score-update="updateScore"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import StartScreen from './StartScreen.vue'
import GameOverScreen from './GameOverScreen.vue'
import GameHUD from './GameHUD.vue'
import GameCanvas from './GameCanvas.vue'

const gameState = ref('start') // 'start', 'playing', 'gameOver'
const score = ref(0)
const highScore = ref(0)
const gameCanvas = ref(null)

onMounted(() => {
  // Carica il record salvato
  const saved = localStorage.getItem('responsibilityGameHighScore')
  if (saved) {
    highScore.value = parseInt(saved)
  }
})

function startGame() {
  score.value = 0
  
  if (gameCanvas.value) {
    gameCanvas.value.initGame()
    gameState.value = 'playing'
  }
}

function restartGame() {
  score.value = 0
  if (gameCanvas.value) {
    gameCanvas.value.initGame()
    gameState.value = 'playing'
  }
}

function handleGameOver(finalScore) {
  gameState.value = 'gameOver'
  score.value = finalScore
  
  if (finalScore > highScore.value) {
    highScore.value = finalScore
    localStorage.setItem('responsibilityGameHighScore', finalScore.toString())
  }
}

function updateScore(newScore) {
  score.value = newScore
}
</script>

<style scoped>
.game-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
</style>