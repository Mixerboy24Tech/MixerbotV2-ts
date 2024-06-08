### Miksaaja City Discord-Botti

Botti on ainoastaan automaatio kaveri. Botti käsittelee uudet jäsenet ja niiden roolituksen, Miksaaja City pelipalvelimien Whitelistit ym.   

Botti on tehty Docker ystävälliseksi jotta se on helppo suorittaa missä tahansa. 
Docker image rakentuu Noden ympärille. 

Repo tarvii ```.env``` tiedoston.
Alla pohja:
```env
DISCORD_TOKEN= TOKEN
DISCORD_CLIENT_ID= BOTIN ID
palvelinID= Palvelimen ID
host= SFTP Osoite
port= SFTP Portti
tunnus= SFTP Käyttäjä
password= SFTP Salasana
```
