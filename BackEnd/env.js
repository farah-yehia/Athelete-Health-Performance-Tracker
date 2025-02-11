const Front_Port = 8000;
const Back_Port = 9000;
const Front_Origin = `http://localhost:${Front_Port}`;
const Back_Origin = `http://localhost:${Back_Port}`;
const ADMIN_SECRET_VALUE =
  "20a0e231acfeef3145df8456ffe599790259d06ff6b23d22f25b79e561e7cfe0";
const Secret_Key =
  "262e8b2afe853e0186dc83ac26b18a7f944afd5a98b7dc7c611952099a618e4f";
API_KEY = `${"EwgGvNmbBiStrHLOV8zIsYwiGknwNRdVZ6yrbodyfQtVF9B0JjHjFbLQk5EB"}&include=lineups.player;lineups.player.country`;
module.exports = {
  Front_Port,
  Back_Port,
  Front_Origin,
  Back_Origin,
  ADMIN_SECRET_VALUE,
  Secret_Key,
  API_KEY,
};
