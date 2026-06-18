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

/* ELEMENTS */
const loginBtn = document.getElementById("loginBtn");
const addGameBtn = document.getElementById("addGameBtn");
const gamesList = document.getElementById("gamesList");

const iconFile = document.getElementById("iconFile");
const iconPreview = document.getElementById("iconPreview");

/* STATE */
let editingGameId = null;
let iconBase64 = "";

/* LOGIN */
loginBtn.addEventListener("click", async () => {

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
        alert("Login Failed");
    }

});

/* AUTH */
onAuthStateChanged(auth, (user) => {

    if (user) {
        document.getElementById("loginBox").style.display = "none";
        document.getElementById("adminPanel").style.display = "block";
        loadGames();
    }

});

/* IMAGE PREVIEW */
iconFile.addEventListener("change", () => {

    const file = iconFile.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
        iconBase64 = reader.result;
        iconPreview.src = iconBase64;
        iconPreview.style.display = "block";
    };

    reader.readAsDataURL(file);
});

/* LOAD GAMES */
async function loadGames() {

    const snapshot = await getDocs(collection(db, "games"));

    gamesList.innerHTML = "";

    snapshot.forEach((gameDoc) => {

        const game = gameDoc.data();

        const div = document.createElement("div");
        div.className = "admin-game";

        div.innerHTML = `
            <h3>${game.name}</h3>

            <div>
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;

        /* EDIT */
        div.querySelector(".edit-btn").addEventListener("click", () => {

            editingGameId = gameDoc.id;

            document.getElementById("gameName").value = game.name;
            document.getElementById("version").value = game.version;
            document.getElementById("downloadLink").value = game.downloadLink;

            document.getElementById("features").value =
                (game.modFeatures || []).join("\n");

            iconBase64 = game.icon || "";
            iconPreview.src = iconBase64;
            iconPreview.style.display = iconBase64 ? "block" : "none";

            addGameBtn.textContent = "Update Game";
        });

        /* DELETE */
        div.querySelector(".delete-btn").addEventListener("click", async () => {

            if (!confirm("Delete " + game.name + "?")) return;

            await deleteDoc(doc(db, "games", gameDoc.id));

            loadGames();
        });

        gamesList.appendChild(div);
    });
}

/* ADD / UPDATE GAME */
addGameBtn.addEventListener("click", async () => {

    const name = document.getElementById("gameName").value;
    const version = document.getElementById("version").value;
    const downloadLink = document.getElementById("downloadLink").value;

    const features = document.getElementById("features")
        .value
        .split("\n")
        .filter(f => f.trim() !== "");

    try {

        if (editingGameId) {

            await updateDoc(doc(db, "games", editingGameId), {
                name,
                version,
                icon: iconBase64,
                downloadLink,
                modFeatures: features
            });

            alert("Game Updated");

            editingGameId = null;
            addGameBtn.textContent = "Add Game";

        } else {

            await addDoc(collection(db, "games"), {
                name,
                version,
                icon: iconBase64,
                downloadLink,
                downloads: 0,
                modFeatures: features
            });

            alert("Game Added");
        }

        document.getElementById("gameName").value = "";
        document.getElementById("version").value = "";
        document.getElementById("downloadLink").value = "";
        document.getElementById("features").value = "";

        iconFile.value = "";
        iconPreview.style.display = "none";
        iconBase64 = "";

        loadGames();

    } catch (err) {
        alert("Error Occurred");
    }

});
