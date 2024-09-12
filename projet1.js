// Récupération des données saisies 
document.getElementById("show-login").addEventListener("click", function() {
  document.getElementById("loginform").classList.remove("hidden");
  document.getElementById("registerform").classList.add("hidden");
});

document.getElementById("show-signup").addEventListener("click", function() {
  document.getElementById("registerform").classList.remove("hidden");
  document.getElementById("loginform").classList.add("hidden");
});

        // Fonction pour gérer l'inscription
document.getElementById('registerform').addEventListener('submit', async function(event) {
    event.preventDefault();
            
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;

    const response = await fetch('http://192.168.64.194:3000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    if (response.ok) {
        alert('Inscription réussie !');
    } else {
        alert(`Erreur : ${data.message}`);
    }
});

        // Fonction pour gérer la connexion
document.getElementById('loginform').addEventListener('submit', async function(event) {
    event.preventDefault();
    console.log("lancement login");
            
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    const response = await fetch('http://192.168.64.194:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    if (response.ok) {
        if (localStorage != 0){
            alert("vous êtes déjà connecté !")
        }
        else {
            localStorage.setItem('token', data.token);
            alert('Connexion réussie !');
        }
    } else {
        alert(`Erreur : ${data.message}`);
    }
});

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