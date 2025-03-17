require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());

//Configurando CORS para aceitar o frontend no GitHub Pages
const FRONTEND_URL = "https://dropperdev.github.io/reactSongs"; 
app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(cookieParser());

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

app.post("/get-token", async (req, res) => {
  const { code } = req.body;

  try {
    const response = await axios.post("https://api.genius.com/oauth/token", {
      code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      response_type: "code",
      grant_type: "authorization_code",
    });

    const { access_token } = response.data;

    // Armazena o token em um cookie 
    res.cookie("access_token", access_token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 3600000,
    });

    res.json({ message: "Token armazenado com sucesso" });
  } catch (error) {
    console.error("Erro ao obter o token:", error);
    res.status(500).json({ error: "Erro ao obter o token" });
  }
});

app.get("/logout", (req, res) => {
  res.clearCookie("access_token", { sameSite: "None", secure: true });
  res.json({ message: "Logout realizado com sucesso" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
