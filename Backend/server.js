const http = require('http'); // HTTP-Modul für Server
const sqlite3 = require('sqlite3').verbose(); // SQLite-Datenbankmodul

const hostname = '127.0.0.1'; // Hostname des Servers
const port = 3004; // Portnummer, auf der der Server läuft

// Verbindung zur SQLite-Datenbank herstellen
      const db = new sqlite3.Database('./myDatabase.db', (err) => {
        if (err) {
          console.error('Fehler beim Öffnen der Datenbank:', err.message);
        } else {
          console.log('Verbindung zur Datenbank hergestellt.');
// Tabelle "books" erstellen, falls sie nicht existiert
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
              console.error('Fehler beim Erstellen der Tabelle:', err.message);
            } else {
              console.log('Tabelle "books" ist bereit.');
            }
          });
        }
      });

// Erstellen des HTTP-Servers
      const server = http.createServer(async (request, response) => {
// CORS-Header setzen, um Cross-Origin-Anfragen zu ermöglichen
      response.setHeader('Access-Control-Allow-Origin', '*');
      response.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT, DELETE');
      response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

// Behandlung von OPTIONS-Anfragen für Preflight-Requests
        if (request.method === 'OPTIONS') {
          response.writeHead(200);
          response.end();
          return;
        }

// URL analysieren
        const url = new URL(request.url || '', `http://${request.headers.host}`);

// Routenverarbeitung basierend auf der URL
      switch (url.pathname) {
        case '/':
// GET-Anfrage auf der Wurzelroute
          response.statusCode = 200;
          response.setHeader('Content-Type', 'text/plain');
          response.write('BIB nicht da');
          response.end();
          break;
        case '/saveBook':
// POST-Anfrage zum Speichern eines Buchs
          if (request.method === 'POST') {
            let body = '';
            request.on('data', chunk => {
              body += chunk.toString();
            });
            request.on('end', () => {
              const book = JSON.parse(body);
              const { title, autor, bildUrl, genre, rating, notizen } = book;
// INSERT-Statement in die Datenbank ausführen
          db.run(`INSERT INTO books (title, autor, bildUrl, genre, rating, notizen) VALUES (?, ?, ?, ?, ?, ?)`,
            [title, autor, bildUrl, genre, rating, notizen], function (err) {
              if (err) {
                console.error('Fehler beim Speichern des Buches:', err.message);
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
// Fehler bei ungültiger HTTP-Methode
        response.statusCode = 405;
            response.setHeader('Content-Type', 'application/json');
            response.write(JSON.stringify({ error: 'Method not allowed' }));
            response.end();
          }
          break;
        case '/updateBook':
// PUT-Anfrage zum Aktualisieren eines Buchs
          if (request.method === 'PUT') {
            let body = '';
            request.on('data', chunk => {
              body += chunk.toString();
            });
            request.on('end', () => {
              const book = JSON.parse(body);
              const { id, title, autor, bildUrl, genre, rating, notizen } = book;
// UPDATE-Statement in der Datenbank ausführen
          db.run(`UPDATE books SET title = ?, autor = ?, bildUrl = ?, genre = ?, rating = ?, notizen = ? WHERE id = ?`,
            [title, autor, bildUrl, genre, rating, notizen, id], function (err) {
              if (err) {
                console.error('Fehler beim Aktualisieren des Buches:', err.message);
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
// Fehler bei ungültiger HTTP-Methode
              response.statusCode = 405;
              response.setHeader('Content-Type', 'application/json');
              response.write(JSON.stringify({ error: 'Method not allowed' }));
              response.end();
            }
            break;
          case '/deleteBook':
// DELETE-Anfrage zum Löschen eines Buchs
            if (request.method === 'DELETE') {
              const id = url.searchParams.get('id');
// DELETE-Statement in der Datenbank ausführen
            db.run(`DELETE FROM books WHERE id = ?`, [id], function (err) {
              if (err) {
                console.error('Fehler beim Löschen des Buches:', err.message);
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
// Fehler bei ungültiger HTTP-Methode
              response.statusCode = 405;
              response.setHeader('Content-Type', 'application/json');
              response.write(JSON.stringify({ error: 'Method not allowed' }));
              response.end();
            }
            break;
          case '/getBooks':
// GET-Anfrage zum Abrufen aller Bücher
          if (request.method === 'GET') {
            try {
              const books = await getAllBooksFromDB(); // Alle Bücher aus der Datenbank abrufen
              response.statusCode = 200;
              response.setHeader('Content-Type', 'application/json');
              response.write(JSON.stringify(books));
            } catch (error) {
              console.error('Fehler beim Abrufen der Bücher:', error.message);
              response.statusCode = 500;
              response.setHeader('Content-Type', 'application/json');
              response.write(JSON.stringify({ error: 'Failed to retrieve books' }));
            }
            response.end();
          } else {
// Fehler bei ungültiger HTTP-Methode
            response.statusCode = 405;
            response.setHeader('Content-Type', 'application/json');
            response.write(JSON.stringify({ error: 'Method not allowed' }));
            response.end();
          }
          break;
        case '/search':
// GET-Anfrage für eine Suchaktion
          response.statusCode = 200;
          response.setHeader('Content-Type', 'text/plain');
          response.write('Hier ist was du suchst: ' + url.searchParams.get('item'));
          response.end();
          break;
        default:
// Route nicht gefunden
          response.statusCode = 404;
          response.setHeader('Content-Type', 'text/plain');
          response.write('Not Found');
          response.end();
      }
    });

// Funktion zum Abrufen aller Bücher aus der Datenbank
    function getAllBooksFromDB() {
      return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM books`, (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        });
      });
    }

//Select um Informationen aus dem Server zu holen    
if (request.method === 'SELECT') 

// Server starten und auf Verbindungen warten
    app.use(bodyParser.json());
    app.use(express.static(path.join(__dirname, '../Frontend')));
