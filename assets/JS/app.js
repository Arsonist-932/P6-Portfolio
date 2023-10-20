/***************** Fichier de Gestiondes projet et de l'APP admin /*****************/
let arrayGallery;
let listCatName;
// ** Requête API pour la génération des projets ** //
const projectAPI = async () => {
  await fetch("http://localhost:5678/api/works")
    .then((response) => { return response.json(); })
    .then((data) => { arrayGallery = data; });

  await fetch("http://localhost:5678/api/categories")
    .then((response) => { return response.json(); })
    .then((data) => {
      const arrayCategorie = data;
      listCatName = arrayCategorie.map((el) => (el = el.name));
    })
    .then(() => {
      createGallery();
      createProjectGallery();
    });
};
projectAPI();

// ********************************** GESTION DE LA HOME PAGE ********************************** //

// *** GENERATION DES PROJET ET DU FILTRAGE DANS LA GALLERIE **//
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

// On vérifie la présence du tocken, si il est différent de null
const tokenSession = sessionStorage.getItem("Token");
const refreshPageAdmin = (tokenSession) => {
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
};
refreshPageAdmin(tokenSession);

// ********************************** GESTION MODAL ********************************** //

// ****** GESTION D'OUVERTURE MODAL  ****** //
const modal1 = document.getElementById("modal1");
const modal2 = document.getElementById("modal2");

/** Open/Close First Modal  **/
const openModal = () => {
  modal1.style.display = null;
  document.querySelectorAll(".modal-trigger").forEach((trigger) => {
    trigger.addEventListener("click", closeModal);
  });
};

const closeModal = () => { modal1.style.display = "none"; };

/** Open/Close Second Modal **/
const openModalAdd = () => {
  modal2.style.display = null;
  document.querySelectorAll(".modal-trigger1").forEach((trigger) => {
    trigger.addEventListener("click", closeModalAdd);
  });
};

const closeModalAdd = () => { modal2.style.display = "none"; };

// *** GESTION AU CLIC  *** //
const ModalLink = document.querySelector(".modal-link").addEventListener("click", openModal);
const modalBtn = document.querySelector(".button-add").addEventListener("click", openModalAdd);

// ** GESTION AU CLAVIER ** //
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" || e.key === "Esc") {
    closeModal(e);
    closeModalAdd(e);
  }
});

// ********************************** GESTION DES PROJETS DANS LES MODALS ********************************** //

// *** GENERATION DES PROJETS DANS LA MODAL *** //
const createProjectGallery = () => {
  const galleryModal = document.getElementById("js-galleryModal");
  galleryModal.innerHTML = "";

  arrayGallery.forEach((items) => {
    galleryModal.insertAdjacentHTML("beforeend",
      `<figure id="${items.category.name}">
          <img src="${items.imageUrl}" alt="${items.title}">
          <div id="${items.id}" class="trash">
          <i  id="${items.id}" class="fa-regular fa-trash-can fa-xs"></i>
          </div>
        </figure>`
    );
  });

  const iconeDelete = document.querySelectorAll(".trash").forEach((items) => {
    items.addEventListener("click", deleteWorks);
  });
};

// *** SUPPRESION DES PROJETS *** //
async function deleteWorks(e) {
  let id = e.target.id;
  await fetch(`http://localhost:5678/api/works/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${tokenSession}` },
  })
    .then(async (response) => {
      const messageSucces = document.querySelector(".modal-succes");
      const messageErr = document.querySelector(".modal-error");

      switch (response.status) {
        case 204:
          messageSucces.innerHTML = "Le Projet à été supprimé";
          await projectAPI();
          setTimeout(() => {
            messageSucces.innerText = "";
          }, 1000);
          break;

        case 401:
          messageErr.innerHTML =
            "Vous n'êtes pas autorisé à supprimer le projet, Reconnectez-vous";
          setTimeout(() => {
            messageErr.innerText = "";
            window.location.href = "login.html";
          }, 1000);
          break;

        case 500:
          messageErr.innerHTML = "Une erreur est survenue, merci de ressayer";
          setTimeout(() => {
            messageErr.innerText = "";
          }, 1000);

        default:
          throw new Error(`Réponse HTTP inattendue : ${response.status}`);
      }
    })
    .catch((error) => {
      console.error("Une erreur s'est produite :", error);
    });
}

// *** AJOUT DE PROJETS ** /

// Variables
const modalForm = document.getElementById("js-modal-form");
const imgWorks = document.getElementById("photo");
const imgWorksLabel = document.querySelector(".label-img");
const titleInput = document.querySelector(".form-title input");
const optionsSelect = document.querySelector(".form-options select");
const pError = document.querySelector(".error-form");
const btnAdd = document.getElementById("button-form");

/*** FONCTION POUR L'AFFICHAGE DE L'IMAGE ***/
let file = "";
const previewFile = () => {
  file = imgWorks.files[0];
  const fileRegex = /\.(jpe?g|png)$/i;

  if (file && fileRegex.test(file.name)) {
    const reader = new FileReader();

    reader.onload = function (e) {
      imgWorksLabel.innerHTML = `<img class="image" src="${e.target.result}">`;
    };
    reader.readAsDataURL(file);
  }
}

imgWorks.addEventListener("change", previewFile);

/*** FONCTION POUR LE CHANGEMENT DE COULEUR DU BOUTON  ***/
const btnChange = () => {
  if (titleInput.value !== "" && optionsSelect.value !== "" && imgWorks.value !== "") {
    btnAdd.classList.add("active");
  }
};
modalForm.addEventListener("change", btnChange);

/*** FONCTION POUR VERIFIER LES CHAMPS VIDES ***/
const FormValidate = () => {
  if (titleInput.value === "" || optionsSelect.value === "" || imgWorks === "") {
    pError.innerHTML = "Les informations soumises ne sont pas valides";
    setTimeout(() => {
      pError.innerHTML = "";
    }, 2000);
  } else {
    addProjects();
    resetFormFields();
  }
};

/*** FONCTION D'AJOUT DE PROJETS ***/
const addProjects = async () => {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("title", titleInput.value);
  formData.append("category", optionsSelect.value);

  await fetch("http://localhost:5678/api/works", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${tokenSession}`,
    },
    body: formData,
  })
    .then(async (response) => {
      await response.json();
      const validateMessage = document.querySelector(".validate-form");

      switch (response.status) {
        case 201:
          validateMessage.innerHTML = "Le Projet à bien été envoyé.";
          setTimeout(() => {
            validateMessage.innerHTML = "";
            projectAPI();
          }, 2000);
          break;

        case 401:
          setTimeout(() => {
            validateMessage.innerHTML =
              "Vous n'êtes pas autorisé à ajouter un projet";
            sessionStorage.removeItem("Token");
            window.location.href = "login.html";
          }, 2000);
          break;

        case 500:
          pError.innerHTML = "Une erreur s'est produite, veuillez ressayer";
          setTimeout(() => {
            pError.innerHTML = ""
          }, 1500);

        default:
          throw new Error(`Réponse HTTP inattendue : ${response.status}`);
      }
    })
    .catch((error) => {
      console.error("Une erreur s'est produite :", error);
    });
};

/*** SOUMMISSION DU FORMULAIRE ***/
modalForm.addEventListener("submit", (e) => {
  e.preventDefault();
  FormValidate();
});

/*** RESET DU FORMULAIRE ***/
const resetFormFields = () => {
  file = "";
  titleInput.value = "";
  optionsSelect.value = "";
  imgWorks.value = "";
  imgWorksLabel.innerHTML = `
  <i class="fa-regular fa-image fa-2xl"></i>
  <span class="addpic-btn">+ Ajouter une photo </span>
  <span>jpg, png : 4mo max</span>`;
  btnAdd.classList.remove("active");
  setTimeout(() => {
    closeModalAdd();
  }, 1500);
};
