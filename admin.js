import { db, auth } from "./firebase-config.js";

import {
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
    signInWithEmailAndPassword,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

/* ================= ELEMENTS ================= */

const loginBtn = document.getElementById("loginBtn");
const addGameBtn = document.getElementById("addGameBtn");
const gamesList = document.getElementById("gamesList");

/* ================= STATE ================= */

let editingGameId = null;

/* ================= LOGIN ================= */

loginBtn.addEventListener("click", async () => {

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        console.error(error);
        alert("Login Failed");
    }

});

/* ================= AUTH STATE ================= */

onAuthStateChanged(auth, (user) => {

    if (user) {
        document.getElementById("loginBox").style.display = "none";
        document.getElementById("adminPanel").style.display = "block";

        loadGames();
    }

});

/* ================= LOAD GAMES ================= */

async function loadGames() {

    const snapshot = await getDocs(collection(db, "games"));

    gamesList.innerHTML = "";

    snapshot.forEach((gameDoc) => {

        const game = gameDoc.data();

        const div = document.createElement("div");
        div.className = "admin-game";

        div.innerHTML = `
    <div class="game-info">
        <h3>${game.name}</h3>

        <p class="game-meta">
            Version: ${game.version}
        </p>
    </div>

    <div class="admin-actions">
        <button class="edit-btn">✏️ Edit</button>
        <button class="delete-btn">🗑 Delete</button>
    </div>
`;

        /* ================= EDIT ================= */

        div.querySelector(".edit-btn").addEventListener("click", () => {

            editingGameId = gameDoc.id;

            document.getElementById("gameName").value = game.name || "";
            document.getElementById("version").value = game.version || "";
            document.getElementById("icon").value = game.icon || "";
            document.getElementById("downloadLink").value = game.downloadLink || "";

            document.getElementById("features").value =
                (game.modFeatures || []).join("\n");

            addGameBtn.textContent = "Update Game";

        });

        /* ================= DELETE ================= */

        div.querySelector(".delete-btn").addEventListener("click", async () => {

            if (!confirm(`Delete ${game.name}?`)) return;

            await deleteDoc(doc(db, "games", gameDoc.id));

            loadGames();

        });

        gamesList.appendChild(div);

    });
}

/* ================= ADD / UPDATE GAME ================= */

addGameBtn.addEventListener("click", async () => {

    const gameName = document.getElementById("gameName").value;
    const version = document.getElementById("version").value;
    const icon = document.getElementById("icon").value;
    const downloadLink = document.getElementById("downloadLink").value;

    const features = document.getElementById("features")
        .value
        .split("\n")
        .filter(f => f.trim() !== "");

    try {

        /* ========== UPDATE MODE ========== */
        if (editingGameId) {

            await updateDoc(doc(db, "games", editingGameId), {
                name: gameName,
                version: version,
                icon: icon,
                downloadLink: downloadLink,
                modFeatures: features
            });

            alert("Game Updated Successfully");

            editingGameId = null;
            addGameBtn.textContent = "Add Game";

        }

        /* ========== ADD MODE ========== */
        else {

            await addDoc(collection(db, "games"), {
                name: gameName,
                version: version,
                downloads: 0,
                icon: icon,
                downloadLink: downloadLink,
                modFeatures: features
            });

            alert("Game Added Successfully");
        }

        /* RESET FORM */

        document.getElementById("gameName").value = "";
        document.getElementById("version").value = "";
        document.getElementById("icon").value = "";
        document.getElementById("downloadLink").value = "";
        document.getElementById("features").value = "";

        loadGames();

    } catch (error) {
        console.error(error);
        alert("Operation Failed");
    }

});
