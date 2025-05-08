const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// Substitua com o webhook do seu canal do Discord:
const DISCORD_WEBHOOK_URL = 'https://discordapp.com/api/webhooks/1369870960512995338/Oy9u5WisCR8hIy-SJk5-zNV4yp4liWXKL63M6ByY9VmlPKSgD5YpvjO689DFcTFrZdW8';

// Endpoint que o HacknPlan vai chamar
app.post('/hacknplan-webhook', async (req, res) => {
    const body = req.body;

    // Exemplo de log no terminal
    console.log("Evento recebido do HacknPlan:", body);

    // Monta uma mensagem simples
    let mensagem = `📌 **Evento HacknPlan**: ${body.eventType || 'Desconhecido'}`;

    if (body.task) {
        mensagem += `\n📝 Tarefa: ${body.task.title}`;
        mensagem += `\n📁 Área: ${body.task.boardColumnName}`;
    }

    // Envia para o Discord
    try {
        await axios.post(DISCORD_WEBHOOK_URL, {
            content: mensagem
        });
    } catch (error) {
        console.error("Erro ao enviar para Discord:", error.message);
    }

    // Responde ao HacknPlan que está tudo certo
    res.sendStatus(200);
});

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor ouvindo na porta ${PORT}`);
});
