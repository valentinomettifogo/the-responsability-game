# Cartella Immagini per Oggetti di Gioco

Metti qui le immagini personalizzate per gli oggetti che cadono.

## 📁 Struttura consigliata:

```
public/images/
├── obstacles/
│   ├── work-laptop.png
│   ├── study-books.jpg
│   └── family-photo.png
├── collectibles/
│   ├── gaming-controller.png
│   ├── coffee-cup.png
│   └── pizza-slice.png
└── special/
    ├── bonus-star.png
    └── power-up.gif
```

## 🎨 Formati supportati:
- PNG (consigliato per trasparenza)
- JPG/JPEG
- GIF (animazioni supportate)
- WEBP

## 📏 Dimensioni consigliate:
- **Piccoli oggetti**: 32x32 - 48x48 px
- **Oggetti medi**: 64x64 - 96x96 px
- **Oggetti grandi**: 128x128 px

## 💡 Consigli:
1. Usa immagini con sfondo trasparente (PNG)
2. Mantieni proporzioni quadrate per migliore rendering
3. Ottimizza le dimensioni dei file per performance migliori
4. Usa nomi descrittivi per i file

## 🔗 Come usare nel gioco:

```javascript
// In FallingObjectsConfig.js
myCustomObject: {
  visual: {
    type: 'image',
    content: '/images/obstacles/my-object.png',
    size: 50
  }
}
```