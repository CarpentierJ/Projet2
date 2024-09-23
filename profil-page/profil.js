document.getElementById('pdp').addEventListener('click', () => {
    document.getElementById('changer-photo').click();
});

document.getElementById('changer-photo').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const profilePicElement = document.getElementById('pdp');  // Cibler l'élément avec l'ID 'pdp'
            if (profilePicElement) {
                profilePicElement.src = e.target.result;  // Mettre à jour la source de l'image
            } else {
                console.error('Element with ID "pdp" not found.');
            }

            // Envoyer la nouvelle image vers le serveur
            const formData = new FormData();
            formData.append('profilePicture', file);
            formData.append('username', localStorage.getItem('storedusername'));  // Ajouter le nom d'utilisateur

            fetch('http://192.168.64.194:3000/changer-photo', {
                method: 'PUT',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`  // Si vous utilisez un token
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    alert(data.message);
                }
            })
            .catch(error => {
                console.error('Erreur:', error);
                alert('Une erreur est survenue lors de la mise à jour de la photo de profil.');
            });
        };
        reader.readAsDataURL(file);
    }
});

// Gestion du changement de nom
document.getElementById('edit-name-button').addEventListener('click', () => {
    const newName = prompt("Entrez le nouveau nom:");
    if (newName) {
        // Met à jour le nom sur l'interface
        document.getElementById('username').textContent = newName;
        localStorage.setItem('storedusername', newName);

        // Envoie une requête PUT au serveur pour mettre à jour le nom dans la base de données
        fetch('http://localhost:3000/changer-nom', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: 'ancienNom', newUsername: newName })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Nom mis à jour avec succès !");
            } else {
                alert("Erreur lors de la mise à jour du nom.");
            }
        })
        .catch(error => {
            console.error("Erreur lors de la mise à jour du nom:", error);
        });
    }
});


/***********************************************Gestion du changement de mot de passe*////////////////////////////////////////////////////////////////////////////////
document.getElementById('change-password-button').addEventListener('click', () => {
    const oldPassword = prompt("Entrez l'ancien mot de passe:");
    const userId = localStorage.getItem('storedusername'); // Récupérer l'ID utilisateur

    if (oldPassword) {
        // Vérification de l'ancien mot de passe sur le serveur
        fetch(`http://192.168.64.194:3000/user/${userId}/verify-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ password: oldPassword })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur dans la vérification du mot de passe: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            if (data.valid) { // Supposons que la réponse contienne un champ 'valid'
                const newPassword = prompt("Entrez le nouveau mot de passe:");
                if (newPassword) {
                    // Logique pour sauvegarder le nouveau mot de passe sur le serveur
                    fetch(`http://192.168.64.194:3000/user/${userId}/change-password`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ newPassword: newPassword })
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Erreur lors du changement de mot de passe: ' + response.status);
                        }
                        alert("Mot de passe changé !");
                    })
                    .catch(error => {
                        console.error('Erreur:', error);
                        alert("Erreur lors du changement de mot de passe.");
                    });
                }
            } else {
                alert("L'ancien mot de passe est incorrect.");
            }
        })
        .catch(error => {
            console.error('Erreur:', error);
            alert("Erreur lors de la vérification de l'ancien mot de passe.");
        });
    } else {
        alert("L'ancien mot de passe ne peut pas être vide.");
    }
});
/***********************************************************************************/

document.addEventListener('DOMContentLoaded', () => {
    const userId = localStorage.getItem('storedusername');

    if (userId) {
        fetch(`http://192.168.64.194:3000/user/${userId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erreur dans la requête: ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                const imgElement = document.getElementById('pdp');

                if (imgElement) {
                    if (data.PDP) {
                        // Assurez-vous que `data.PDP` est une URL ou un chemin valide pour l'image
                        // Vous pouvez éventuellement ajuster le chemin si nécessaire
                        imgElement.src = data.PDP;
                    } else {
                        imgElement.alt = 'Photo de profil non disponible';
                        console.error('Photo de profil non disponible.');
                        console.log(data.PDP);
                    }
                } else {
                    console.error("L'élément 'pdp' n'existe pas.");
                }
            })
            .catch(error => {
                console.error('Erreur:', error);
                const imgElement = document.getElementById('pdp');
                if (imgElement) {
                    imgElement.alt = 'Erreur lors du chargement des données.';
                }
            });
    } else {
        console.error('Aucun ID utilisateur trouvé dans le stockage local.');
        const imgElement = document.getElementById('pdp');
        if (imgElement) {
            imgElement.alt = 'Aucun utilisateur trouvé.';
        }
    }
});


document.addEventListener('DOMContentLoaded', function() {
    // Vérifier si le token est présent dans le localStorage
   
    const saveusername = localStorage.getItem('storedusername');

    if (saveusername) {
        console.log(saveusername);
        const prenomtext = document.getElementById('username');
        prenomtext.textContent = saveusername;
    }
});


document.getElementById('accueil').addEventListener('click', () => {
    window.location.href = "../accueil-page/accueil.html";
});

//--------------------------Supprimer Compte---------------------------------//

document.getElementById("supprimer-compte").addEventListener("click", function() {

    const confirmation = confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.");

    if (!confirmation) {
        return;
    }
    const username = localStorage.getItem('storedusername');

    if (!username) {
        alert("Nom d'utilisateur introuvable !");
        return;
    }

    // Envoyer une requête DELETE au backend pour supprimer le compte
    fetch('http://192.168.64.194:3000/supprimer', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`  // Si l'authentification est requise
        },
        body: JSON.stringify({ username })  // Envoyer le nom d'utilisateur dans le corps de la requête
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erreur lors de la suppression du compte');
        }
        return response.json();
    })
    .then(data => {
        // Supprimer les données du localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        
        // Rediriger l'utilisateur vers la page de connexion ou d'accueil
        window.location.href = "../index.html";
    })
    .catch(error => {
        console.error('Erreur:', error);
        alert('Une erreur est survenue lors de la suppression du compte.');
    });
});