FROM node:16

# Défini le répertoire de travail (comme un cd ...) pour les prochaines instructions
WORKDIR /usr/src/app

# Copie les fichiers commençant par "package" et ayant l'extension ".json" du répertoire courant,
# dans le répertoire courant du container
COPY package*.json ./

# Installe les packages node
RUN npm install

# Copie le répertoire courant sur le répertoire courant du container
COPY . .

CMD [ "node", "index.js" ]
