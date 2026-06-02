const BASE_URL = "http://localhost:8081";

const usernameInput = document.getElementById("username-input");
const emailInput = document.getElementById("email-input");
const passwordInput = document.getElementById("password-input");
const repeatPasswordInput = document.getElementById("repeat-password-input");
const registerButton = document.getElementById("register-button");

registerButton.addEventListener("click", processRegistration);

async function processRegistration() {
    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const repeatPassword = repeatPasswordInput.value.trim();

    if (!username || !email || !password || !repeatPassword) {
        alert("Please fill out all fields.");
        return;
    }

    if (password !== repeatPassword) {
        alert("Passwords do not match.");
        return;
    }

    const registerBody = {
        username: username,
        email: email,
        password: password
    };

    const requestOptions = {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(registerBody)
    };

    try {
        const response = await fetch(`${BASE_URL}/register`, requestOptions);

        if (response.status === 201) {
            window.location.href = "../login/login-page.html";
        } else if (response.status === 409) {
            alert("Username or email already exists.");
        } else {
            alert("Registration failed.");
        }
    } catch (error) {
        console.error(error);
        alert("Something went wrong during registration.");
    }
}