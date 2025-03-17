require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

app.post("/get-token", async (req, res) => {
  const { code } = req.body;
  
  try {
    const response = await axios.post("https://api.genius.com/oauth/token", {
      code: code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      grant_type: "authorization_code",
      response_type: "code"
    });

    res.json(response.data);
  } catch (error) {
    res.status(400).json({ error: error.response.data });
  }
});

app.listen(5000, () => console.log("Backend rodando na porta 5000"));
