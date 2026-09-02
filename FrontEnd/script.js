async function getWorks() {
    const response = await fetch("http://localhost:5678/api/works");
    const works = await response.json();        //convertion json en js

    return works;
}

async function getCategories() {
    const response = await fetch("http://localhost:5678/api/categories");
    const categories = await response.json();        //convertion json en js
    
    return categories;
}   

function displayWorks(works) {   

    // Sélectionne dans le DOM l'élément HTML qui possède la classe "gallery"
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = ""; // Clear the gallery before displaying filtered works

    for (let i = 0; i < works.length; i++) {
        // Crée les éléments HTML nécessaires pour afficher un projet
        const figure = document.createElement("figure");    
        const image = document.createElement("img");
        const caption = document.createElement("figcaption");

       // Récupère les données du projet courant et les ajoute aux éléments HTML
        image.src = works[i].imageUrl;                       
        image.alt = works[i].title;                          
        caption.textContent = works[i].title;                

        // Ajoute la figure à la galerie
        gallery.appendChild(figure); 
        
        // Ajoute l'image et sa légende à l'intérieur de la figure                    
        figure.appendChild(image);                       
        figure.appendChild(caption);                     
    }  
    
}
function createFilters(categories) {
    const portfolio = document.querySelector("#portfolio");
    const gallery = document.querySelector(".gallery");

    const filters = document.createElement("div");
    filters.classList.add("filters");
    

    //Dans portfolio, insère filters avant gallery
    portfolio.insertBefore(filters, gallery);

    const buttonTous = document.createElement("button");
    buttonTous.textContent = "Tous";

    //ajouter une classe pour le bouton "Tous"
    buttonTous.classList.add("filter-button");
    buttonTous.classList.add("selected");

    filters.appendChild(buttonTous);

    for (let i = 0; i < categories.length; i++) {
        const button = document.createElement("button");
        button.textContent = categories[i].name;
        button.dataset.categoryId = categories[i].id;   //lier le bouton à l'id de la catégorie correspondante
        filters.appendChild(button);

        //ajouter une classe commune pour les boutons de filtre
        button.classList.add("filter-button");

    }
}
function buttonFilter(works) {
    const buttonSelected = document.querySelectorAll(".filter-button");
    
    buttonSelected.forEach(button => {
        button.addEventListener("click", function() {
            // Supprime la classe "selected" de tous les boutons         
            buttonSelected.forEach(button => button.classList.remove("selected"));
            // Ajoute la classe "selected" au bouton cliqué
            this.classList.add("selected");

            if (this.dataset.categoryId === undefined) {
                displayWorks(works);
            } else {
                const categoryId = Number(this.dataset.categoryId);
                const filteredWorks = works.filter(work => work.categoryId === categoryId);
                displayWorks(filteredWorks);
            }
        });       
    });  
}


async function init() {
    const works = await getWorks();
    const categories = await getCategories();
    
    
    displayWorks(works);
    createFilters(categories);
    buttonFilter(works);
    
}

init();