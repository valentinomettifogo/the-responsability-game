# 🎮 Fuga dalle Responsabilità

Un divertente **endless runner game** sviluppato con **Vue.js** e **HTML5 Canvas** dove il tuo obiettivo è scappare dalle responsabilità che ti inseguono per raggiungere il paradiso dei videogames!

![Game Preview](./public/game-preview.gif)

## 🚀 Demo Live

[**Gioca Ora!**](https://yourusername.github.io/the-responsability-game) 

## 📖 Come Giocare

- **Obiettivo**: Evita le responsabilità (oggetti con bordino rosso) e raccogli le ricompense (oggetti con bordino verde)
- **Controlli**: 
  - ⬅️ **Freccia Sinistra** - Sposta a sinistra
  - ➡️ **Freccia Destra** - Sposta a destra
- **Oggetti Buoni** 🟢: Controller 🎮, Caffè ☕, Pizza 🍕 (raccogli per punti!)
- **Oggetti Cattivi** 🔴: Libri 📚, Lavoro 💼, Famiglia 👨‍👩‍👧 (evita o game over!)

## ✨ Caratteristiche

- 🎨 **Interfaccia Moderna**: Sviluppata con Vue.js 3 e Composition API
- 🎮 **Gameplay Fluido**: Rendering canvas 60fps con animazioni smooth
- 📱 **Design Responsive**: Si adatta a diverse dimensioni schermo
- 🎯 **Feedback Visivo**: Bordini colorati, punteggi volanti, animazioni di morte
- 🏆 **Sistema Punteggio**: Salvataggio high score in localStorage
- 🎵 **Effetti Speciali**: Flash screen e animazioni coinvolgenti

## 🛠️ Tecnologie Utilizzate

- **Vue.js 3** - Framework JavaScript reattivo
- **Vite** - Build tool e dev server ultravel
- **HTML5 Canvas** - Rendering grafico 2D
- **CSS3** - Styling e animazioni
- **JavaScript ES6+** - Logica di gioco moderna

## 📁 Struttura Progetto

```
src/
├── components/           # Componenti Vue
│   ├── ResponsibilityGame.vue    # Componente principale
│   ├── StartScreen.vue           # Schermata iniziale
│   ├── GameOverScreen.vue        # Schermata game over
│   ├── GameHUD.vue              # Interfaccia di gioco
│   └── GameCanvas.vue           # Engine di gioco canvas
├── game/                # Logica di gioco
│   └── falling-objects/ # Sistema oggetti cadenti
│       ├── FallingObject.js      # Classe base oggetti
│       └── FallingObjectsConfig.js # Configurazione oggetti
├── App.vue              # Componente root
├── main.js              # Entry point
└── style.css            # Stili globali
```

## 🔧 Installazione e Sviluppo

### Prerequisiti
- Node.js >= 16.0.0
- npm >= 8.0.0

### Setup
```bash
# Clona il repository
git clone https://github.com/yourusername/the-responsability-game.git
cd the-responsability-game

# Installa dipendenze
npm install

# Avvia server di sviluppo
npm run dev

# Build per produzione
npm run build

# Preview build
npm run preview
```

## 🎯 Architettura del Gioco

### Componenti Principali

- **ResponsibilityGame.vue**: Coordinatore principale che gestisce gli stati del gioco
- **GameCanvas.vue**: Engine core con game loop, rendering e collision detection
- **FallingObject.js**: Sistema modulare per oggetti cadenti (emoji, immagini, SVG)
- **FallingObjectsConfig.js**: Configurazione centralizzata di tutti gli oggetti

### Caratteristiche Tecniche

- **Game Loop**: requestAnimationFrame per 60fps fluidi
- **Collision Detection**: Sistema hitbox scalabile per precisione
- **State Management**: Vue reactivity per sincronizzazione UI/game
- **Modular Objects**: Factory pattern per creazione oggetti dinamica
- **Visual Effects**: Sistema effetti visivi in tempo reale

## 🤝 Contribuire

1. Fork del progetto
2. Crea feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit delle modifiche (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

## 📋 TODO

- [ ] Aggiungere effetti sonori
- [ ] Implementare power-ups speciali
- [ ] Sistema livelli progressivi
- [ ] Leaderboard online
- [ ] Controlli touch per mobile
- [ ] Modalità multiplayer

## 📜 Licenza

Questo progetto è rilasciato sotto licenza [MIT](LICENSE).

## 👨‍💻 Autore

**Valmet** - [GitHub Profile](https://github.com/yourusername)

---

⭐ Se ti piace il progetto, lascia una stella! È il modo migliore per supportare il lavoro.

**Buona fuga dalle responsabilità!** 🏃‍♂️💨