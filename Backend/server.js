const http = require('http'); // Importiere das HTTP-Modul, um einen Server zu erstellen
const sqlite3 = require('sqlite3').verbose(); // Importiere das SQLite3-Modul, um mit einer SQLite-Datenbank zu arbeiten

const hostname = '127.0.0.1'; // Der Hostname für den Server (localhost)
const port = 3001; // Der Port, auf dem der Server läuft

// Öffne die SQLite-Datenbank oder erstelle sie, wenn sie nicht existiert
    const db = new sqlite3.Database('./myDatabase.db', (err) => {
      if (err) {
        console.error('Error opening database:', err.message); // Fehler beim Öffnen der Datenbank
      } else {
        console.log('Connected to the database.'); // Erfolgreiche Verbindung zur Datenbank


// Erstelle die Tabelle "books", wenn sie nicht existiert
        db.run(`CREATE TABLE IF NOT EXISTS books (
          id INTEGER PRIMARY KEY,
          title TEXT NOT NULL,
          autor TEXT NOT NULL,
          bildUrl TEXT NOT NULL,
          genre TEXT NOT NULL,
          rating TEXT,
          notizen TEXT
        )`, (err) => {
          if (err) {
            console.error('Error creating table:', err.message); // Fehler beim Erstellen der Tabelle
          } else {
            console.log('Table "books" is ready.'); // Tabelle erfolgreich erstellt
          }
        });
      }
    });

// Erstelle einen HTTP-Server
      const server = http.createServer((request, response) => {
// Setze die Header für die Antwort, um CORS zu ermöglichen
      response.setHeader('Access-Control-Allow-Origin', '*');
      response.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT, DELETE');
      response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

// Behandle OPTIONS-Anfragen (Preflight-Requests)
    if (request.method === 'OPTIONS') {
      response.writeHead(200);
      response.end();
      return;
    }

  // Analysiere die URL der Anfrage
  const url = new URL(request.url || '', `http://${request.headers.host}`);

// Behandle die verschiedenen Endpunkte
      switch (url.pathname) {
        case '/':
          response.statusCode = 200;
          response.setHeader('Content-Type', 'text/plain');
          response.write('Hello World'); // Antwort für den Root-Endpunkt
          response.end();
          break;
        case '/saveBook':
          if (request.method === 'POST') {
            let body = '';
            // Sammle die Daten vom Request
            request.on('data', chunk => {
              body += chunk.toString();
            });
        
// Verarbeite die Daten, sobald sie vollständig empfangen wurden
        request.on('end', () => {
          const book = JSON.parse(body);
          const { title, autor, bildUrl, genre, rating, notizen } = book;
// Füge das Buch in die Datenbank ein
          db.run(`INSERT INTO books (title, autor, bildUrl, genre, rating, notizen) VALUES (?, ?, ?, ?, ?, ?)`,
            [title, autor, bildUrl, genre, rating, notizen], function (err) {
              if (err) {
                console.error('Error saving book:', err.message); // Fehler beim Speichern des Buches
                response.statusCode = 500;
                response.setHeader('Content-Type', 'application/json');
                response.write(JSON.stringify({ error: 'Failed to save book' }));
              } else {
                response.statusCode = 200;
                response.setHeader('Content-Type', 'application/json');
                response.write(JSON.stringify({ message: 'Book saved successfully', id: this.lastID }));
              }
              response.end();
            });
        });
      } else {
        response.statusCode = 405;
        response.setHeader('Content-Type', 'application/json');
        response.write(JSON.stringify({ error: 'Method not allowed' }));
        response.end();
      }
      break;
    case '/updateBook':
      if (request.method === 'PUT') {
        let body = '';
// Sammle die Daten vom Request
        request.on('data', chunk => {
          body += chunk.toString();
        });
// Verarbeite die Daten, sobald sie vollständig empfangen wurden
        request.on('end', () => {
          const book = JSON.parse(body);
          const { id, title, autor, bildUrl, genre, rating, notizen } = book;
// Aktualisiere das Buch in der Datenbank
          db.run(`UPDATE books SET title = ?, autor = ?, bildUrl = ?, genre = ?, rating = ?, notizen = ? WHERE id = ?`,
            [title, autor, bildUrl, genre, rating, notizen, id], function (err) {
              if (err) {
                console.error('Error updating book:', err.message); // Fehler beim Aktualisieren des Buches
                response.statusCode = 500;
                response.setHeader('Content-Type', 'application/json');
                response.write(JSON.stringify({ error: 'Failed to update book' }));
              } else {
                response.statusCode = 200;
                response.setHeader('Content-Type', 'application/json');
                response.write(JSON.stringify({ message: 'Book updated successfully' }));
              }
              response.end();
            });
        });
      } else {
        response.statusCode = 405;
        response.setHeader('Content-Type', 'application/json');
        response.write(JSON.stringify({ error: 'Method not allowed' }));
        response.end();
      }
      break;
    case '/deleteBook':
      if (request.method === 'DELETE') {
        const id = url.searchParams.get('id');
// Lösche das Buch aus der Datenbank
        db.run(`DELETE FROM books WHERE id = ?`, [id], function (err) {
          if (err) {
            console.error('Error deleting book:', err.message); // Fehler beim Löschen des Buches
            response.statusCode = 500;
            response.setHeader('Content-Type', 'application/json');
            response.write(JSON.stringify({ error: 'Failed to delete book' }));
          } else {
            response.statusCode = 200;
            response.setHeader('Content-Type', 'application/json');
            response.write(JSON.stringify({ message: 'Book deleted successfully' }));
          }
          response.end();
        });
      } else {
        response.statusCode = 405;
        response.setHeader('Content-Type', 'application/json');
        response.write(JSON.stringify({ error: 'Method not allowed' }));
        response.end();
      }
      break;
    case '/search':
      response.statusCode = 200;
      response.setHeader('Content-Type', 'text/plain');
      response.write('Hier ist was du suchst: ' + url.searchParams.get('item')); // Antwort für den Suche-Endpunkt
      response.end();
      break;
    default:
      response.statusCode = 404;
      response.setHeader('Content-Type', 'text/plain');
      response.write('Not Found'); // Antwort für unbekannte Endpunkte
      response.end();
  }
});

// Starte den Server
      server.listen(port, hostname, () => {
        console.log(`Server running at http://${hostname}:${port}/`); // Log-Meldung, wenn der Server läuft
      });
