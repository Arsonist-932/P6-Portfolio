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
  let actived = document.querySelector(".active");
  document.querySelectorAll(".button").forEach((button) => {
    button.addEventListener("click", () => {

      actived.classList.remove("active");
      button.classList.add("active");
      actived = button;

      // Filtrage des images
      listCatName = button.id;
      if (listCatName === "all") { return createGallery(); }

      else { createGallery(listCatName); }
    });
  });
}
filterbar();

/// **********************************  PARTIE ADMIN ********************************** ///

const tokenSession = sessionStorage.getItem("Token");
// On vérifie la présence du tocken, si il est différent de null
const refreshPageAdmin = (tokenSession) => {
  // On affiche le mode admin
  if (tokenSession !== null) {
    document.querySelector(".edit-mode").style.display = null;
    document.querySelector(".edit-link").style.display = null;
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

// ************************** Gestion de la Modal ************************** //

// ****** Gestion d'ouverture de la modal Projet  ****** //
const modal1 = document.getElementById("modal1");
const modal2 = document.getElementById("modal2");

/** Open First Modal  **/
const openModal = () => {
  modal1.style.display = null;
  document.querySelectorAll(".modal-trigger").forEach((trigger) => {
    trigger.addEventListener("click", closeModal);
  });
};

const closeModal = () => { modal1.style.display = "none"; }

/** Open Second Modal **/
const openModalAdd = () => {
  modal2.style.display = null;
  document.querySelectorAll(".modal-trigger1").forEach((trigger) => {
    trigger.addEventListener("click", closeModalAdd);
  });
};

const closeModalAdd = () => { modal2.style.display = "none"; };

// *** Gestion au clic des des modals   *** //
const ModalLink = document.querySelector(".modal-link").addEventListener("click", openModal);
const modalBtn = document.querySelector(".button-add").addEventListener("click", openModalAdd);

// ** Gestion de la fermeture au clavier ** //
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" || e.key === "Esc") {
    closeModal(e);
    closeModalAdd(e);
  }
});