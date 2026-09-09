async function getWorks() { 
    const response = await fetch("http://localhost:5678/api/works");    //récupération des travaux depuis l'API
    const works = await response.json();                                //convertion json en js

    return works;   
}

async function getCategories() {
    const response = await fetch("http://localhost:5678/api/categories");//récupération des catégories depuis l'API
    const categories = await response.json();                           //convertion json en js
    
    return categories;
}   

function displayWorks(works) {   

    // Sélectionne dans le DOM l'élément HTML qui possède la classe "gallery"
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";                                             // Clear the gallery before displaying filtered works

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

    for (let i = 0; i < categories.length; i++) {                       // Parcourt toutes les catégories et crée un bouton pour chacune d'elles
        const button = document.createElement("button");                // Crée un élément bouton pour chaque catégorie
        button.textContent = categories[i].name;                        // Définit le texte du bouton avec le nom de la catégorie
        button.dataset.categoryId = categories[i].id;                   //lier le bouton à l'id de la catégorie correspondante
        filters.appendChild(button);                                    

        //ajouter une classe commune pour les boutons de filtre
        button.classList.add("filter-button");

    }
}
function buttonFilter(works) {
    const buttonSelected = document.querySelectorAll(".filter-button");
    
    buttonSelected.forEach(button => {                                  // Parcourt tous les boutons de filtre
        button.addEventListener("click", function() {                   // Ajoute un événement de clic à chaque bouton
            // Supprime la classe "selected" de tous les boutons         
            buttonSelected.forEach(button => button.classList.remove("selected"));
            // Ajoute la classe "selected" au bouton cliqué
            this.classList.add("selected");

            if (this.dataset.categoryId === undefined) {                // Si le bouton cliqué n'a pas d'attribut data-category-id, cela signifie que c'est le bouton "Tous"
                displayWorks(works);
            } else {                                                    // Sinon, on filtre les travaux en fonction de l'id de la catégorie du bouton cliqué
                const categoryId = Number(this.dataset.categoryId);
                const filteredWorks = works.filter(work => work.categoryId === categoryId);
                displayWorks(filteredWorks);
            }
        });       
    });  
}
function login() {
    const formSubmit = document.querySelector(".formLogin");            //Récupération du formulaire de connexion
    const email = document.querySelector(".formLogin #email");          //Récupération de l'input email
    const password = document.querySelector(".formLogin #password");    //Récupération de l'input password
   
    formSubmit.addEventListener("submit", async function(event) {       //déclenchement de l'événement submit du formulaire
        event.preventDefault();                                         //empêche le rechargement de la page lors de la soumission du formulaire
        const userData = {email: email.value,                           //Création d'un objet userData contenant les valeurs des inputs email et password
                         password: password.value};
         
            const response = await fetch("http://localhost:5678/api/users/login", { //envoi d'une requête POST à l'API pour la connexion de l'utilisateur
             method: "POST",
             body: JSON.stringify(userData),
                headers: {
                    "Content-Type": "application/json"
                }
            })
            const data = await response.json();                         //conversion de la réponse JSON en objet JavaScript

            if (response.status === 200) {                              // si la connexion est réussie (code de statut 200)
                sessionStorage.setItem("token", data.token);            //Stockage du token dans sessionStorage
                window.location.href = "index.html";                    // Redirection vers la page index.html après connexion réussie
            } else {                                                    //gestion message d'erreur si l'identifiant ou le mot de passe est incorrect
                const existingErrorMessage = document.querySelector(".loginError");
                if (existingErrorMessage) {
                    existingErrorMessage.remove();                      // Supprime le message d'erreur existant s'il y en a un
                }
                // Création d'un élément span pour afficher le message d'erreur
                const submitButton = document.querySelector(".formLogin input[type='submit']");             
                const errorMessage = document.createElement("span");

                errorMessage.textContent = " Erreur: l'identifiant ou le mot de passe est incorrect.";
                errorMessage.classList.add("loginError");               // Ajoute une classe au message d'erreur pour détectér dans le DOM et le supprimer si nécessaire

                formSubmit.insertBefore(errorMessage, submitButton)     // Insère le message d'erreur avant le bouton de soumission  
            }
            
    });
}


async function init() {
    const works = await getWorks();
    const categories = await getCategories();
    const gallery = document.querySelector(".gallery");
    const token = sessionStorage.getItem("token");                  //Récupération du token dans sessionStorage
    
    if (gallery === null) {                                         // Vérifie si l'élément avec la classe "gallery" n'existe pas sur la page
        login();                                                    // Appelle la fonction login() pour gérer la connexion de l'utilisateur
        
    } else {                                                        // Si l'élément avec la classe "gallery" existe sur la page, on affiche les travaux et on gère les filtres
        displayWorks(works);
        if (token !== null) {                                       // Vérifie si le token existe dans sessionStorage, ce qui signifie que l'utilisateur est connecté
            const loginLink = document.querySelector(".login-link"); // Sélectionne le lien de connexion dans le DOM
            loginLink.textContent = "logout";                       // Change le texte du lien de connexion en "logout"
            loginLink.addEventListener("click", function(event) {   // Ajoute un événement de clic au lien de connexion
                event.preventDefault();                              // Empêche le comportement par défaut du lien (redirection)
                sessionStorage.removeItem("token");                 // Supprime le token de sessionStorage pour déconnecter l'utilisateur
                window.location.href = "index.html";                // Redirige vers la page index.html après la déconnexion
            });
            const editMode = document.createElement("div");        // Crée un nouvel élément div pour le mode édition
            editMode.classList.add("edit-mode");                   // Ajoute la classe "edit-mode" à l'élément
            editMode.textContent = "Mode édition";                 // Définit le texte de l'élément en "Mode édition"

            const body = document.querySelector("body");           // Sélectionne l'élément body dans le DOM
            const header = document.querySelector("header");        
            body.insertBefore(editMode, header);                    // Insère l'élément editMode avant l'élément header dans le body

            const modifier =document.createElement("button");       // Crée un nouveau balise button
            modifier.classList.add("modif-picture");                // ajuster class au balise
            modifier.textContent = "Modifier";

            const portfolioTitle = document.querySelector(".portfolio-title");  
            portfolioTitle.appendChild(modifier);                               // insert la balise dans portfolio
            // Crée l'icon pour le text modifier 
            const iconModif = document.createElement("i");                  // Crée la balise "i" pour l'icon
            const buttonModif = document.querySelector(".modif-picture");   
            iconModif.classList.add("fa-regular", "fa-pen-to-square");      // ajoute la classe à l'icone  
            buttonModif.insertBefore(iconModif,buttonModif.firstChild);     // Insert icon avant premier l'élément dans le conteneur bouton
            
            // Crée l'icon pour le mode édition en haur de la page
            const iconEditMode = document.createElement("i");
            iconEditMode.classList.add("fa-regular", "fa-pen-to-square");
            const baliseEditMode = document.querySelector(".edit-mode");
            baliseEditMode.insertBefore(iconEditMode, baliseEditMode.firstChild);

        } else {                                                    // Si le token n'existe pas, l'utilisateur n'est pas connecté, on crée les filtres pour les travaux
            createFilters(categories);
            buttonFilter(works);
        }
    }
}
init();