import {elements} from './base' ;

export const getInput = () => elements.searchInput.value;

export const clearInput= ()=> {
    elements.searchInput.value='';
};

export const clearResults= () =>{
    elements.searchResultsList.innerHTML='';
    elements.searchResultsPages.innerHTML='';
};

export const highlightSelected = id => {
    // const resultsArr = Array.from(document.querySelectorAll('.results__link'));
    // resultsArr.forEach(el => {
    //     el.classList.remove('results__link--active');
    // });
    // document.querySelector(`.results__link[href*="${id}"]`).classList.add('results__link--active');
};

export const limitTitle = (title,limit=17)=>{
    if(title.length>limit){
        const newTitle=[];
        title.split(' ').reduce((acc,cur)=>{
            if(acc + cur.length < limit){
                newTitle.push(cur);
            }
            return acc + cur.length;
        },0);
        return `${newTitle.join(' ')} ...`;
    };
    return title;
}

const renderRecipe = recipe => {
    const recipeHtml =`
        <li>
        <a class="results__link" href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="${recipe.title}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitTitle(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
        </li>
    `
    elements.searchResultsList.insertAdjacentHTML('beforeend',recipeHtml);
};

const createButton =(page,type) => `
        <button class="btn-inline results__btn--${type}" data-goto= ${type === 'prev'? page-1 : page+1}>
                <span>Page ${type === 'prev'? page-1 : page+1}</span>
                <svg class="search__icon">
                    <use href="img/icons.svg#icon-triangle-${type==='prev' ? 'left' : 'right'}"></use>
                </svg>
        </button>
`;

const renderButtons = (page,numResults,resPerPage)=>{
    const pages=Math.ceil(numResults/resPerPage);
    let button;
    if(page==1 && pages>1){
        //display only next page button
        button=createButton(page,'next');
    }
    else if(page<pages){
        // display both buttons
        button=`${createButton(page,'prev')}
                ${createButton(page,'next')}`
    }
    else if(page==pages && pages>1){
        //display only prev page button
        button=createButton(page,'prev')
    }
    elements.searchResultsPages.insertAdjacentHTML('afterbegin',button);
}



export const renderResults = (recipes,page=1,resPerPage=10)=> {
    //render results for current page
    const start=(page-1)*resPerPage;
    const end=page*resPerPage;

    recipes.slice(start,end).forEach(renderRecipe);

    //render buttons
    renderButtons(page,recipes.length,resPerPage);
};

