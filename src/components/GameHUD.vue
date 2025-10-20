<template>
  <div class="game-hud">
    <div>Punteggio: <span class="score">{{ score }}</span></div>
    <div>Record: <span class="high-score">{{ highScore }}</span></div>
  </div>
</template>

<script setup>
defineProps({
  score: {
    type: Number,
    required: true
  },
  highScore: {
    type: Number,
    required: true
  }
})
</script>

<style scoped>
.game-hud {
  position: absolute;
  top: 20px;
  left: 20px;
  color: white;
  font-size: 24px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
  z-index: 10;
  font-family: 'Arial', sans-serif;
}

.score, .high-score {
  font-weight: bold;
  color: #ffd700;
}
</style>