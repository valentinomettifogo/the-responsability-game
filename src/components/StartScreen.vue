<template>
  <div class="start-screen">
    <div class="start-card">
      <div class="game-icon">🎮</div>
      <h1 class="game-title">Fuga dalle Responsabilità</h1>
      <p class="game-subtitle">Scappa dalle tue responsabilità per raggiungere il paradiso: i videogames!</p>
      
      <div class="instructions-section">
        <h2 class="section-title">Come si gioca</h2>
        <p class="instruction-text">Cambia corsia per evitare gli ostacoli e raccogli i power-up!</p>
        
        <div class="rules-grid">
          <div class="rule-card danger">
            <div class="rule-icon">🔴</div>
            <div class="rule-title">Evita</div>
          </div>
          
          <div class="rule-card success">
            <div class="rule-icon">🟢</div>
            <div class="rule-title">Raccogli</div>
          </div>
        </div>
      </div>
      
      <div class="controls-section">
        <h2 class="section-title">Controlli</h2>
        <div class="controls-grid">
          <div class="control-item">
            <div class="control-key">⬅️</div>
            <div class="control-label">Sinistra</div>
          </div>
          <div class="control-item">
            <div class="control-key">➡️</div>
            <div class="control-label">Destra</div>
          </div>
          <div class="control-item">
            <div class="control-key">👆</div>
            <div class="control-label">Tap/Swipe</div>
          </div>
        </div>
      </div>
      
      <button @click="$emit('start-game')" class="start-button">
        <span class="button-icon">🚀</span>
        Inizia a Scappare!
      </button>
    </div>
  </div>
</template>

<script setup>
defineEmits(['start-game'])
</script>

<style scoped>
/* Material Design Style */
.start-screen {
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

.start-card {
  background: white;
  border-radius: 16px;
  padding: 30px 24px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.5s ease-out;
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

.game-icon {
  font-size: 60px;
  text-align: center;
  margin-bottom: 12px;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.game-title {
  font-size: 28px;
  color: #EA4335;
  text-align: center;
  margin: 0 0 8px 0;
  font-weight: 600;
}

.game-subtitle {
  font-size: 14px;
  color: #757575;
  text-align: center;
  margin: 0 0 20px 0;
  line-height: 1.5;
}

.instructions-section, .controls-section {
  margin-bottom: 20px;
}

.section-title {
  font-size: 18px;
  color: #424242;
  font-weight: 600;
  margin: 0 0 12px 0;
  text-align: center;
}

.instruction-text {
  font-size: 15px;
  color: #616161;
  text-align: center;
  line-height: 1.6;
  margin-bottom: 12px;
}

.rules-grid {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 0;
}

.rule-card {
  background: white;
  border-radius: 8px;
  padding: 10px 16px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  flex: 0 1 auto;
}

.rule-card.danger {
  border: 2px solid #EF5350;
}

.rule-card.success {
  border: 2px solid #66BB6A;
}

.rule-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.rule-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.rule-title {
  font-size: 13px;
  font-weight: 600;
  color: #424242;
  white-space: nowrap;
}

.controls-grid {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.control-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.control-key {
  width: 50px;
  height: 50px;
  background: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.control-item:hover .control-key {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.control-label {
  font-size: 12px;
  color: #757575;
  font-weight: 500;
}

.start-button {
  width: 100%;
  padding: 16px 40px;
  font-size: 20px;
  font-weight: 600;
  background: #4285F4;
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 8px 16px rgba(66, 133, 244, 0.3);
  animation: pulse 2s infinite;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.start-button:hover {
  background: #3367D6;
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(66, 133, 244, 0.4);
}

@media (max-width: 768px) {
  .start-card {
    padding: 20px 16px;
    max-height: 95vh;
  }
  
  .game-icon {
    font-size: 50px;
    margin-bottom: 10px;
  }
  
  .game-title {
    font-size: 24px;
  }
  
  .game-subtitle {
    font-size: 13px;
  }
  
  .section-title {
    font-size: 16px;
    margin-bottom: 10px;
  }
  
  .instruction-text {
    font-size: 13px;
    margin-bottom: 10px;
  }
  
  .rules-grid {
    gap: 8px;
  }
  
  .rule-card {
    padding: 8px 12px;
  }
  
  .rule-icon {
    font-size: 18px;
  }
  
  .rule-title {
    font-size: 12px;
  }
  
  .controls-grid {
    gap: 12px;
  }
  
  .control-key {
    width: 45px;
    height: 45px;
    font-size: 20px;
  }
  
  .control-label {
    font-size: 11px;
  }
  
  .start-button {
    font-size: 18px;
    padding: 14px;
  }
}
</style>