const express = require('express');
const ytdl = require('ytdl-core');
const app = express();

// Endpoint para baixar vídeo do YouTube
app.get('/baixar-video', async (req, res) => {
    const { url } = req.query;

    try {
        if (!url || !ytdl.validateURL(url)) {
            throw new Error('URL inválida do YouTube');
        }

        const info = await ytdl.getInfo(url);
        const title = info.videoDetails.title;
        const format = ytdl.chooseFormat(info.formats, { quality: 'highestvideo' });

        res.header('Content-Disposition', `attachment; filename="${title}.mp4"`);
        ytdl(url, { format: format })
            .on('error', (err) => {
                console.error('Erro ao baixar vídeo:', err);
                res.status(500).send('Erro ao baixar o vídeo. Por favor, tente novamente mais tarde.');
            })
            .pipe(res);

    } catch (error) {
        console.error('Erro ao baixar vídeo do YouTube:', error);
        res.status(400).send('Erro ao baixar o vídeo. Verifique a URL e tente novamente.');
    }
});

// Iniciar o servidor na porta 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
