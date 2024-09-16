const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const app = express();
const jwt = require('jsonwebtoken');
const secretKey = 'keepass';
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Créer le dossier 'uploads' s'il n'existe pas
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuration de multer pour le stockage des fichiers
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Middleware pour servir les fichiers statiques depuis le dossier 'uploads'
app.use('/uploads', express.static(uploadDir));
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

function checkToken(req, res, next) {
    const token = req.headers['authorization'];
    
    if (token) {
        jwt.verify(token.split(' ')[1], secretKey, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Token invalide ou expiré' });
            }
            // Si le token est valide, informer que l'utilisateur est déjà connecté
            return res.status(400).json({ message: 'Déjà connecté' });
        });
    } else {
        next();
    }
}

app.post('/login', checkToken, async (req, res) => {
    const { username, password } = req.body;
    console.log("tentative de connexion");

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

        // Si les identifiants sont corrects, générer un token
        const token = jwt.sign(
            { id: user.id, username: user.Login },  // Payload (les données à inclure dans le token)
            secretKey,                              // Clé secrète pour signer le token
            { expiresIn: '1h' }                     // Durée de validité du token (ici 1 heure)
        );


        // Envoyer le token au client
        res.status(200).json({ 
            message: 'Connexion réussie', 
            token 
        });

        console.log("connecté");
    });
});

// Route POST pour l'inscription avec multer pour gérer les fichiers
app.post('/register', upload.single('capture'), async (req, res) => {
    const { username, password } = req.body;
    const capture = req.file ? req.file.path : null;

    // Vérifier si le nom d'utilisateur existe déjà
    const sqlSelect = 'SELECT * FROM user WHERE Login = ?';
    db.query(sqlSelect, [username], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur serveur lors de la vérification de l\'utilisateur' });
        }

        if (results.length > 0) {
            return res.status(400).json({ message: 'Nom d\'utilisateur déjà pris' });
        }

        // Hasher le mot de passe
        const hashedPassword = bcrypt.hashSync(password, 10);

        // Gérer l'absence de capture (photo de profil)
        const pdpValue = capture ? capture : 'uploads/pdp.jpg';

        // Insérer le nouvel utilisateur dans la base de données
        const sqlInsert = 'INSERT INTO user (Login, MDP, Email, PDP) VALUES (?, ?, "nul", ?)';
        db.query(sqlInsert, [username, hashedPassword, pdpValue], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: 'Erreur lors de l\'inscription dans la base de données' });
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