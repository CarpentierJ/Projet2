//----------------------------Vérification de connexion-------------------------------//

document.addEventListener('DOMContentLoaded', function() {
    // Vérifier si le token est présent dans le localStorage
    const token = localStorage.getItem('token');
    
    // Si le token n'est pas présent, rediriger vers la page de connexion
    if (!token) {
        window.location.href = "login.html"; // Rediriger vers la page de connexion
    }
});

//----------------------------Déconnexion-------------------------------//

document.getElementById("logout-button").addEventListener("click", function() {
    // Supprimer le token du localStorage
    localStorage.removeItem('token');
    
    // Optionnel : Supprimer les autres données de connexion comme les tentatives de connexion
    localStorage.removeItem('loginAttempts');
    localStorage.removeItem('blockTime');

    // Message de confirmation
    alert('Vous avez été déconnecté.');

    // Rediriger l'utilisateur vers la page de connexion ou d'accueil
    window.location.href = "index.html";
});
