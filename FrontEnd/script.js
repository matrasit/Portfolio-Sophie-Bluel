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
        figure.dataset.id = works[i].id;             

        // Ajoute l'image et sa légende à l'intérieur de la figure                    
        
        figure.appendChild(image); 
        figure.appendChild(caption);                       
         // Ajoute la figure à la galerie
        gallery.appendChild(figure);            
    }  
}
function displayModalWorks(works) {   
    // Sélectionne dans le DOM l'élément HTML qui possède la classe "gallery"
    const gallery = document.querySelector(".modal-gallery");
    gallery.innerHTML = "";                                             // Clear the gallery before displaying filtered works

    for (let i = 0; i < works.length; i++) {
        // Crée les éléments HTML nécessaires pour afficher un projet
        const figure = document.createElement("figure");    
        const image = document.createElement("img");
        const buttonTrash = document.createElement("button");
        const iconTrash = document.createElement("i");

       // Récupère les données du projet courant et les ajoute aux éléments HTML
        image.src = works[i].imageUrl;  
        image.alt = works[i].title;      

        buttonTrash.classList.add("delete-work");
        iconTrash.classList.add("fa-regular", "fa-trash-can");     
        figure.appendChild(image);                                      
        gallery.appendChild(figure);                                    
        figure.appendChild(buttonTrash);
        buttonTrash.appendChild(iconTrash); 
        
        buttonTrash.addEventListener("click", async function(event){
            const id = works[i].id;
            const token = sessionStorage.getItem("token");
            const response = await fetch(`http://localhost:5678/api/works/${id}`,{
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if(response.ok){
                figure.remove();
                const mainFigure = document.querySelector(`figure[data-id="${id}"]`);
                mainFigure.remove();
                const index = works.findIndex(function(work) {
                 return work.id === id;
                });
                
                if (index !== -1) {
                    works.splice(index, 1);
                }
            };
        });
    }; 
}
function openAddPhotoPage(categories, works){
    const buttonAddPhoto = document.querySelector(".buttonAddPhoto");           //Création de la modale pour ajouté la photo
    buttonAddPhoto.addEventListener("click", function(){
        const modalTitre = document.querySelector(".modal-titre");
        modalTitre.textContent = "Ajout photo";

        const modalGallery = document.querySelector(".modal-gallery");
        modalGallery.style.display = "none";
        buttonAddPhoto.style.display = "none";

        const buttonBack = document.createElement("button");                    //Crée bouton retour
        buttonBack.classList.add("buttonBack");
        const iconBack = document.createElement("i");
        iconBack.classList.add("fa-solid", "fa-arrow-left");
        buttonBack.appendChild(iconBack);

        const modalWrapper = document.querySelector(".modal-wrapper");          
        const buttonCloseModal = document.querySelector(".ButtonCloseModal");
        modalWrapper.insertBefore(buttonBack,buttonCloseModal);

        function backToGallery() {                                              // fontion qui permet de retourner sur la modale avant 
            buttonBack.remove();
            modalTitre.textContent = "Gallery Photo";
            modalGallery.style.display = "grid";
            buttonAddPhoto.style.display = "block";
            addPhotoForm.remove();
        }
        buttonBack.addEventListener("click",function(){
            backToGallery();
        });
        
        const addPhotoForm = document.createElement("form");                // création formulaire pour ajoute photo
        addPhotoForm.classList.add("add-photo-form");
        modalWrapper.appendChild(addPhotoForm);

        const uploadZone = document.createElement("div");                   
        uploadZone.classList.add("upload-zone");
        addPhotoForm.appendChild(uploadZone);

        const iconImag = document.createElement("i");
        iconImag.classList.add("fa-solid", "fa-image");
        uploadZone.appendChild(iconImag);

        const errorImage =document.createElement("p");
        errorImage.classList.add("error-image")
        uploadZone.appendChild(errorImage);
        

        const inputImage = document.createElement("input");
        inputImage.type = "file";
        inputImage.id = "image";
        inputImage.name = "image";
        inputImage.accept = "image/png, image/jpeg";
        uploadZone.appendChild(inputImage);

        inputImage.addEventListener("change",function(){
            const imageFile = inputImage.files[0];
            
           if (imageFile) {
                errorImage.textContent = "";
                 if (imageFile.size > 4 * 1024 * 1024) {
                    inputImage.value = "";
                    errorImage.textContent = "L'image ne doit pas dépasser 4 Mo."
                    return;
                }

            const imageUrl = URL.createObjectURL(imageFile); //créer une URL temporaire permettant au navigateur d'afficher le fichier sélectionné
            
            const previewImage = document.createElement("img");
            previewImage.src = imageUrl;
            previewImage.alt = "Prévisualisation de l'image";
            previewImage.classList.add("preview-image");

            iconImag.style.display = "none";
            labelAddPhoto.style.display = "none";
            textFormat.style.display = "none";

            uploadZone.appendChild(previewImage);
            }
        });

        const labelAddPhoto = document.createElement("label");
        labelAddPhoto.classList.add("button-add-photo-form");
        labelAddPhoto.htmlFor = "image";
        labelAddPhoto.textContent = "+ Ajouter photo";
        uploadZone.appendChild(labelAddPhoto);

        const textFormat = document.createElement("p");
        textFormat.classList.add("text-format");
        textFormat.textContent = "jpg, png : 4mo max"
        uploadZone.appendChild(textFormat);

        const formGroupTitre = document.createElement("div");
        formGroupTitre.classList.add("form-group");
        addPhotoForm.appendChild(formGroupTitre);
        const formGroupCategorie = document.createElement("div");
        formGroupCategorie.classList.add("form-group");
        addPhotoForm.appendChild(formGroupCategorie);

        const labelTitre = document.createElement("label");
        labelTitre.textContent ="Title";
        labelTitre.htmlFor = "titre";
        formGroupTitre.appendChild(labelTitre);

        const inputTitre = document.createElement("input");
        inputTitre.id = "titre";
        inputTitre.type = "text";
        inputTitre.name = "titre";
        formGroupTitre.appendChild(inputTitre);

        const labelCategorie = document.createElement("label");
        labelCategorie.textContent ="Catégorie";
        labelCategorie.htmlFor = "categorie";
        formGroupCategorie.appendChild(labelCategorie);

        const selectCategorie = document.createElement("select");
        selectCategorie.id = "categorie";
        selectCategorie.name = "categorie";        
        formGroupCategorie.appendChild(selectCategorie);

        const optionVide = document.createElement("option");
        optionVide.value = "";
        optionVide.textContent = "";
        selectCategorie.appendChild(optionVide);

        categories.forEach(function(categorie){
            
                const optionCategorie = document.createElement("option");
                optionCategorie.textContent = categorie.name;
                optionCategorie.value = categorie.id;
                selectCategorie.appendChild(optionCategorie);
            }   
        );

        const buttonValidate = document.createElement("button");            //Création bouton "valider"
        buttonValidate.classList.add("button-validate");
        buttonValidate.textContent = "Valider";
        buttonValidate.type = "submit";
        buttonValidate.disabled = true;
        addPhotoForm.appendChild(buttonValidate);

        const errorSubmit = document.createElement("p");
        errorSubmit.classList.add("error-submit");
        addPhotoForm.appendChild(errorSubmit);

        function checkFormValidity() {
        const imageIsValid = inputImage.files.length > 0;
        const titleIsValid = inputTitre.value.trim() !== "";
        const categoryIsValid = selectCategorie.value !== "";
        if (imageIsValid && titleIsValid && categoryIsValid) {
            buttonValidate.disabled = false;
            buttonValidate.classList.add("active");
        } else {
            buttonValidate.disabled = true;
            buttonValidate.classList.remove("active");
        }
        }
        inputImage.addEventListener("change", checkFormValidity);
        inputTitre.addEventListener("input", checkFormValidity);
        selectCategorie.addEventListener("change", checkFormValidity);

        addPhotoForm.addEventListener("submit", async function(event) {
            event.preventDefault();
            const formData = new FormData();

            formData.append("image", inputImage.files[0]);
            formData.append("title", inputTitre.value);
            formData.append("category", selectCategorie.value);

            for (const [key, value] of formData.entries()) {
            }

            const token = sessionStorage.getItem("token");
            const response = await fetch("http://localhost:5678/api/works", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            
            });
            if (response.ok) {
                    const newWork = await response.json();
                    works.push(newWork);
                    displayWorks(works);
                    displayModalWorks(works);
                    backToGallery();
                } else{
                    errorSubmit.textContent = "Une erreur est survenue lors de l'ajout du projet"
                } 
        });  
    });
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

            if (response.ok) {                              // si la connexion est réussie (code de statut 200)
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
function editPage(){
    const loginLink = document.querySelector(".login-link"); 
            loginLink.textContent = "logout";                       // Change le texte du lien de connexion en "logout"
            loginLink.addEventListener("click", function(event) {   // Ajoute un événement de clic au lien de connexion
                event.preventDefault();                              // Empêche le comportement par défaut du lien (redirection)
                sessionStorage.removeItem("token");                 // Supprime le token de sessionStorage pour déconnecter l'utilisateur
                window.location.href = "index.html";                // Redirige vers la page index.html après la déconnexion
            });
            const editMode = document.createElement("div");        // Crée un nouvel élément div pour le mode édition
            editMode.classList.add("edit-mode");                   
            editMode.textContent = "Mode édition";                 // Définit le texte de l'élément en "Mode édition"

            const body = document.querySelector("body");           
            const header = document.querySelector("header");        
            body.insertBefore(editMode, header);                    // Insère l'élément editMode avant l'élément header dans le body

            const modifier =document.createElement("button");       
            modifier.classList.add("modif-picture");                
            modifier.textContent = "Modifier";

            const portfolioTitle = document.querySelector(".portfolio-title");  
            portfolioTitle.appendChild(modifier);                               // insert la balise dans portfolio
            // Crée l'icon pour le text modifier 
            const iconModif = document.createElement("i");                  // Crée la balise "i" pour l'icon
            const buttonModif = document.querySelector(".modif-picture");   
            iconModif.classList.add("fa-regular", "fa-pen-to-square");        
            buttonModif.insertBefore(iconModif,buttonModif.firstChild);     // Insert icon avant premier l'élément dans le conteneur bouton
            
            // Crée l'icon pour le mode édition en haur de la page
            const iconEditMode = document.createElement("i");
            iconEditMode.classList.add("fa-regular", "fa-pen-to-square");
            const baliseEditMode = document.querySelector(".edit-mode");
            baliseEditMode.insertBefore(iconEditMode, baliseEditMode.firstChild);

            buttonModif.addEventListener("click", function(event){
                event.preventDefault();     
                openModalPage(buttonModif);
                
            });
            const buttonCloseModale = document.querySelector(".ButtonCloseModal")
            buttonCloseModale.addEventListener("click", function(event){
                event.preventDefault();
                closeModalPage(buttonModif);
                
            });
}
function openModalPage(buttonModif){
        const openModal = document.querySelector("#modal");
        openModal.style.display = null;                             //retire le display: none inline, donc CSS .modal1 { display: flex; } reprend la main.
        openModal.removeAttribute("aria-hidden");                   
        openModal.setAttribute("aria-modal", "true");  
                     //indique que cette boîte de dialogue est maintenant active comme modale.
        const closeModalOnClick = function(event){
            closeModalPage(buttonModif);
        }
        openModal.addEventListener("click", closeModalOnClick);
        
        const modalWrapper = document.querySelector(".modal-wrapper");
        modalWrapper.addEventListener("click", function(event){           
            stopPropagation(event);
        });     
}

function closeModalPage(buttonModif){
        const openModal = document.querySelector("#modal");
        buttonModif.focus();
        openModal.style.display = "none";   
        openModal.setAttribute("aria-hidden", 'true');
        openModal.removeAttribute("aria-modal");
        
}
function stopPropagation(event){
    event.stopPropagation();
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
        displayModalWorks(works) 
        if (token !== null) {                                       // Vérifie si le token existe dans sessionStorage, ce qui signifie que l'utilisateur est connecté
            editPage();
            openAddPhotoPage(categories,works);

        } else {                                                    // Si le token n'existe pas, l'utilisateur n'est pas connecté, on crée les filtres pour les travaux
            createFilters(categories);
            buttonFilter(works);
        }
    }
}
init();