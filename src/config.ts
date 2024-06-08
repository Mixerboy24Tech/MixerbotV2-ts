import dotenv from "dotenv";

dotenv.config();

const { DISCORD_TOKEN, DISCORD_CLIENT_ID, palvelinID, host, port, tunnus, password} = process.env;

if (!DISCORD_TOKEN || !DISCORD_CLIENT_ID || !palvelinID || !host || !port || !tunnus || !password) {
  throw new Error("Puuttuu tietoja! Tarkista .env tiedosto.");
}

export const config = {
  DISCORD_TOKEN,
  DISCORD_CLIENT_ID,
  palvelinID,
  host,
  port,
  tunnus,
  password,
};