# E-commerce (React + Node.js)

Projet full‑stack avec un **front React (Vite)** et un **backend Node.js/Express**.
Le backend expose un catalogue produits via **MongoDB** et l’authentification via **MySQL**.

## Fonctionnalités

- **Catalogue local** (données statiques) et **catalogue API** (MongoDB).
- **Recherche** de produits dans le catalogue API.
- **Panier** avec gestion des quantités.
- **Inscription / Connexion** (MySQL) avec validations de sécurité.
- **Profil utilisateur** avec informations et déconnexion.

## Prérequis

- Node.js 18+
- MongoDB (local ou distant)
- MySQL (local)

## Installation

### 1) Backend

```bash
cd backend
npm install
```

Créer un fichier `.env` dans `backend/` (optionnel) :

```bash
MONGO_URI=mongodb://localhost:27017/instadb2
PORT=5000
```

> Si vous ne définissez pas `MONGO_URI`, la valeur par défaut est `mongodb://localhost:27017/instadb2`.

#### Base MySQL

Le backend utilise MySQL via `backend/src/config/mysql.js` (par défaut : `root` / mot de passe vide / base `ecommerce`).

Créez la base et la table `users` si nécessaire (exemple minimal) :

```sql
CREATE DATABASE IF NOT EXISTS ecommerce;
USE ecommerce;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(255) NOT NULL,
  prenom VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  telephone VARCHAR(20) NOT NULL,
  password_hash VARCHAR(255) NOT NULL
);
```

Si votre configuration MySQL est différente, ajustez `backend/src/config/mysql.js`.

### 2) Frontend

```bash
cd frontend
npm install
```

## Lancement

### Backend (API)

```bash
cd backend
npm run dev
```

L’API démarre par défaut sur **http://localhost:5000**.

### Frontend (Vite)

```bash
cd frontend
npm run dev
```

Le front est disponible sur **http://localhost:5173**.

## Endpoints principaux (backend)

- `GET /api/produits` : liste des produits (MongoDB).
- `POST /api/auth/register` : inscription utilisateur (MySQL).
- `POST /api/auth/login` : connexion utilisateur (MySQL).

## Structure rapide

- `backend/` : API Express, MongoDB, MySQL
- `frontend/` : React + Vite

---

