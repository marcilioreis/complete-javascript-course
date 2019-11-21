import { elements } from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () =>  {
    elements.searchInput.value = '';
};

export const clearResults = () => {
    elements.searchResultList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
};

/*
    // pizza bacon broccoli - Pasta with tomato and spinach
    acc: 0 / acc + cur.lenght = 5 / newTitle = ['pasta']
    acc: 5 / acc + cur.lenght = 9 / newTitle = ['pasta', 'with']
    acc: 9 / acc + cur.lenght = 15 / newTitle = ['pasta', 'with', 'tomato']
    acc: 15 / acc + cur.lenght = 18 / newTitle = ['pasta', 'with', 'tomato']
    acc: 18 / acc + cur.lenght = 24 / newTitle = ['pasta', 'with', 'tomato']
*/

const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    if (title.length > limit) {
        title.split(' ').reduce((acc, cur) => {
            if (acc + cur.length <= limit) {
                newTitle.push(cur);
            }
            return acc + cur.length;
        }, 0);

        // return the result
        return `${newTitle.join(' ')} ...`;
    }
    return title;
}

const renderRecipe = recipe => {
    const markup = `
        <li>
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="Test">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    `;
    elements.searchResultList.insertAdjacentHTML('beforeend', markup);
};

// type: prev or next
const createButtom = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type == 'prev' ? page - 1 : page + 1}>
        <span>Page ${type == 'prev' ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type == 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>
`;

const renderButtons = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults / resPerPage);

    let button;
    if (page === 1 && pages > 1) {
        // Only button to got to nex page
        button = createButtom(page, 'next');
    } else if (page < pages) {
        // Both buttons
        button = `
            ${createButtom(page, 'prev')}
            ${createButtom(page, 'next')}
        `;
    } else if (page === pages && pages > 1) {
        // Only button to go to prev page
        button = createButtom(page, 'prev');
    }

    elements.searchResPages.insertAdjacentHTML('afterbegin', button)
};

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    // render results of current page
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;

    recipes.slice(start, end).forEach(renderRecipe);

    // render pagination buttons
    renderButtons(page, recipes.length, resPerPage);
};