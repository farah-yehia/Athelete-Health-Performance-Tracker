const Front_Port = 8000;
const Back_Port = 9000;
const Front_Origin = `http://localhost:${Front_Port}`;
const Back_Origin = `http://localhost:${Back_Port}`;
const Secret_Key='262e8b2afe853e0186dc83ac26b18a7f944afd5a98b7dc7c611952099a618e4f';
API_KEY = `${"EwgGvNmbBiStrHLOV8zIsYwiGknwNRdVZ6yrbodyfQtVF9B0JjHjFbLQk5EB"}&include=lineups.player;lineups.player.country`;
module.exports = {
    Front_Port,
    Back_Port,
    Front_Origin,
    Back_Origin,
    Secret_Key,
    API_KEY}