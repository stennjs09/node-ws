const sqlite3 = require('sqlite3').verbose();

// Créer ou ouvrir la base de données esp32.db
const db = new sqlite3.Database('esp.db');

// Créer la table 'total' avec les colonnes 'id', 'name' et 'time'
db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS total (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, time TEXT)");
  db.run("CREATE TABLE IF NOT EXISTS galana (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, time TEXT)");

  // Insérer des données dans la table 'total'
  db.run("INSERT INTO total (name, time) VALUES (?, ?)", ['lavage', '0']);
  db.run("INSERT INTO total (name, time) VALUES (?, ?)", ['pneumatique', '0']);

  // Insérer des données dans la table 'galana'
  db.run("INSERT INTO galana (name, time) VALUES (?, ?)", ['lavage', '0']);
  db.run("INSERT INTO galana (name, time) VALUES (?, ?)", ['lavage_moteur', '0']);
  db.run("INSERT INTO galana (name, time) VALUES (?, ?)", ['pneumatique_vl', '0']);
  db.run("INSERT INTO galana (name, time) VALUES (?, ?)", ['pneumatique_pl', '0']);
});

// Fermer la connexion à la base de données
db.close((err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('BD crée avec succès.');
});
