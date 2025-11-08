<template>
  <div class="game-over-screen">
    <!-- Step 1: Input nome se qualificato -->
    <div v-if="isQualified && !nameSaved" class="name-input-container">
      <div class="congrats-card">
        <div class="trophy-icon">🏆</div>
        <h1 class="congrats-title">Congratulazioni!</h1>
        <p class="congrats-subtitle">Sei tra i migliori 100 giocatori!</p>
        <p class="score-display">Punteggio: <span class="score-value">{{ score }}</span></p>
        
        <div class="input-section">
          <label class="input-label">Inserisci il tuo nome</label>
          <input 
            v-model="playerName"
            type="text"
            placeholder="Es: GianFilippo"
            maxlength="20"
            class="name-input"
            @keyup.enter="saveName"
            autofocus
          />
          <button 
            @click="saveName" 
            :disabled="!playerName.trim() || saving" 
            class="save-button"
          >
            <span v-if="!saving">Salva e Continua</span>
            <span v-else class="saving-text">
              <span class="spinner"></span>
              Salvataggio...
            </span>
          </button>
        </div>
        
        <button @click="skipSave" class="skip-button">
          Salta
        </button>
      </div>
    </div>
    
    <!-- Step 2: Risultato finale con classifica -->
    <div v-else class="results-container">
      <div class="game-over-card">
        <h1 class="game-over-title">😱 Game Over!</h1>
        <p class="game-over-subtitle">{{ getMessage() }}</p>
        <div class="final-score-card">
          <div class="score-label">Punteggio Finale</div>
          <div class="score-number">{{ score }}</div>
        </div>
        
        <!-- Messaggio di salvataggio se qualificato -->
        <div v-if="nameSaved" class="success-banner">
          ✅ Punteggio salvato nella classifica!
        </div>
        
        <!-- Bottoni azione in alto -->
        <div class="action-buttons">
          <button @click="$emit('restart-game')" class="action-button primary">
            🔄 Gioca Ancora
          </button>
        </div>
        
        <!-- Leaderboard integrata -->
        <div class="leaderboard-section">
          <h2 class="leaderboard-title">🏆 Classifica Completa</h2>
          <div v-if="loadingLeaderboard" class="loading-state">
            <div class="spinner"></div>
            Caricamento...
          </div>
          <div v-else-if="leaderboardError" class="error-state">
            {{ leaderboardError }}
          </div>
          <div v-else class="leaderboard-list">
            <div 
              v-for="(entry, index) in topScores" 
              :key="entry.id"
              class="leaderboard-item"
              :class="{ 'highlight': entry.score === score && entry.name === playerName }"
            >
              <div class="rank-badge" :class="'rank-' + (index + 1)">{{ index + 1 }}</div>
              <div class="player-name">{{ entry.name }}</div>
              <div class="player-score">{{ entry.score }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { addScore, getTopScores, isScoreQualified } from '../firebase.js'

const props = defineProps({
  score: {
    type: Number,
    required: true
  },
  highScore: {
    type: Number,
    required: true
  }
})

defineEmits(['restart-game'])

const playerName = ref('')
const isQualified = ref(false)
const nameSaved = ref(false)
const saving = ref(false)
const loadingLeaderboard = ref(true)
const leaderboardError = ref(null)
const topScores = ref([])

onMounted(async () => {
  await checkQualification()
  if (!isQualified.value) {
    await loadLeaderboard()
  }
})

async function checkQualification() {
  try {
    isQualified.value = await isScoreQualified(props.score, 100)
  } catch (e) {
    console.error('Errore nella verifica:', e)
    isQualified.value = false
  }
}

async function loadLeaderboard() {
  loadingLeaderboard.value = true
  leaderboardError.value = null
  try {
    topScores.value = await getTopScores(100)
  } catch (e) {
    console.error('Errore nel caricamento della classifica:', e)
    leaderboardError.value = 'Impossibile caricare la classifica'
  } finally {
    loadingLeaderboard.value = false
  }
}

async function saveName() {
  if (!playerName.value.trim() || saving.value) return
  
  saving.value = true
  try {
    await addScore(playerName.value.trim(), props.score)
    nameSaved.value = true
    await loadLeaderboard()
  } catch (e) {
    console.error('Errore nel salvataggio:', e)
    leaderboardError.value = 'Errore nel salvataggio del punteggio'
  } finally {
    saving.value = false
  }
}

function skipSave() {
  isQualified.value = false
  loadLeaderboard()
}

function getMessage() {
  if (props.score < 100) {
    return 'Le responsabilità erano troppo veloci! 😅'
  } else if (props.score < 300) {
    return 'Buon tentativo, ma servono riflessi più pronti! 🎯'
  } else if (props.score < 600) {
    return 'Ottima fuga! I videogames ti aspettano! 🎮'
  } else {
    return 'LEGGENDARIO! Sei un maestro della procrastinazione! 👑'
  }
}
</script>

<style scoped>
/* Material Design Style */
.game-over-screen {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, rgba(66, 133, 244, 0.95) 0%, rgba(52, 168, 83, 0.95) 100%);
  backdrop-filter: blur(10px);
  z-index: 100;
  padding: 20px;
}

/* Step 1: Input Nome */
.name-input-container {
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideUp 0.5s ease-out;
}

.congrats-card {
  background: white;
  border-radius: 16px;
  padding: 40px 30px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  text-align: center;
}

.trophy-icon {
  font-size: 80px;
  margin-bottom: 20px;
  animation: bounce 1s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.congrats-title {
  font-size: 36px;
  color: #EA4335;
  margin: 0 0 10px 0;
  font-weight: 600;
}

.congrats-subtitle {
  font-size: 18px;
  color: #757575;
  margin: 0 0 20px 0;
}

.score-display {
  font-size: 20px;
  color: #424242;
  margin-bottom: 30px;
}

.score-value {
  font-size: 32px;
  font-weight: bold;
  color: #FF9800;
}

.input-section {
  margin-bottom: 20px;
}

.input-label {
  display: block;
  text-align: left;
  font-size: 14px;
  color: #757575;
  margin-bottom: 8px;
  font-weight: 500;
}

.name-input {
  width: 100%;
  padding: 16px;
  font-size: 16px;
  border: 2px solid #E0E0E0;
  border-radius: 8px;
  margin-bottom: 16px;
  box-sizing: border-box;
  transition: all 0.3s;
  font-family: inherit;
}

.name-input:focus {
  outline: none;
  border-color: #4285F4;
  box-shadow: 0 0 0 3px rgba(66, 133, 244, 0.1);
}

.save-button {
  width: 100%;
  padding: 16px;
  font-size: 16px;
  font-weight: 600;
  background: #4285F4;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 8px rgba(66, 133, 244, 0.3);
}

.save-button:hover:not(:disabled) {
  background: #3367D6;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(66, 133, 244, 0.4);
}

.save-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.action-button {
  padding: 16px 32px;
  font-size: 16px;
  font-weight: 600;
  background: #4285F4;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 8px rgba(66, 133, 244, 0.3);
}

.action-button:hover {
  background: #3367D6;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(66, 133, 244, 0.4);
}

.saving-text {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.skip-button {
  background: none;
  border: none;
  color: #757575;
  font-size: 14px;
  cursor: pointer;
  padding: 12px;
  transition: color 0.3s;
}

.skip-button:hover {
  color: #424242;
  text-decoration: underline;
}

/* Step 2: Risultati */
.results-container {
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideUp 0.5s ease-out;
}

.game-over-card {
  background: white;
  border-radius: 16px;
  padding: 40px 30px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.game-over-title {
  text-align: center;
  font-size: 36px;
  color: #EA4335;
  margin: 0 0 20px 0;
  font-weight: 600;
}

.game-over-subtitle {
  font-size: 18px;
  color: #757575;
  text-align: center;
  margin: 0 0 30px 0;
}

.final-score-card {
  background: linear-gradient(135deg, #FF9800 0%, #FF5722 100%);
  color: white;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  margin-bottom: 20px;
  box-shadow: 0 4px 16px rgba(255, 152, 0, 0.3);
}

.score-label {
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 1px;
  opacity: 0.9;
  margin-bottom: 8px;
}

.score-number {
  font-size: 48px;
  font-weight: bold;
}

.success-banner {
  background: #4CAF50;
  color: white;
  padding: 16px;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 20px;
  font-weight: 500;
}

.leaderboard-section {
  margin: 30px 0;
}

.leaderboard-title {
  font-size: 24px;
  color: #424242;
  text-align: center;
  margin: 0 0 20px 0;
  font-weight: 600;
}

.loading-state, .error-state {
  text-align: center;
  padding: 30px;
  color: #757575;
}

.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.error-state {
  color: #D32F2F;
}

.leaderboard-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.leaderboard-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #F5F5F5;
  border-radius: 8px;
  transition: all 0.3s;
}

.leaderboard-item:hover {
  background: #EEEEEE;
  transform: translateX(4px);
}

.leaderboard-item.highlight {
  background: linear-gradient(135deg, #FFF9C4 0%, #FFE082 100%);
  border: 2px solid #FFC107;
  box-shadow: 0 4px 12px rgba(255, 193, 7, 0.3);
}

.rank-badge {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 16px;
  color: white;
  flex-shrink: 0;
}

.rank-1 {
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
}

.rank-2 {
  background: linear-gradient(135deg, #C0C0C0 0%, #A8A8A8 100%);
}

.rank-3 {
  background: linear-gradient(135deg, #CD7F32 0%, #B8732F 100%);
}

.rank-badge:not(.rank-1):not(.rank-2):not(.rank-3) {
  background: #9E9E9E;
}

.player-name {
  flex: 1;
  font-size: 16px;
  font-weight: 500;
  color: #424242;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.player-score {
  font-size: 18px;
  font-weight: bold;
  color: #4285F4;
}

.action-buttons {
  margin: 20px 0;
  display: flex;
  gap: 12px;
  justify-content: center;
}

.action-button {
  padding: 16px 32px;
  font-size: 16px;
  font-weight: 600;
  background: #4285F4;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 8px rgba(66, 133, 244, 0.3);
}

.action-button:hover {
  background: #3367D6;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(66, 133, 244, 0.4);
}

.action-button.primary {
  background: #34A853;
  box-shadow: 0 4px 8px rgba(52, 168, 83, 0.3);
}

.action-button.primary:hover {
  background: #2D8E47;
  box-shadow: 0 6px 12px rgba(52, 168, 83, 0.4);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .name-input-container, .results-container {
    max-height: 95vh;
  }
  
  .congrats-card, .game-over-card {
    padding: 24px 16px;
  }
  
  .trophy-icon {
    font-size: 60px;
    margin-bottom: 16px;
  }
  
  .congrats-title, .game-over-title {
    font-size: 24px;
    margin-bottom: 12px;
  }
  
  .congrats-subtitle, .game-over-subtitle {
    font-size: 14px;
    margin-bottom: 16px;
  }
  
  .score-display {
    font-size: 16px;
    margin-bottom: 20px;
  }
  
  .score-value, .score-number {
    font-size: 32px;
  }
  
  .input-section {
    margin-bottom: 16px;
  }
  
  .name-input, .save-button, .action-button {
    padding: 14px;
    font-size: 14px;
  }
  
  .leaderboard-item {
    padding: 10px;
    gap: 10px;
  }
  
  .rank-badge {
    width: 32px;
    height: 32px;
    font-size: 14px;
  }
  
  .player-name {
    font-size: 14px;
  }
  
  .player-score {
    font-size: 16px;
  }
}
</style>