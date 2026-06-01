```javascript
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCbY9bX7LkGPx9ZYieL42z2NGAb1eWnIXY",
    authDomain: "istud-gamer.firebaseapp.com",
    projectId: "istud-gamer",
    storageBucket: "istud-gamer.firebasestorage.app",
    messagingSenderId: "526081912301",
    appId: "1:526081912301:web:c7738f9044106fa2820be4"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db };
```
