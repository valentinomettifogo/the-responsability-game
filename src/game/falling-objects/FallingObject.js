/**
 * Classe base per tutti gli oggetti che cadono nel gioco
 */
export default class FallingObject {
  constructor(config) {
    // Proprietà di base
    this.id = config.id || 'unknown'
    this.name = config.name || 'Unknown Object'
    this.type = config.type || 'obstacle' // 'obstacle' o 'collectible'
    
    // Proprietà visive
    this.visual = {
      type: config.visual?.type || 'emoji', // 'emoji', 'image', 'svg'
      content: config.visual?.content || '❓',
      size: config.visual?.size || 50,
      color: config.visual?.color || '#000000',
      badEffect: config.visual?.badEffect || false, // Effetti per oggetti cattivi
      goodEffect: config.visual?.goodEffect || false // Effetti per oggetti buoni
    }
    
    // Proprietà di movimento
    this.movement = {
      fallSpeed: config.movement?.fallSpeed || 1.0, // Moltiplicatore velocità base
      rotation: config.movement?.rotation || 0, // Rotazione durante la caduta
      sway: config.movement?.sway || 0 // Oscillazione laterale
    }
    
    // Proprietà di gioco
    this.gameplay = {
      points: config.gameplay?.points || 0, // Punti quando raccolto
      damage: config.gameplay?.damage || 1, // Danno quando colpito
      special: config.gameplay?.special || null // Effetto speciale
    }
    
    // Proprietà fisiche per collisioni
    this.physics = {
      width: config.physics?.width || this.visual.size,
      height: config.physics?.height || this.visual.size,
      hitboxScale: config.physics?.hitboxScale || 0.8 // % della dimensione per hitbox
    }
    
    // Posizione e stato
    this.position = {
      lane: 0,
      x: 0,
      y: -100
    }
    
    // Stato interno
    this.state = {
      rotation: 0,
      swayOffset: 0,
      isLoaded: false
    }
    
    // Se è un'immagine, pre-caricala
    if (this.visual.type === 'image') {
      this.loadImage()
    }
  }

  /**
   * Carica un'immagine se necessario
   */
  loadImage() {
    this.image = new Image()
    this.image.onload = () => {
      this.state.isLoaded = true
    }
    this.image.onerror = () => {
      console.warn(`Errore nel caricamento dell'immagine: ${this.visual.content}`)
      // Fallback all'emoji
      this.visual.type = 'emoji'
      this.visual.content = '❓'
      this.state.isLoaded = true
    }
    this.image.src = this.visual.content
  }

  /**
   * Imposta la posizione dell'oggetto in base alla corsia
   */
  setLane(lane, laneWidth) {
    this.position.lane = lane
    this.position.x = laneWidth * lane + laneWidth / 2
  }

  /**
   * Aggiorna la posizione e animazioni dell'oggetto
   */
  update(gameSpeed, deltaTime = 1) {
    // Movimento verticale
    this.position.y += gameSpeed * this.movement.fallSpeed * deltaTime
    
    // Rotazione
    if (this.movement.rotation !== 0) {
      this.state.rotation += this.movement.rotation * deltaTime
    }
    
    // Oscillazione laterale (sway)
    if (this.movement.sway !== 0) {
      this.state.swayOffset = Math.sin(this.position.y * 0.01) * this.movement.sway
    }
  }

  /**
   * Verifica se l'oggetto è fuori schermo
   */
  isOffScreen(canvasHeight) {
    return this.position.y > canvasHeight + 100
  }

  /**
   * Disegna l'oggetto sul canvas
   */
  draw(ctx) {
    const x = this.position.x + this.state.swayOffset
    const y = this.position.y
    
    ctx.save()
    
    // Applica rotazione se necessaria
    if (this.state.rotation !== 0) {
      ctx.translate(x, y)
      ctx.rotate(this.state.rotation)
      ctx.translate(-x, -y)
    }
    
    // Disegna prima l'oggetto
    switch (this.visual.type) {
      case 'emoji':
        this.drawEmoji(ctx, x, y)
        break
      case 'image':
        this.drawImage(ctx, x, y)
        break
      case 'svg':
        this.drawSVG(ctx, x, y)
        break
      default:
        this.drawEmoji(ctx, x, y) // Fallback
    }
    
    // Poi disegna gli effetti SOPRA l'oggetto
    this.drawEffects(ctx, x, y)
    
    ctx.restore()
  }

  /**
   * Disegna effetti visivi per distinguere oggetti buoni e cattivi
   */
  drawEffects(ctx, x, y) {
    if (this.visual.badEffect) {
      // Bordino rosso molto sottile per oggetti cattivi
      ctx.strokeStyle = '#ff0000'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(x, y, this.visual.size * 0.5, 0, Math.PI * 2)
      ctx.stroke()
    } else if (this.visual.goodEffect) {
      // Bordino verde molto sottile per oggetti buoni
      ctx.strokeStyle = '#00ff00'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(x, y, this.visual.size * 0.5, 0, Math.PI * 2)
      ctx.stroke()
    }
  }

  /**
   * Disegna un emoji
   */
  drawEmoji(ctx, x, y) {
    ctx.font = `${this.visual.size}px Arial`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(this.visual.content, x, y)
  }

  /**
   * Disegna un'immagine
   */
  drawImage(ctx, x, y) {
    if (!this.state.isLoaded || !this.image) {
      // Mostra emoji di loading o fallback
      this.drawEmoji(ctx, x, y)
      return
    }
    
    const size = this.visual.size
    ctx.drawImage(
      this.image,
      x - size / 2,
      y - size / 2,
      size,
      size
    )
  }

  /**
   * Disegna un SVG (come testo per ora, può essere esteso)
   */
  drawSVG(ctx, x, y) {
    // Per ora disegniamo un placeholder colorato
    ctx.fillStyle = this.visual.color
    ctx.fillRect(
      x - this.visual.size / 2,
      y - this.visual.size / 2,
      this.visual.size,
      this.visual.size
    )
    
    // Aggiungi testo se presente
    if (this.visual.content && this.visual.content !== '') {
      ctx.fillStyle = 'white'
      ctx.font = `${this.visual.size * 0.3}px Arial`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(this.visual.content, x, y)
    }
  }

  /**
   * Ottieni le dimensioni della hitbox per le collisioni
   */
  getHitbox() {
    const scale = this.physics.hitboxScale
    return {
      x: this.position.x - (this.physics.width * scale) / 2,
      y: this.position.y - (this.physics.height * scale) / 2,
      width: this.physics.width * scale,
      height: this.physics.height * scale
    }
  }

  /**
   * Clona l'oggetto (utile per factory)
   */
  clone() {
    return new FallingObject({
      id: this.id,
      name: this.name,
      type: this.type,
      visual: { ...this.visual },
      movement: { ...this.movement },
      gameplay: { ...this.gameplay },
      physics: { ...this.physics }
    })
  }
}