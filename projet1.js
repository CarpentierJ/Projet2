// Récupération des données saisies 
document.getElementById("show-login").addEventListener("click", function() {
  document.getElementById("login-form").classList.remove("hidden");
  document.getElementById("signup-form").classList.add("hidden");
});

document.getElementById("show-signup").addEventListener("click", function() {
  document.getElementById("signup-form").classList.remove("hidden");
  document.getElementById("login-form").classList.add("hidden");
});

//Récupération et ajout dans la base de l'inscription
function signup() {
  const username = document.getElementById("signup-username").value;
  const password = document.getElementById("signup-password").value;

  if (username && password) {
      localStorage.setItem("nom du compte", username);
      localStorage.setItem("mot de passe", password);
      alert("Inscription réussie!");
  } else {
      alert("Veuillez renseignez tous les champs.");
  }
}

//Changement d'arrière plan
document.addEventListener('DOMContentLoaded', function() {
    var images = document.querySelectorAll('.background-images img');
    var index = 0;


    function changeBackgroundImage() {
        images[index].style.display = 'none';
        index = (index + 1) % images.length;
        images[index].style.display = 'block';
    }

//Duration d'image avant remplacement
    setInterval(changeBackgroundImage, 5000);
});


// Récupération des éléments de la connexion
function login() {
  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;

  const storedUsername = localStorage.getItem("username");
  const storedPassword = localStorage.getItem("password");
//Vérification de la connexion
  if (username === storedUsername && password === storedPassword) {
      alert("Connexion réussie!");
  } else {
      alert("Mot de passe ou pseudonyme invalide.");
  }
}

let attempts = 0;
const maxAttempts = 5;
const lockDuration = 15 * 60 * 1000; // 15 minutes en millisecondes
let isLocked = false;

document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault(); // Empêche le rechargement de la page

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Si l'utilisateur est bloqué
    if (isLocked) {
        document.getElementById('error-msg').innerText = "Votre compte est bloqué. Réessayez plus tard.";
        return;
    }

    // Simuler une vérification de connexion via un serveur (remplacer par une vraie vérification)
    const loginSuccess = false; // Simule un échec de connexion

    if (loginSuccess) {
        // Connexion réussie
        document.getElementById('error-msg').innerText = "";
        document.getElementById('success-msg').classList.remove('hidden');
        attempts = 0; // Réinitialiser les tentatives après un succès
    } else {
        // Incrémenter les tentatives échouées
        attempts++;

        if (attempts >= maxAttempts) {
            // Bloquer l'utilisateur
            document.getElementById('error-msg').innerText = "Trop de tentatives échouées. Vous êtes bloqué pendant 15 minutes.";
            document.getElementById('success-msg').classList.add('hidden');
            document.getElementById('login-form').querySelector('button').disabled = true;
            isLocked = true;

            // Débloquer après 15 minutes
            setTimeout(function() {
                document.getElementById('login-form').querySelector('button').disabled = false;
                isLocked = false;
                attempts = 0; // Réinitialiser les tentatives après le blocage
                document.getElementById('error-msg').innerText = "";
            }, lockDuration);
        } else {
            // Afficher le message d'erreur avec le nombre de tentatives restantes
            let remainingAttempts = maxAttempts - attempts;
            document.getElementById('error-msg').innerText = "Tentative échouée. Il reste " + remainingAttempts + " tentative(s).";
            document.getElementById('success-msg').classList.add('hidden');
        }
    }
});