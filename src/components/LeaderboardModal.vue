<template>
  <div v-if="show" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <button class="close-button" @click="closeModal">✕</button>
      
      <h2 class="modal-title">🏆 Classifica Completa</h2>
      
      <!-- Leaderboard -->
      <div class="leaderboard-container">
        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          Caricamento classifica...
        </div>
        <div v-else-if="error" class="error-state">{{ error }}</div>
        <div v-else class="leaderboard-list">
          <div 
            v-for="(entry, index) in topScores" 
            :key="entry.id"
            class="leaderboard-item"
            :class="{ 'highlight': entry.score === currentScore && entry.name === playerName }"
          >
            <div class="rank-badge" :class="'rank-' + (index + 1)">{{ index + 1 }}</div>
            <div class="player-name">{{ entry.name }}</div>
            <div class="player-score">{{ entry.score }}</div>
          </div>
          <div v-if="topScores.length === 0" class="empty-state">
            Nessun punteggio ancora. Sii il primo!
          </div>
        </div>
      </div>
      
      <button @click="closeModal" class="close-modal-button">Chiudi</button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { getTopScores } from '../firebase.js'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  currentScore: {
    type: Number,
    required: true
  },
  playerName: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['close'])

const loading = ref(true)
const error = ref(null)
const topScores = ref([])

watch(() => props.show, async (newVal) => {
  if (newVal) {
    await loadLeaderboard()
  }
})

onMounted(async () => {
  if (props.show) {
    await loadLeaderboard()
  }
})

async function loadLeaderboard() {
  loading.value = true
  error.value = null
  try {
    topScores.value = await getTopScores(100)
  } catch (e) {
    console.error('Errore nel caricamento della classifica:', e)
    error.value = 'Impossibile caricare la classifica'
  } finally {
    loading.value = false
  }
}

function closeModal() {
  emit('close')
}
</script>

<style scoped>
/* Material Design Style */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(10px);
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 16px;
  padding: 30px;
  max-width: 600px;
  width: 100%;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  position: relative;
  animation: slideUp 0.3s ease-out;
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

.close-button {
  position: absolute;
  top: 16px;
  right: 16px;
  background: #F5F5F5;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 20px;
  cursor: pointer;
  color: #757575;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-button:hover {
  background: #E0E0E0;
  color: #424242;
  transform: rotate(90deg);
}

.modal-title {
  text-align: center;
  font-size: 32px;
  color: #EA4335;
  margin: 0 0 30px 0;
  font-weight: 600;
}

.leaderboard-container {
  background: #F5F5F5;
  border-radius: 12px;
  padding: 16px;
  max-height: 60vh;
  overflow-y: auto;
  margin-bottom: 20px;
}

.loading-state, .error-state, .empty-state {
  text-align: center;
  padding: 40px 20px;
  font-size: 16px;
  color: #757575;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #E0E0E0;
  border-top-color: #4285F4;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-state {
  color: #D32F2F;
}

.leaderboard-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.leaderboard-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: white;
  border-radius: 8px;
  transition: all 0.3s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.leaderboard-item:hover {
  transform: translateX(4px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.leaderboard-item.highlight {
  background: linear-gradient(135deg, #FFF9C4 0%, #FFE082 100%);
  border: 2px solid #FFC107;
  box-shadow: 0 4px 12px rgba(255, 193, 7, 0.3);
  animation: highlightPulse 2s infinite;
}

@keyframes highlightPulse {
  0%, 100% { box-shadow: 0 4px 12px rgba(255, 193, 7, 0.3); }
  50% { box-shadow: 0 4px 16px rgba(255, 193, 7, 0.5); }
}

.rank-badge {
  width: 40px;
  height: 40px;
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
  box-shadow: 0 2px 8px rgba(255, 215, 0, 0.4);
}

.rank-2 {
  background: linear-gradient(135deg, #C0C0C0 0%, #A8A8A8 100%);
  box-shadow: 0 2px 8px rgba(192, 192, 192, 0.4);
}

.rank-3 {
  background: linear-gradient(135deg, #CD7F32 0%, #B8732F 100%);
  box-shadow: 0 2px 8px rgba(205, 127, 50, 0.4);
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

.close-modal-button {
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

.close-modal-button:hover {
  background: #3367D6;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(66, 133, 244, 0.4);
}

/* Scrollbar personalizzata */
.leaderboard-container::-webkit-scrollbar {
  width: 8px;
}

.leaderboard-container::-webkit-scrollbar-track {
  background: #E0E0E0;
  border-radius: 10px;
}

.leaderboard-container::-webkit-scrollbar-thumb {
  background: #BDBDBD;
  border-radius: 10px;
}

.leaderboard-container::-webkit-scrollbar-thumb:hover {
  background: #9E9E9E;
}

@media (max-width: 768px) {
  .modal-content {
    padding: 24px 16px;
    max-height: 90vh;
  }
  
  .modal-title {
    font-size: 24px;
    margin-bottom: 20px;
  }
  
  .leaderboard-item {
    padding: 12px;
  }
  
  .rank-badge {
    width: 36px;
    height: 36px;
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
