const http = require('http');
const sqlite3 = require('sqlite3').verbose();

const hostname = '127.0.0.1';
const port = 3007;

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

const server = http.createServer(async (request, response) => {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT, DELETE');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (request.method === 'OPTIONS') {
    response.writeHead(200);
    response.end();
    return;
  }

  const url = new URL(request.url || '', `http://${request.headers.host}`);

  switch (url.pathname) {
    case '/':
      response.statusCode = 200;
      response.setHeader('Content-Type', 'text/plain');
      response.write('Hello World');
      response.end();
      break;
    case '/saveBook':
      if (request.method === 'POST') {
        let body = '';
        request.on('data', chunk => {
          body += chunk.toString();
        });
        request.on('end', () => {
          const book = JSON.parse(body);
          const { title, autor, bildUrl, genre, rating, notizen } = book;
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
        response.statusCode = 405;
        response.setHeader('Content-Type', 'application/json');
        response.write(JSON.stringify({ error: 'Method not allowed' }));
        response.end();
      }
      break;
    case '/updateBook':
      if (request.method === 'PUT') {
        let body = '';
        request.on('data', chunk => {
          body += chunk.toString();
        });
        request.on('end', () => {
          const book = JSON.parse(body);
          const { id, title, autor, bildUrl, genre, rating, notizen } = book;
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
        response.statusCode = 405;
        response.setHeader('Content-Type', 'application/json');
        response.write(JSON.stringify({ error: 'Method not allowed' }));
        response.end();
      }
      break;
    case '/deleteBook':
      if (request.method === 'DELETE') {
        const id = url.searchParams.get('id');
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
        response.statusCode = 405;
        response.setHeader('Content-Type', 'application/json');
        response.write(JSON.stringify({ error: 'Method not allowed' }));
        response.end();
      }
      break;
    case '/getBooks':
      if (request.method === 'GET') {
        try {
          const books = await getAllBooksFromDB();
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
        response.statusCode = 405;
        response.setHeader('Content-Type', 'application/json');
        response.write(JSON.stringify({ error: 'Method not allowed' }));
        response.end();
      }
      break;
    case '/search':
      response.statusCode = 200;
      response.setHeader('Content-Type', 'text/plain');
      response.write('Hier ist was du suchst: ' + url.searchParams.get('item'));
      response.end();
      break;
    default:
      response.statusCode = 404;
      response.setHeader('Content-Type', 'text/plain');
      response.write('Not Found');
      response.end();
  }
});

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

server.listen(port, hostname, () => {
  console.log(`Server läuft unter http://${hostname}:${port}/`);
});
