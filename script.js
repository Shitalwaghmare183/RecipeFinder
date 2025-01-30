function saveToFavorites(recipe) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (!favorites.some(fav => fav.idMeal === recipe.idMeal)) {
        favorites.push(recipe);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        displayFavorites();
    }
}

function removeFromFavorites(idMeal) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites = favorites.filter(recipe => recipe.idMeal !== idMeal);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    displayFavorites();
}

function displayFavorites() {
    const favoritesDiv = document.getElementById('favorites');
    favoritesDiv.innerHTML = '';
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (favorites.length === 0) {
        favoritesDiv.innerHTML = '<p>No favorites added yet.</p>';
    } else {
        favorites.forEach(meal => {
            const recipeEl = document.createElement('div');
            recipeEl.classList.add('recipe');
            recipeEl.innerHTML = `
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <h3>${meal.strMeal}</h3>
                <button class="favorite" onclick="removeFromFavorites('${meal.idMeal}')">Remove from Favorites</button>
            `;
            favoritesDiv.appendChild(recipeEl);
        });
    }
}

function saveSearchHistory(query) {
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    if (!searchHistory.includes(query)) {
        searchHistory.unshift(query); // Add new search to the top
        if (searchHistory.length > 5) {
            searchHistory.pop(); // Keep only the last 5 searches
        }
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    }
    displaySearchHistory();
}


function removeFromHistory(index) {
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    // Remove the item at the specified index
    searchHistory.splice(index, 1);
    
    // Save the updated search history back to local storage
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    
    // Re-display the search history
    displaySearchHistory();
}


function displaySearchHistory() {
    const historyDiv = document.getElementById('recent-searches');
    const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    
    historyDiv.innerHTML = searchHistory.length ? '' : '<p>No recent searches.</p>';
    
    searchHistory.forEach((query, index) => {
        const historyItem = document.createElement('div');
        historyItem.classList.add('history-item');
        historyItem.textContent = query;

        // Create a "Remove" button
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.style.marginLeft = '10px';
        removeButton.onclick = () => {
            removeFromHistory(index); // Call function to remove item
        };

        historyItem.appendChild(removeButton);
        historyDiv.appendChild(historyItem);
    });
}
async function getRecipes() {
    const query = document.getElementById('search').value;
    saveSearchHistory(query);  // Save the search in local storage

    const apiUrl = `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    const recipesDiv = document.getElementById('recipes');
    recipesDiv.innerHTML = '';

    if (data.meals) {
        data.meals.forEach(meal => {
            const recipeEl = document.createElement('div');
            recipeEl.classList.add('recipe');
            recipeEl.innerHTML = `
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <h3>${meal.strMeal}</h3>
                <button onclick="showRecipeDetails('${meal.idMeal}')">View Recipe</button>
                <button class="favorite" onclick='saveToFavorites(${JSON.stringify(meal)})'>Favorite</button>
            `;
            recipesDiv.appendChild(recipeEl);
        });
    } else {
        recipesDiv.innerHTML = '<p>No recipes found. Try another ingredient!</p>';
    }
}

async function showRecipeDetails(idMeal) {
    const apiUrl = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    const meal = data.meals[0];

    document.getElementById('recipe-title').textContent = meal.strMeal;
    document.getElementById('recipe-img').src = meal.strMealThumb;
    document.getElementById('recipe-instructions').textContent = meal.strInstructions;
    
    // Add YouTube Link
    document.getElementById('recipe-youtube').href = `https://www.youtube.com/results?search_query=${meal.strMeal}`;
    
    document.getElementById('favorite-btn').onclick = () => saveToFavorites(meal);

    document.getElementById('recipe-modal').style.display = "block";
}

function closeModal() {
    document.getElementById('recipe-modal').style.display = "none";
}

document.addEventListener('DOMContentLoaded', () => {
    displayFavorites();
    displaySearchHistory();
});
