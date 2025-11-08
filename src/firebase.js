// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, query, orderBy, limit, getDocs } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

/**
 * Aggiunge un punteggio alla leaderboard
 * @param {string} playerName - Nome del giocatore
 * @param {number} score - Punteggio ottenuto
 * @returns {Promise} Promise dell'operazione
 */
export async function addScore(playerName, score) {
  try {
    const docRef = await addDoc(collection(db, "apps", "responsability-game", "leaderboard"), {
      name: playerName,
      score: score,
      timestamp: new Date().toISOString()
    });
    console.log("Punteggio salvato con ID: ", docRef.id);
    return docRef;
  } catch (e) {
    console.error("Errore nel salvataggio del punteggio: ", e);
    throw e;
  }
}

/**
 * Ottiene i top N punteggi dalla leaderboard
 * @param {number} topN - Numero di punteggi da recuperare (default: 100)
 * @returns {Promise<Array>} Array di punteggi ordinati
 */
export async function getTopScores(topN = 100) {
  try {
    const q = query(
      collection(db, "apps", "responsability-game", "leaderboard"),
      orderBy("score", "desc"),
      limit(topN)
    );
    
    const querySnapshot = await getDocs(q);
    const scores = [];
    querySnapshot.forEach((doc) => {
      scores.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return scores;
  } catch (e) {
    console.error("Errore nel recupero dei punteggi: ", e);
    throw e;
  }
}

/**
 * Verifica se un punteggio è tra i top N
 * @param {number} score - Punteggio da verificare
 * @param {number} topN - Numero di posizioni (default: 100)
 * @returns {Promise<boolean>} True se il punteggio è qualificato
 */
export async function isScoreQualified(score, topN = 100) {
  try {
    const topScores = await getTopScores(topN);
    
    // Se ci sono meno di topN punteggi, qualifica automaticamente
    if (topScores.length < topN) {
      return true;
    }
    
    // Verifica se il punteggio è maggiore del minimo tra i top
    const lowestTopScore = topScores[topScores.length - 1].score;
    return score > lowestTopScore;
  } catch (e) {
    console.error("Errore nella verifica del punteggio: ", e);
    // In caso di errore, permetti comunque l'inserimento
    return true;
  }
}

export { db };
