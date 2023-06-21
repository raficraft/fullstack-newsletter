const fs = require('fs');
const path = require('path');
const express = require('express');

const router = express.Router();

// Lire le contenu du dossier courant (i.e., 'routes')
fs.readdirSync(__dirname, { withFileTypes: true }).forEach((dirent) => {
  // Ne pas importer ce fichier (i.e., 'index.js')
  if (dirent.name === 'index.js') return;

  // Ignore non-directories
  if (!dirent.isDirectory()) return;

  // Construire le chemin absolu vers le fichier
  const routePath = path.resolve(__dirname, dirent.name, dirent.name);

  // Importer le routeur
  const route = require(routePath);

  // Ajouter le routeur à l'application Express
  router.use(`/${dirent.name}`, route);
});

module.exports = router;
