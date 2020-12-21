import { elements } from "./base";
import {limitTitle} from "./searchView";

export const toggleLikebtn= isLiked=>{
    const iconString = isLiked ? 'icon-heart' : 'icon-heart-outlined';
    document.querySelector('.recipe__love use').setAttribute('href',`img/icons.svg#${iconString}`);
}

export const toggleLikeMenu=numLiked=>{
    elements.likesMenu.style.visibility= numLiked>0 ? 'visible' : 'hidden';
}

export const addLike=item=>{

    const markup =`
    <li>
        <a class="likes__link" href="#${item.id}">
            <figure class="likes__fig">
                <img src="${item.imgUrl}" alt="${item.title}">
            </figure>
            <div class="likes__data">
                <h4 class="likes__name">${limitTitle(item.title)}</h4>
                <p class="likes__author">${item.publisher}</p>
            </div>
        </a>
    </li>
    `
    elements.likesList.insertAdjacentHTML('afterbegin',markup);
};

export const removeLike=id=>{
    const item=document.querySelector(`.likes__link[href*="${id}"]`).parentElement;
    if(item) item.parentElement.removeChild(item);
}