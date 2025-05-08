// server.js

const express = require('express');
const axios = require('axios');
const app = express();

// Middleware para interpretar JSON
app.use(express.json());

// Webhook do seu canal do Discord
const DISCORD_WEBHOOK_URL = 'https://discordapp.com/api/webhooks/1369870960512995338/Oy9u5WisCR8hIy-SJk5-zNV4yp4liWXKL63M6ByY9VmlPKSgD5YpvjO689DFcTFrZdW8';

// Endpoint de teste
app.get('/', (req, res) => {
    res.send('Servidor está online e aguardando eventos do HacknPlan!');
});

// Endpoint que o HacknPlan chama via Webhook
app.post('/hacknplan-webhook', async (req, res) => {
    const body = req.body;

    console.log("Evento recebido do HacknPlan:", body);

    // Pega título da tarefa
    const titulo = body.Title || "Tarefa sem título";
    const status = body.Stage?.Status || "sem status";
    const importancia = body.ImportanceLevel?.Name || "sem importância";

    // Formata mensagem
    let mensagem = `📌 **Nova atualização no HacknPlan!**\n`;
    mensagem += `📝 **Título**: ${titulo}\n`;
    mensagem += `⚙️ **Status**: ${status}\n`;
    mensagem += `⭐ **Importância**: ${importancia}`;

    // Envia para Discord
    try {
        await axios.post(DISCORD_WEBHOOK_URL, {
            content: mensagem
        });
    } catch (error) {
        console.error("Erro ao enviar para Discord:", error.message);
    }

    res.sendStatus(200);
});


// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor ouvindo na porta ${PORT}`);
});
