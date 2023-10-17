// Variablees de base
const form = document.querySelector("form");
let message;

// Fonction pour valider le format du nom d'utilisateur et du mot de passe avec des regex
function validateFormat(mail, password) {
  // Regex Email & Password
  const mailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\\.[a-zA-Z0-9._-]+$/;
  const passRegex = /^[a-zA-Z0-9.-_]$/;

  return mailRegex.test(mail) && passRegex.test(password);
}

// Fonction pour gérer le formulaire de connexion
function login() {
  const mail = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Valider le format du nom d'utilisateur et du mot de passe
  if (validateFormat(mail, password)) {
    alert("Nom d'utilisateur ou mot de passe invalide.");
    return;
  }

  // Configuration de l'objet pour la requête à l'API
  const user = {
    email: mail,
    password: password,
  };

  // Requête vers l'API
  fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.token) {
        console.log(result.token);
        sessionStorage.setItem("Token", result.token);
        //alert("Authentification réussie !");
        // Redirection vers la console admin
        window.location.href = "index.html";
      } else {
        let messageErreur = document.getElementById("erreur-msg");
        message = "La combinaison e-mail/mot de passe est incorrecte";
        messageErreur.innerText = message;
      }
    })
    .catch((error) => {
      console.error("Erreur lors de la requête vers l'API :", error);
    });
}

form.addEventListener("submit", function (event) {
  event.preventDefault();
  login();
});
