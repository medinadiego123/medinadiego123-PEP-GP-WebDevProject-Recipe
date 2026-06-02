const BASE_URL = "http://localhost:8081";

const addIngredientNameInput = document.getElementById("add-ingredient-name-input");
const deleteIngredientNameInput = document.getElementById("delete-ingredient-name-input");
const ingredientListContainer = document.getElementById("ingredient-list");

const addIngredientButton = document.getElementById("add-ingredient-submit-button");
const deleteIngredientButton = document.getElementById("delete-ingredient-submit-button");

let ingredients = [];

addIngredientButton.addEventListener("click", addIngredient);
deleteIngredientButton.addEventListener("click", deleteIngredient);

window.addEventListener("DOMContentLoaded", () => {
    if (sessionStorage.getItem("is-admin") !== "true") {
        alert("Admin access only.");
        window.location.href = "../recipe/recipe-page.html";
        return;
    }

    getIngredients();
});

async function addIngredient() {
    const name = addIngredientNameInput.value.trim();

    if (!name) {
        alert("Please enter an ingredient name.");
        return;
    }

    const ingredientBody = {
        name: name
    };

    try {
        const response = await fetch(`${BASE_URL}/ingredients`, {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
            },
            body: JSON.stringify(ingredientBody)
        });

        if (response.status === 201 || response.status === 200) {
            addIngredientNameInput.value = "";
            await getIngredients();
        } else {
            alert("Could not add ingredient.");
        }
    } catch (error) {
        console.error(error);
        alert("Something went wrong while adding ingredient.");
    }
}

async function getIngredients() {
    try {
        const response = await fetch(`${BASE_URL}/ingredients`, {
            method: "GET",
            mode: "cors",
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
            }
        });

        if (response.status === 200) {
            ingredients = await response.json();
            refreshIngredientList();
        } else {
            ingredients = [];
            refreshIngredientList();
            alert("Could not load ingredients.");
        }
    } catch (error) {
        console.error(error);
        alert("Something went wrong while loading ingredients.");
    }
}

async function deleteIngredient() {
    const name = deleteIngredientNameInput.value.trim();

    if (!name) {
        alert("Please enter an ingredient name.");
        return;
    }

    const ingredientToDelete = ingredients.find(ingredient =>
        ingredient.name && ingredient.name.toLowerCase() === name.toLowerCase()
    );

    if (!ingredientToDelete) {
        alert("Ingredient not found.");
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/ingredients/${ingredientToDelete.id}`, {
            method: "DELETE",
            mode: "cors",
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
            }
        });

        if (response.status === 204 || response.status === 200) {
            deleteIngredientNameInput.value = "";
            await getIngredients();
        } else {
            alert("Could not delete ingredient.");
        }
    } catch (error) {
        console.error(error);
        alert("Something went wrong while deleting ingredient.");
    }
}

function refreshIngredientList() {
    ingredientListContainer.innerHTML = "";

    ingredients.forEach(ingredient => {
        const li = document.createElement("li");

        const p = document.createElement("p");
        p.textContent = ingredient.name;

        li.appendChild(p);
        ingredientListContainer.appendChild(li);
    });
}