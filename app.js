import { db } from "./firebase-config.js";

import {
    collection,
    getDocs,
    doc,
    updateDoc,
    increment
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const gamesContainer = document.getElementById("gamesContainer");
const popup = document.getElementById("popup");
const featuresList = document.getElementById("featuresList");
const closePopup = document.getElementById("closePopup");

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

                <span class="version">
                    v${game.version}
                </span>

                <span class="downloads-count">
                    <i class="fa-solid fa-download download-icon"></i>
                    ${game.downloads || 0}
                </span>

            </div>

            <button class="btn mod-btn">
                <i class="fa-solid fa-crown"></i> Mod Features
            </button>

            <button class="btn download-btn">
                Download
            </button>
        `;

        /* ================= MOD FEATURES POPUP ================= */
        const modBtn = card.querySelector(".mod-btn");

        modBtn.addEventListener("click", () => {

            featuresList.innerHTML = "";

            if (game.modFeatures) {
                game.modFeatures.forEach((feature) => {
                    const li = document.createElement("li");
                    li.textContent = feature;
                    featuresList.appendChild(li);
                });
            }

            popup.style.display = "block";
        });

        /* ================= DOWNLOAD COUNTER ================= */
        const downloadBtn = card.querySelector(".download-btn");

        downloadBtn.addEventListener("click", async () => {

            try {

                const gameRef = doc(db, "games", gameId);

                await updateDoc(gameRef, {
                    downloads: increment(1)
                });

                const downloadsSpan =
                    card.querySelector(".downloads-count");

                let current =
                    parseInt(downloadsSpan.textContent) || 0;

                downloadsSpan.innerHTML = `
                    <i class="fa-solid fa-download download-icon"></i>
                    ${current + 1}
                `;

                window.open(game.downloadLink, "_blank");

            } catch (error) {

                console.error("Download update failed:", error);

                window.open(game.downloadLink, "_blank");
            }

        });

        gamesContainer.appendChild(card);

    });
}

/* ================= POPUP CLOSE LOGIC ================= */
closePopup.addEventListener("click", () => {
    popup.style.display = "none";
});

window.addEventListener("click", (e) => {
    if (e.target === popup) {
        popup.style.display = "none";
    }
});

/* ================= LOAD GAMES ================= */
loadGames();
