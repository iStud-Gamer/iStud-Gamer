```javascript
import { db } from "./firebase-config.js";

import {
    collection,
    addDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const ADMIN_PASSWORD = "Mamamass1*";

window.login = function () {

    const password =
        document.getElementById("password").value;

    if (password === ADMIN_PASSWORD) {

        document.getElementById("loginBox").style.display = "none";

        document.getElementById("adminPanel").style.display = "block";

    } else {

        alert("Wrong Password");

    }
};

const addGameBtn =
    document.getElementById("addGameBtn");

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
```
