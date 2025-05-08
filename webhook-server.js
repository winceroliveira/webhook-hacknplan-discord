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

    console.log("📩 Evento recebido do HacknPlan:", body);

    // Criação da mensagem para o Discord
    let mensagem = `📌 **Evento HacknPlan** recebido!`;

    if (body.Title) {
        mensagem += `\n📝 **Tarefa**: ${body.Title}`;
    }

    if (body.Category && body.Category.Name) {
        mensagem += `\n📁 **Categoria**: ${body.Category.Name}`;
    }

    if (body.ProjectId) {
        mensagem += `\n🆔 **ID do Projeto**: ${body.ProjectId}`;
    }

    if (body.WorkItemId) {
        mensagem += `\n🔢 **ID da Tarefa**: ${body.WorkItemId}`;
    }

    // Envia a mensagem para o Discord
    try {
        await axios.post(DISCORD_WEBHOOK_URL, {
            content: mensagem
        });
        console.log("✅ Mensagem enviada ao Discord com sucesso.");
    } catch (error) {
        console.error("❌ Erro ao enviar para o Discord:", error.message);
    }

    // Sempre responder 200 para o HacknPlan não desativar o webhook
    res.sendStatus(200);
});

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor ouvindo na porta ${PORT}`);
});
