<template>
  <div class="start-screen">
    <h1>🎮 Fuga dalle Responsabilità 🏃</h1>
    <p>Il tuo amico deve scappare dalle responsabilità che lo inseguono per raggiungere il suo paradiso: i videogames!</p>
    <p>Cambia corsia per evitare gli ostacoli e raccogli i controller!</p>
    
    <div class="game-rules">
      <p><span class="bad-object">🔴 Oggetti con alone ROSSO</span> = EVITA! (Responsabilità)</p>
      <p><span class="good-object">🟡 Oggetti con alone DORATO</span> = RACCOGLI! (Ricompense)</p>
    </div>
    
    <div class="controls">
      <p>⬅️ Freccia SINISTRA - Vai a sinistra</p>
      <p>➡️ Freccia DESTRA - Vai a destra</p>
    </div>
    <button @click="$emit('start-game')" class="game-button">
      INIZIA A SCAPPARE!
    </button>
  </div>
</template>

<script setup>
defineEmits(['start-game'])
</script>

<style scoped>
.start-screen {
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

.controls {
  margin-top: 20px;
  font-size: 16px;
  color: #ddd;
}

.game-rules {
  margin: 20px 0;
  padding: 15px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.bad-object {
  color: #ff6666;
  font-weight: bold;
  text-shadow: 0 0 10px #ff4444;
}

.good-object {
  color: #ffd700;
  font-weight: bold;
  text-shadow: 0 0 10px #ffd700;
}
</style>