const sqlite3 = require('sqlite3').verbose();
const { Server: WebSocketServer } = require('ws');

const wss = new WebSocketServer({ port: 8090 });

const db = new sqlite3.Database('esp.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the esp database.');
});

wss.on('connection', (ws) => {
    console.log('Nouvelle connexion ws établie.');

    db.all(`SELECT name, time, 'total' AS table_name FROM total
            UNION 
            SELECT name, time, 'galana' AS table_name FROM galana`, [], (err, rows) => {
        if (err) {
            throw err;
        }
        rows.forEach((row) => {
            ws.send(`${row.table_name}:${row.name}:${row.time}`);
        });
    });

    ws.on('message', (message) => {
        let mess = message.toString();
        if (mess.includes(':')) {
            let parts = mess.split(':');
            if (parts.length === 3) {
                let part1 = parts[0];
                let part2 = parts[1];
                let part3 = parts[2];
    
                db.run(`UPDATE ${part1} SET time = '${part3}' WHERE name = '${part2}'`, [], function(err) {
                    if (err) {
                      return console.error(err.message);
                    }
                  });
            }
        }
        wss.clients.forEach((client) => {
            if (client !== ws) {
                client.send(message);
            }
        });
    });    


    ws.on('close', () => {
        console.log('Connexion WebSocket fermée.');
    });
});

console.log('Serveur WebSocket démarré sur le port 8090...');
