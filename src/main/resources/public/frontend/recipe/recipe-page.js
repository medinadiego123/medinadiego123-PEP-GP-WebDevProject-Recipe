const BASE_URL = "http://localhost:8081";

let recipes = [];

window.addEventListener("DOMContentLoaded", () => {
    const addRecipeNameInput = document.getElementById("add-recipe-name-input");
    const addRecipeInstructionsInput = document.getElementById("add-recipe-instructions-input");

    const updateRecipeNameInput = document.getElementById("update-recipe-name-input");
    const updateRecipeInstructionsInput = document.getElementById("update-recipe-instructions-input");

    const deleteRecipeNameInput = document.getElementById("delete-recipe-name-input");

    const recipeList = document.getElementById("recipe-list");
    const adminLink = document.getElementById("admin-link");
    const logoutButton = document.getElementById("logout-button");
    const searchInput = document.getElementById("search-input");

    const addRecipeButton = document.getElementById("add-recipe-submit-input");
    const updateRecipeButton = document.getElementById("update-recipe-submit-input");
    const deleteRecipeButton = document.getElementById("delete-recipe-submit-input");
    const searchButton = document.getElementById("search-button");

    if (sessionStorage.getItem("auth-token")) {
        logoutButton.style.display = "inline-block";
    }

    if (sessionStorage.getItem("is-admin") === "true") {
        adminLink.style.display = "inline-block";
    }

    addRecipeButton.addEventListener("click", addRecipe);
    updateRecipeButton.addEventListener("click", updateRecipe);
    deleteRecipeButton.addEventListener("click", deleteRecipe);
    searchButton.addEventListener("click", searchRecipes);
    logoutButton.addEventListener("click", processLogout);

    getRecipes();

    async function searchRecipes() {
        const searchTerm = searchInput.value.trim();

        if (!searchTerm) {
            getRecipes();
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/recipes?name=${encodeURIComponent(searchTerm)}`);

            if (response.status === 200) {
                recipes = await response.json();
                refreshRecipeList();
            } else if (response.status === 404) {
                recipes = [];
                refreshRecipeList();
            } else {
                alert("Could not search recipes.");
            }
        } catch (error) {
            console.error(error);
            alert("Something went wrong while searching recipes.");
        }
    }

    async function addRecipe() {
        const name = addRecipeNameInput.value.trim();
        const instructions = addRecipeInstructionsInput.value.trim();

        if (!name || !instructions) {
            alert("Please enter recipe name and instructions.");
            return;
        }

        const recipeBody = {
            name: name,
            instructions: instructions
        };

        try {
            const response = await fetch(`${BASE_URL}/recipes`, {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
                },
                body: JSON.stringify(recipeBody)
            });

            if (response.status === 201 || response.status === 200) {
                addRecipeNameInput.value = "";
                addRecipeInstructionsInput.value = "";
                await getRecipes();
            } else if (response.status === 401) {
                alert("You must be logged in to add a recipe.");
            } else {
                alert("Could not add recipe.");
            }
        } catch (error) {
            console.error(error);
            alert("Something went wrong while adding recipe.");
        }
    }

    async function updateRecipe() {
        const name = updateRecipeNameInput.value.trim();
        const instructions = updateRecipeInstructionsInput.value.trim();

        if (!name || !instructions) {
            alert("Please enter recipe name and updated instructions.");
            return;
        }

        await getRecipes();

        const recipeToUpdate = recipes.find(recipe =>
            recipe.name && recipe.name.toLowerCase() === name.toLowerCase()
        );

        if (!recipeToUpdate) {
            alert("Recipe not found.");
            return;
        }

        const updatedRecipe = {
            ...recipeToUpdate,
            name: recipeToUpdate.name,
            instructions: instructions
        };

        try {
            const response = await fetch(`${BASE_URL}/recipes/${recipeToUpdate.id}`, {
                method: "PUT",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
                },
                body: JSON.stringify(updatedRecipe)
            });

            if (response.status === 200 || response.status === 204) {
                updateRecipeNameInput.value = "";
                updateRecipeInstructionsInput.value = "";
                await getRecipes();
            } else if (response.status === 404) {
                alert("Recipe not found.");
            } else {
                alert("Could not update recipe.");
            }
        } catch (error) {
            console.error(error);
            alert("Something went wrong while updating recipe.");
        }
    }

    async function deleteRecipe() {
        const name = deleteRecipeNameInput.value.trim();

        if (!name) {
            alert("Please enter a recipe name.");
            return;
        }

        await getRecipes();

        const recipeToDelete = recipes.find(recipe =>
            recipe.name && recipe.name.toLowerCase() === name.toLowerCase()
        );

        if (!recipeToDelete) {
            alert("Recipe not found.");
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/recipes/${recipeToDelete.id}`, {
                method: "DELETE",
                mode: "cors",
                headers: {
                    "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
                }
            });

            if (response.status === 200 || response.status === 204) {
                deleteRecipeNameInput.value = "";
                await getRecipes();
            } else if (response.status === 404) {
                alert("Recipe not found.");
            } else {
                alert("Could not delete recipe.");
            }
        } catch (error) {
            console.error(error);
            alert("Something went wrong while deleting recipe.");
        }
    }

    async function getRecipes() {
        try {
            const response = await fetch(`${BASE_URL}/recipes`);

            if (response.status === 200) {
                recipes = await response.json();
            } else if (response.status === 404) {
                recipes = [];
            } else {
                recipes = [];
                alert("Could not load recipes.");
            }

            refreshRecipeList();
        } catch (error) {
            console.error(error);
            alert("Something went wrong while loading recipes.");
        }
    }

    function refreshRecipeList() {
        recipeList.innerHTML = "";

        recipes.forEach(recipe => {
            const li = document.createElement("li");

            const name = document.createElement("p");
            name.textContent = "Name: " + recipe.name;

            const instructions = document.createElement("p");
            instructions.textContent = "Instructions: " + recipe.instructions;

            li.appendChild(name);
            li.appendChild(instructions);
            recipeList.appendChild(li);
        });
    }

    async function processLogout() {
        try {
            const response = await fetch(`${BASE_URL}/logout`, {
                method: "POST",
                mode: "cors",
                headers: {
                    "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
                }
            });

            if (response.status === 200) {
                sessionStorage.removeItem("auth-token");
                sessionStorage.removeItem("is-admin");
                window.location.href = "../login/login-page.html";
            } else {
                alert("Could not log out.");
            }
        } catch (error) {
            console.error(error);
            alert("Something went wrong while logging out.");
        }
    }
});