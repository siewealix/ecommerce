// server.js
require("dotenv").config();

const app = require("./expressApp");
const connectDB = require("./src/config/mongo"); // <-- on pointe vers src/config/mongo

const PORT = process.env.PORT || 5000;

// Connexion à MongoDB puis démarrage du serveur
connectDB();

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});
