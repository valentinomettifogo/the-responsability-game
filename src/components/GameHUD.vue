<template>
  <div class="game-hud">
    <div class="hud-card score-card">
      <div class="hud-label">Punteggio</div>
      <div class="hud-value score">{{ score }}</div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  score: {
    type: Number,
    required: true
  }
})
</script>

<style scoped>
/* Material Design Style */
.game-hud {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 10;
  font-family: 'Arial', sans-serif;
}

.hud-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 12px 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 120px;
  transition: all 0.3s;
}

.hud-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.score-card {
  border-left: 4px solid #4285F4;
}

@media (max-width: 768px) {
  .game-hud {
    top: 10px;
    left: 10px;
  }
  
  .hud-card {
    padding: 10px 16px;
    min-width: 100px;
  }
  
  .hud-label {
    font-size: 10px;
  }
  
  .hud-value {
    font-size: 20px;
  }
}
</style>