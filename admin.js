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

const loginBtn =
    document.getElementById("loginBtn");

const addGameBtn =
    document.getElementById("addGameBtn");
let editingGameId = null;

const gamesList =
    document.getElementById("gamesList");

loginBtn.addEventListener("click", async () => {

    const email =
        document.getElementById("email").value;

    const password =
        document.getElementById("password").value;

    try {

        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

    } catch (error) {

        console.error(error);

        alert("Login Failed");

    }

});

onAuthStateChanged(auth, (user) => {

    if (user) {

        document.getElementById("loginBox")
            .style.display = "none";

        document.getElementById("adminPanel")
            .style.display = "block";

    }

});

addGameBtn.addEventListener("click", async () => {

    const gameName =
        document.getElementById("gameName").value;

    const version =
        document.getElementById("version").value;

    const icon =
        document.getElementById("icon").value;

    const downloadLink =
        document.getElementById("downloadLink").value;

    const features =
        document.getElementById("features")
            .value
            .split("\n")
            .filter(f => f.trim() !== "");

    try {

        await addDoc(
            collection(db, "games"),
            {
                name: gameName,
                version: version,
                downloads: "0",
                icon: icon,
                downloadLink: downloadLink,
                modFeatures: features
            }
        );

        alert("Game Added Successfully");

        document.getElementById("gameName").value = "";
        document.getElementById("version").value = "";
        document.getElementById("icon").value = "";
        document.getElementById("downloadLink").value = "";
        document.getElementById("features").value = "";

    } catch (error) {

        console.error(error);

        alert("Error Adding Game");

    }

});
