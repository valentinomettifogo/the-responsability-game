<template>
  <div class="game-over-screen">
    <h1>😱 Le Responsabilità Ti Hanno Preso!</h1>
    <p class="final-score">Punteggio Finale: {{ score }}</p>
    <p class="message">{{ getMessage() }}</p>
    <button @click="$emit('restart-game')" class="game-button">
      RIPROVA A SCAPPARE
    </button>
  </div>
</template>

<script setup>
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
.game-over-screen {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  z-index: 100;
}

h1 {
  font-size: 48px;
  margin-bottom: 20px;
  text-shadow: 3px 3px 6px rgba(0,0,0,0.8);
}

p {
  font-size: 20px;
  margin: 10px 0;
  max-width: 600px;
  text-align: center;
  padding: 0 20px;
}

.final-score {
  font-size: 28px;
  font-weight: bold;
  color: #ffd700;
}

.message {
  margin-bottom: 20px;
}

.game-button {
  margin-top: 30px;
  padding: 15px 40px;
  font-size: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: transform 0.2s;
  box-shadow: 0 4px 15px rgba(0,0,0,0.3);
}

.game-button:hover {
  transform: scale(1.1);
}
</style>