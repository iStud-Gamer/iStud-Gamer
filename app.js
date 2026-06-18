import { db } from "./firebase-config.js";

import {
    collection,
    getDocs,
    doc,
    updateDoc,
    increment
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* ================= ELEMENTS ================= */

const gamesContainer = document.getElementById("gamesContainer");
const popup = document.getElementById("popup");
const featuresList = document.getElementById("featuresList");
const closePopup = document.getElementById("closePopup");

/* ================= LOAD GAMES ================= */

async function loadGames() {

    const querySnapshot = await getDocs(collection(db, "games"));

    gamesContainer.innerHTML = "";

    querySnapshot.forEach((gameDoc) => {

        const game = gameDoc.data();
        const gameId = gameDoc.id;

        const card = document.createElement("div");
        card.className = "game-card";

        card.innerHTML = `
            <img src="${game.icon}" alt="${game.name}">
            <h3>${game.name}</h3>

            <div class="game-meta">
                <span class="version">v${game.version}</span>

                <span class="downloads-count">
                    <i class="fa-solid fa-download"></i>
                    ${game.downloads || 0}
                </span>
            </div>

            <button class="btn mod-btn">Mod Features</button>
            <button class="btn download-btn">Download</button>
        `;

        /* ================= MOD FEATURES ================= */

        card.querySelector(".mod-btn").addEventListener("click", () => {

            featuresList.innerHTML = "";

            (game.modFeatures || []).forEach((f) => {
                const li = document.createElement("li");
                li.textContent = f;
                featuresList.appendChild(li);
            });

            popup.style.display = "block";
        });

        /* ================= DOWNLOAD ================= */

        card.querySelector(".download-btn").addEventListener("click", async () => {

            try {
                await updateDoc(doc(db, "games", gameId), {
                    downloads: increment(1)
                });

                window.open(game.downloadLink, "_blank");

                loadGames(); // refresh counter
            } catch (error) {
                console.error(error);
                window.open(game.downloadLink, "_blank");
            }
        });

        gamesContainer.appendChild(card);
    });
}

/* ================= POPUP CLOSE ================= */

closePopup.addEventListener("click", () => {
    popup.style.display = "none";
});

window.addEventListener("click", (e) => {
    if (e.target === popup) {
        popup.style.display = "none";
    }
});

/* ================= INIT ================= */

loadGames();
