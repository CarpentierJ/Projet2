const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json()); // Permet à l'application d'analyser le JSON dans le corps des requêtes

// Connexion à la base de données MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'utilisateur'
});

db.connect(err => {
    if (err) {
        console.error('Erreur de connexion à la base de données :', err);
    } else {
        console.log('Connexion réussie à la base de données MySQL');
    }
});

// Exemple de route GET pour obtenir des données
app.get('/api/user', (req, res) => {
    const sql = 'SELECT * FROM user';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs' });
        }
        res.json(results);
    });
});

// Route POST pour la connexion
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log("tentative de connexion")
    // Vérifier si l'utilisateur existe dans la base de données
    const sql = 'SELECT * FROM user WHERE Login = ?';
    db.query(sql, [username], (err, results) => {
        console.log(username);
        if (err) {
            return res.status(500).json({ message: 'Erreur serveur' });
        }
        if (results.length === 0) {
            return res.status(400).json({ message: 'Utilisateur non trouvé' });
        }
        const user = results[0];
        console.log(results);
        // Comparer les mots de passe
        const isMatch = bcrypt.compareSync(password, user.MDP);
        if (!isMatch) {
            return res.status(400).json({ message: 'Mot de passe incorrect' });
        }

        res.status(200).json({ message: 'Connexion réussie' });
        console.log("connecté");
    });
});

// Route POST pour l'inscription
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    // Vérifier si le nom d'utilisateur existe déjà
    const sqlSelect = 'SELECT * FROM user WHERE Login = ?';
    db.query(sqlSelect, [username], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur serveur' });
        }
        if (results.length > 0) {
            return res.status(400).json({ message: 'Nom d\'utilisateur déjà pris' });
        }

        // Si l'utilisateur n'existe pas, hasher le mot de passe
        const hashedPassword = bcrypt.hashSync(password, 10);

        // Insérer le nouvel utilisateur dans la base de données
        const sqlInsert = 'INSERT INTO user (Login, MDP, Email, PDP) VALUES (?, ?, "nul", "nul")';
        db.query(sqlInsert, [username, hashedPassword], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: 'Erreur lors de l\'inscription' });
            }
            res.status(201).json({ message: 'Inscription réussie', userId: result.insertId });
        });
    });
});

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur en écoute sur le port ${PORT}`);
});