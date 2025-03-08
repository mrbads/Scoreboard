import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: process.env.WS_PORT || 8080 });

wss.on('connection', (ws) => {
    ws.on('message', async (message) => {
        const { type, data } = JSON.parse(message.toString());

        if (type === 'updateScoreboard') {
            const { teamAScore, teamBScore } = data;

            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ type: 'scoreboardUpdated', data: { teamAScore, teamBScore } }))
                }
            });
        } else if (type === 'timerControl') {
            const { action } = data;

            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ type: 'timerControl', data: { action } }))
                }
            });
        } else if (type === 'wedstrijdcode') {
            const { wedstrijdcode } = data;

            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ type: 'wedstrijdcodeUpdated', data: { wedstrijdcode } }))
                }
            });
        }
    });
});

export default wss;