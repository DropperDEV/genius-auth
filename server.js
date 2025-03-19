require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());

const allowedOrigins = [
    "https://dropperdev.github.io",
    "https://dropperdev.github.io/reactSongs",
    "http://localhost:5173",
    "http://localhost:5173/reactSongs",
];
app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
    })
); app.use(cookieParser());

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

app.get('/login', async (req, res) => {
    const authUrl = `https://api.genius.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=me&state=xyz&response_type=code`;
    res.redirect(authUrl);
});

app.get('/callback', async (req, res) => {
    const { code } = req.query;
    if (!code) {
        return res.status(400).send('Código de autorização não fornecido');
    }

    try {
        const response = await axios.post('https://api.genius.com/oauth/token', {
            code,
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            redirect_uri: REDIRECT_URI,
            response_type: 'code',
            grant_type: 'authorization_code'
        });

        const accessToken = response.data.access_token;

        res.cookie('accessToken', accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 });
        res.redirect("http://localhost:5173/reactSongs")
    } catch (error) {
        console.error("Erro ao obter token de acesso:", error);
        res.status(500).send('Erro ao obter token de acesso');
    }
});


app.get('/search', async (req, res) => {
    const { q } = req.query;
    const accessToken = req.cookies.accessToken;

    if (!q) {
        return res.status(400).send('Parâmetro de pesquisa não fornecido');
    }

    if (!accessToken) {
        return res.status(401).send('Token de acesso não disponível. Faça login primeiro.');
    }

    try {
        const response = await axios.get(`https://api.genius.com/search?q=${encodeURIComponent(q)}`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).send('Erro ao buscar músicas');
    }
});


app.get('/logout', (req, res) => {
    res.clearCookie('accessToken');
    res.send('Logout bem-sucedido!');
});

app.get('/check-auth', (req, res) => {
    const accessToken = req.cookies.accessToken;
    if (accessToken) {
        res.json({ isAuthenticated: true });
    } else {
        res.json({ isAuthenticated: false });
    }
});


app.get("/account-info", async (req, res) => {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
        return res.status(401).send('Token de acesso não disponível. Faça login primeiro.');
    }

    try {
        const response = await axios.get(`https://api.genius.com/account`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).send('Erro ao buscar dados da conta');
    }
})



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
