# Guide d'installation

## 🖥️ Frontend

### Prérequis
- Node.js installé sur votre machine

### Installation et lancement
1. Naviguez vers le dossier frontend :
   ```bash
   cd chemin/vers/votre/dossier/frontend
   ```

2. Installez les dépendances (si ce n'est pas déjà fait) :
   ```bash
   npm install
   ```

3. Lancez l'application en mode développement :
   ```bash
   npm start
   ```

4. Ouvrez votre navigateur à l'adresse : [http://localhost:3000](http://localhost:3000)

> **Note :** La page se rechargera automatiquement lorsque vous modifiez le code. Les erreurs de linting s'afficheront dans la console.

---

## ⚙️ Backend

### Prérequis
- Python 3.7+ installé sur votre machine

### Installation et lancement

1. Naviguez vers le dossier backend :
   ```bash
   cd chemin/vers/votre/dossier/backend
   ```

2. Créez un environnement virtuel :
   ```bash
   python -m venv .venv
   ```

3. Activez l'environnement virtuel :
   
   **Windows :**
   ```bash
   .\.venv\Scripts\activate.bat
   ```
   
   **macOS/Linux :**
   ```bash
   source .venv/bin/activate
   ```

4. Installez les dépendances :
   ```bash
   pip install -r requirements.txt
   ```

5. Démarrez le serveur :
   ```bash
   uvicorn main:app --reload
   ```

> **Note :** Le serveur se rechargera automatiquement lorsque vous modifiez le code grâce à l'option `--reload`.

---

## 🚀 Ordre de démarrage recommandé

1. **Démarrez d'abord le backend** pour que l'API soit disponible
2. **Puis démarrez le frontend** pour accéder à l'interface utilisateur

## 📝 Commandes rapides

### Frontend
```bash
cd frontend && npm start
```

### Backend
```bash
cd backend && python -m venv .venv && .\.venv\Scripts\activate.bat && pip install -r requirements.txt && uvicorn main:app --reload
```
