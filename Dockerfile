FROM node:latest

# Luo hakemisto botille
RUN mkdir -p /usr/src/mixerbot
WORKDIR /usr/src/mixerbot

# Kopioi package.json ja package-lock.json (jos on) ja asenna riippuvuudet
COPY package*.json ./
RUN npm install

# Kopioi loput tiedostot
COPY . .

# Käännä TypeScript-koodi JavaScriptiksi
RUN npm run build

# Käynnistä botti
CMD ["npm", "start"]
