/***************** Fichier de Gestiondes projet et de l'APP admin /*****************/
let arrayGallery;
let listCatName;
// ** Requête API pour la génération des projets ** //
const projectAPI = async () => {
  await fetch("http://localhost:5678/api/works")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      arrayGallery = data;
    });
  await fetch("http://localhost:5678/api/categories")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const arrayCategorie = data;
      listCatName = arrayCategorie.map((el) => (el = el.name));
    })
    .then(() => {
      createGallery();
    });
};
projectAPI();

//  Génération des projet dans la galerie //

// *** Génération des projet **//
function createGallery(listCatName = null) {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";

  arrayGallery.forEach((items) => {
    if (items.category.name === listCatName || listCatName === null) {
      gallery.insertAdjacentHTML(
        "beforeend",
        `<figure id="${items.category.name}">
          <img src="${items.imageUrl}" alt="${items.title}">
          <figcaption> ${items.title} </figaption>
        </figure>`
      );
    }
  });
}

// ** Création de la Filterbar **//
function filterbar() {
  const allButtons = document.querySelectorAll(".button");
  let actived = document.querySelector(".active");
  allButtons.forEach((button) => {
    button.addEventListener("click", () => {
      actived.classList.remove("active");
      button.classList.add("active");
      actived = button;
      // Filtrage des images
      listCatName = button.id;
      if (listCatName === "all") {
        return createGallery();
      } else {
        createGallery(listCatName);
      }
    });
  });
}
filterbar();

/// **********************************  PARTIE ADMIN ********************************** ///

const tokenSession = sessionStorage.getItem("Token");
// On vérifie la présence du tocken, si il est différent de null
function refreshPageAdmin(tokenSession) {
  // On affiche le mode admin
  if (tokenSession !== null) {
    const editMode = (document.querySelector(".edit-mode").style.display =
      null);
    const editLink = (document.querySelector(".edit-link").style.display =
      null);
    const loginHeader = document.getElementById("login");
    // Au clic sur LogOut, on supprime le token et met à jour l'affichage
    loginHeader.innerHTML = "logout";
    loginHeader.addEventListener("click", () => {
      sessionStorage.removeItem("Token");
      loginHeader.href = "index.html";
    });
  }
}
refreshPageAdmin(tokenSession);