async function getWorks() {
    const response = await fetch("http://localhost:5678/api/works");
    const works = await response.json();        //convertion json en js
    

    

    for (let i = 0; i < works.length; i++) {

        // Sélectionne dans le DOM l'élément HTML qui possède la classe "gallery"
        const gallery = document.querySelector(".gallery"); 

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

        console.log(works[i].title);
        console.log(works[i].imageUrl);
    } 
    
}

getWorks();

