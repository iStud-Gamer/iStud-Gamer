javascript
import { db } from "./firebase-config.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const gamesContainer = document.getElementById("gamesContainer");
const popup = document.getElementById("popup");
const featuresList = document.getElementById("featuresList");
const closePopup = document.getElementById("closePopup");

async function loadGames() {

    const querySnapshot = await getDocs(
        collection(db, "games")
    );

    gamesContainer.innerHTML = "";

    querySnapshot.forEach((doc) => {

        const game = doc.data();

        const card = document.createElement("div");

        card.className = "game-card";

        card.innerHTML = `
            <img src="${game.icon}" alt="${game.name}">

            <h3>${game.name}</h3>

            <p>Version: ${game.version}</p>

            <p>Downloads: ${game.downloads}</p>

            <button class="btn mod-btn">
                Mod Features
            </button>

            <a
                href="${game.downloadLink}"
                target="_blank"
                class="btn download-btn"
            >
                Download
            </a>
        `;

        const modBtn = card.querySelector(".mod-btn");

        modBtn.addEventListener("click", () => {

            featuresList.innerHTML = "";

            game.modFeatures.forEach((feature) => {

                const li = document.createElement("li");

                li.textContent = feature;

                featuresList.appendChild(li);

            });

            popup.style.display = "block";

        });

        gamesContainer.appendChild(card);

    });

}

closePopup.addEventListener("click", () => {
    popup.style.display = "none";
});

window.addEventListener("click", (e) => {
    if (e.target === popup) {
        popup.style.display = "none";
    }
});

loadGames();
