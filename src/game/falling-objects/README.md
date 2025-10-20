# Sistema degli Oggetti che Cadono

Questo sistema permette di creare e personalizzare facilmente tutti gli oggetti che cadono nel gioco usando emoji, immagini o SVG.

## 📁 Struttura

```
src/game/falling-objects/
├── FallingObject.js           # Classe base per tutti gli oggetti
├── FallingObjectsConfig.js    # Configurazione e factory
└── README.md                  # Questa documentazione
```

## 🎯 Caratteristiche

### **Tipi di Visualizzazione Supportati:**
- **Emoji** 😀 - Semplici e immediati
- **Immagini** 🖼️ - PNG, JPG, GIF, ecc.
- **SVG** 🎨 - Placeholder colorati con testo (estendibile)

### **Personalizzazioni Disponibili:**
- **Movimento**: Velocità di caduta, rotazione, oscillazione
- **Aspetto**: Dimensione, colore, contenuto visuale
- **Gameplay**: Punti, danno, effetti speciali
- **Fisica**: Dimensioni hitbox, scala collisioni

## 🛠️ Come Aggiungere un Nuovo Oggetto

### 1. Aggiungere alla configurazione

```javascript
// In FallingObjectsConfig.js
newObstacle: {
  id: 'unique-id',
  name: 'Nome Oggetto',
  type: 'obstacle', // o 'collectible'
  visual: {
    type: 'emoji',     // 'emoji', 'image', o 'svg'
    content: '🆕',     // Emoji, path immagine, o testo SVG
    size: 40,          // Dimensione in pixel
    color: '#ff0000'   // Solo per SVG
  },
  movement: {
    fallSpeed: 1.0,    // Moltiplicatore velocità (1.0 = normale)
    rotation: 0.02,    // Velocità rotazione (radianti per frame)
    sway: 5            // Oscillazione laterale (pixel)
  },
  gameplay: {
    points: 10,        // Punti se collectible
    damage: 1,         // Danno se ostacolo
    special: 'effect'  // Effetto speciale opzionale
  },
  physics: {
    width: 40,         // Larghezza fisica (default = size)
    height: 40,        // Altezza fisica (default = size)
    hitboxScale: 0.8   // Scala della hitbox (0.8 = 80% della dimensione)
  }
}
```

### 2. Esempio con Immagine

```javascript
customObject: {
  id: 'custom-image',
  name: 'Oggetto Personalizzato',
  type: 'obstacle',
  visual: {
    type: 'image',
    content: '/images/my-object.png', // Path relativo alla cartella public
    size: 50
  },
  movement: {
    fallSpeed: 1.2,
    rotation: 0.05
  }
}
```

### 3. Esempio con SVG/Placeholder

```javascript
svgObject: {
  id: 'svg-object',
  name: 'Oggetto SVG',
  type: 'collectible',
  visual: {
    type: 'svg',
    content: 'TXT',      // Testo da mostrare
    size: 45,
    color: '#00ff00'     // Colore di sfondo
  },
  movement: {
    fallSpeed: 0.8,
    rotation: 0.1,
    sway: 8
  },
  gameplay: {
    points: 25
  }
}
```

## 🎮 Utilizzo nel Gioco

```javascript
import { FallingObjectFactory } from './FallingObjectsConfig.js'

// Crea oggetto casuale
const randomObstacle = FallingObjectFactory.createObstacle()
const randomCollectible = FallingObjectFactory.createCollectible()

// Crea oggetto specifico
const workObstacle = FallingObjectFactory.createSpecificObject('obstacles', 'work')
const coffeeCollectible = FallingObjectFactory.createSpecificObject('collectibles', 'coffee')

// Ottieni lista di tutti i tipi
const allObstacles = FallingObjectFactory.getAllObstacleTypes()
const allCollectibles = FallingObjectFactory.getAllCollectibleTypes()
```

## 📊 Proprietà Dettagliate

### **Movement (Movimento)**
- `fallSpeed`: Moltiplicatore della velocità di caduta
  - `0.5` = 50% più lento
  - `1.0` = Velocità normale  
  - `1.5` = 50% più veloce
- `rotation`: Velocità di rotazione in radianti per frame
  - `0` = Nessuna rotazione
  - `0.02` = Rotazione lenta
  - `0.1` = Rotazione veloce
- `sway`: Oscillazione laterale in pixel
  - `0` = Nessuna oscillazione
  - `5` = Oscillazione leggera
  - `10` = Oscillazione marcata

### **Physics (Fisica)**
- `hitboxScale`: Scala della hitbox per collisioni più precise
  - `0.5` = Hitbox al 50% (più facile evitare)
  - `0.8` = Hitbox all'80% (standard)
  - `1.0` = Hitbox al 100% (più difficile)

### **Gameplay**
- `points`: Punti assegnati quando raccolto (solo collectibles)
- `damage`: Danno inflitto quando colpito (solo obstacles)  
- `special`: Identificatore per effetti speciali personalizzati

## 🎨 Aggiungere Immagini

1. Metti le immagini nella cartella `public/images/`
2. Riferiscile con il path `/images/nome-file.png`
3. Il sistema gestisce automaticamente il caricamento e fallback

Esempio struttura:
```
public/
└── images/
    ├── work-icon.png
    ├── study-books.jpg
    └── special-collectible.gif
```

## 🔄 Estendibilità

Il sistema è progettato per essere facilmente esteso:
- Aggiungi nuovi tipi visuali modificando `draw()` in `FallingObject.js`
- Implementa effetti speciali nel game engine
- Crea categorie personalizzate nella configurazione
- Aggiungi proprietà fisiche avanzate

Questo sistema rende il gioco estremamente personalizzabile mantenendo il codice pulito e organizzato! 🚀