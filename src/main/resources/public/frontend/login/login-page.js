const BASE_URL = "http://localhost:8081";

const usernameInput = document.getElementById("login-input");
const passwordInput = document.getElementById("password-input");
const loginButton = document.getElementById("login-button");
const logoutButton = document.getElementById("logout-button");

loginButton.addEventListener("click", processLogin);

async function processLogin() {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username || !password) {
        alert("Please enter username and password.");
        return;
    }

    const requestBody = {
        username: username,
        password: password
    };

    const requestOptions = {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
            "Accept": "text/plain"
        },
        body: JSON.stringify(requestBody)
    };

    try {
        const response = await fetch(`${BASE_URL}/login`, requestOptions);

        if (response.status === 200) {
            const responseText = await response.text();
            const parts = responseText.split(" ");

            const token = parts[0];
            const isAdmin = parts[1];

            sessionStorage.setItem("auth-token", token);
            sessionStorage.setItem("is-admin", isAdmin);

            setTimeout(() => {
                window.location.href = "../recipe/recipe-page.html";
            }, 500);

        } else if (response.status === 401) {
            alert("Incorrect login!");
        } else {
            alert("Unknown issue!");
        }

    } catch (error) {
        console.error(error);
        alert("Something went wrong during login.");
    }
}