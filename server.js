const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

const TRACKER_API_KEY = '49cd803b-0712-4357-8be0-2bd757c79719'; // Tu clave API de Tracker.gg

app.get('/valorant-rank', async (req, res) => {
    // Obtener el nombre de usuario desde los parámetros de la URL
    const { username } = req.query;

    if (!username) {
        res.send('Por favor proporciona un nombre de usuario en el formato nombre#etiqueta.');
        return;
    }

    const encodedUsername = encodeURIComponent(username); // Codificar correctamente el nombre
    const apiUrl = `https://api.tracker.gg/api/v2/valorant/standard/profile/riot/${encodedUsername}`;

    try {
        const response = await fetch(apiUrl, {
            headers: {
                'TRN-Api-Key': TRACKER_API_KEY,
            },
        });

        const data = await response.json();

        if (data.errors) {
            res.send(`No se pudo obtener el rango para el jugador ${username}. Verifica el nombre y etiqueta.`);
            return;
        }

        const rank = data.data.segments[0].stats.rank.metadata.tierName;
        res.send(`El rango actual de ${username} es: ${rank}`);
    } catch (error) {
        console.error('Error:', error);
        res.send('Hubo un error al consultar el rango. Inténtalo más tarde.');
    }
});

app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
