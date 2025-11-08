import FallingObject from './FallingObject.js'

/**
 * Configurazione di tutti gli oggetti che cadono nel gioco
 * Ogni oggetto può usare emoji, immagini o SVG
 */
export const FALLING_OBJECTS_CONFIG = {
  
  // === OSTACOLI (RESPONSABILITÀ) ===
  obstacles: {
    /* studyBooks: {
      id: 'study-books',
      name: 'Libri di Studio',
      type: 'obstacle',
      visual: {
        type: 'emoji',
        content: '📚',
        size: 40,
        badEffect: true // Indicatore per effetti negativi
      },
      movement: {
        fallSpeed: 0.8, // Rallentato
        rotation: 0.02,
        sway: 5
      },
      gameplay: {
        damage: 1
      },
      physics: {
        hitboxScale: 0.8
      }
    }, */

    work: {
      id: 'work',
      name: 'Lavoro',
      type: 'obstacle',
      visual: {
        type: 'image',
        content: '/images/work.png',
        size: 70,
        badEffect: true
      },
      movement: {
        fallSpeed: 1.0, // Rallentato da 1.2
        rotation: 0.03,
        sway: 0
      },
      gameplay: {
        damage: 1
      }
    },

    cleaning: {
      id: 'cleaning',
      name: 'Pulizie',
      type: 'obstacle',
      visual: {
        type: 'image',
        content: '/images/clean.png',
        size: 68,
        badEffect: true
      },
      movement: {
        fallSpeed: 0.6, // Rallentato da 0.8
        rotation: 0.01,
        sway: 8
      },
      gameplay: {
        damage: 1
      }
    },

    /* documents: {
      id: 'documents',
      name: 'Documenti',
      type: 'obstacle',
      visual: {
        type: 'emoji',
        content: '📋',
        size: 39,
        badEffect: true
      },
      movement: {
        fallSpeed: 0.9, // Rallentato da 1.1
        rotation: 0,
        sway: 3
      },
      gameplay: {
        damage: 1
      }
    }, */

    family: {
      id: 'family',
      name: 'Impegni Familiari',
      type: 'obstacle',
      visual: {
        type: 'image',
        content: '/images/baby.png',
        size: 72,
        badEffect: true
      },
      movement: {
        fallSpeed: 0.7, // Rallentato da 0.9
        rotation: 0,
        sway: 2
      },
      gameplay: {
        damage: 1
      },
      physics: {
        hitboxScale: 0.9
      }
    },

    // Esempio con immagine personalizzata (commentato per ora)
    /*
    customWork: {
      id: 'custom-work',
      name: 'Lavoro Custom',
      type: 'obstacle',
      visual: {
        type: 'image',
        content: '/images/work-icon.png', // Path all'immagine
        size: 45
      },
      movement: {
        fallSpeed: 1.3,
        rotation: 0.05
      },
      gameplay: {
        damage: 2 // Più dannoso
      }
    },
    */

    // Esempio con SVG placeholder
    /* urgentTask: {
      id: 'urgent-task',
      name: 'Compito Urgente',
      type: 'obstacle',
      visual: {
        type: 'svg',
        content: '!!!',
        size: 36,
        color: '#ff4444', // Rosso per urgenza
        badEffect: true
      },
      movement: {
        fallSpeed: 1.2, // Rallentato da 1.5
        rotation: 0.08, // Rallentato da 0.1
        sway: 0
      },
      gameplay: {
        damage: 1
      }
    } */
  },

  // === COLLECTIBLES (RICOMPENSE) ===
  collectibles: {
    gameController: {
      id: 'game-controller',
      name: 'Controller',
      type: 'collectible',
      visual: {
        type: 'image',
        content: '/images/joystick.png',
        size: 65,
        goodEffect: true // Indicatore per effetti positivi
      },
      movement: {
        fallSpeed: 0.8, // Rallentato da 1.0
        rotation: 0.04, // Leggermente rallentato
        sway: 6
      },
      gameplay: {
        points: 20
      }
    },

    coffee: {
      id: 'coffee',
      name: 'Caffè',
      type: 'collectible',
      visual: {
        type: 'image',
        content: '/images/coffee.png',
        size: 62,
        goodEffect: true
      },
      movement: {
        fallSpeed: 1.0, // Rallentato da 1.2
        rotation: 0.02,
        sway: 4
      },
      gameplay: {
        points: 10,
        special: 'speed-boost'
      }
    },

    pizza: {
      id: 'pizza',
      name: 'Pizza',
      type: 'collectible',
      visual: {
        type: 'image',
        content: '/images/pizza.png',
        size: 66,
        goodEffect: true
      },
      movement: {
        fallSpeed: 0.7, // Rallentato da 0.9
        rotation: 0.03,
        sway: 5
      },
      gameplay: {
        points: 15
      }
    },

    // Esempio di collectible raro con SVG
    /* goldStar: {
      id: 'gold-star',
      name: 'Stella Dorata',
      type: 'collectible',
      visual: {
        type: 'svg',
        content: '★',
        size: 40,
        color: '#ffd700', // Oro
        goodEffect: true
      },
      movement: {
        fallSpeed: 0.5, // Rallentato da 0.7
        rotation: 0.06, // Rallentato da 0.08
        sway: 10
      },
      gameplay: {
        points: 50,
        special: 'bonus-multiplier'
      }
    } */
  }
}

/**
 * Factory per creare gli oggetti dal config
 */
export class FallingObjectFactory {
  static createObstacle(type = null) {
    const obstacleKeys = Object.keys(FALLING_OBJECTS_CONFIG.obstacles)
    const selectedType = type || obstacleKeys[Math.floor(Math.random() * obstacleKeys.length)]
    const config = FALLING_OBJECTS_CONFIG.obstacles[selectedType]
    
    if (!config) {
      console.warn(`Tipo ostacolo non trovato: ${selectedType}`)
      return this.createObstacle() // Ricorsione con tipo random
    }
    
    return new FallingObject(config)
  }

  static createCollectible(type = null) {
    const collectibleKeys = Object.keys(FALLING_OBJECTS_CONFIG.collectibles)
    const selectedType = type || collectibleKeys[Math.floor(Math.random() * collectibleKeys.length)]
    const config = FALLING_OBJECTS_CONFIG.collectibles[selectedType]
    
    if (!config) {
      console.warn(`Tipo collectible non trovato: ${selectedType}`)
      return this.createCollectible() // Ricorsione con tipo random
    }
    
    return new FallingObject(config)
  }

  static createSpecificObject(category, type) {
    const config = FALLING_OBJECTS_CONFIG[category]?.[type]
    if (!config) {
      console.warn(`Oggetto non trovato: ${category}.${type}`)
      return null
    }
    return new FallingObject(config)
  }

  static getAllObstacleTypes() {
    return Object.keys(FALLING_OBJECTS_CONFIG.obstacles)
  }

  static getAllCollectibleTypes() {
    return Object.keys(FALLING_OBJECTS_CONFIG.collectibles)
  }

  static getObjectConfig(category, type) {
    return FALLING_OBJECTS_CONFIG[category]?.[type] || null
  }
}