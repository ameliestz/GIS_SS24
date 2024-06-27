// Event-Listener, der wartet, bis das HTML fertig geladen ist
document.addEventListener('DOMContentLoaded', (event) => {

// Plus-Button
      let button = document.getElementById("addButton2");
      button.addEventListener('click', openpopup);

      function openpopup(event) {
        document.getElementById("popup").style.visibility = "visible";
      }

// Schließen-Button
      let buttonschließen = document.getElementById("closePopup");
      buttonschließen.addEventListener('click', closepopup);

      function closepopup(event) {
        document.getElementById("popup").style.visibility = "hidden";
      }

// Laden der gespeicherten Bücher nur für das aktuelle Genre
 // Funktion zum Abrufen des Genres aus der URL
function getGenreFromURL() {
  let urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('genre');
}

let genre = getGenreFromURL();

if (genre) {

// Daten vom Server abrufen
  fetch('http://127.0.0.1:3004/buecher')
    .then(response => {
      if (!response.ok) {
        throw new Error('Netzwerkantwort war nicht ok');
      }
      return response.json();
    })
    .then(data => {
      // Bücher filtern und anzeigen
      data.forEach(buch => {
        if (buch && buch.genre === genre) {
          let unterseite = document.getElementById("unterseite");
          if (unterseite) {
            let link = document.createElement("a");
            link.href = "seite3.html?id=" + buch.id;
            link.title = buch.title;
            link.textContent = buch.title;
            unterseite.appendChild(link);
          } else {
            console.error('Das unterseite-Element wurde nicht gefunden.');
          }
        }
      });
    })
    .catch(error => {
      console.error('Es gab ein Problem mit der Fetch-Operation:', error);
    });
} else {
  console.error('Das Genre konnte nicht erkannt werden.');
}


// Speichern-Button
        let speichern = document.getElementById("safe");
        speichern.addEventListener('click', safe);

        function safe(event) {
          event.preventDefault();  // Verhindert das Standard-Submit-Verhalten
          let title = document.getElementById("titel").value;
          let autor = document.getElementById("autor").value;
          let bildUrl = document.getElementById("imageUrl").value;
          let genre = getGenreFromURL();

// Text verschwindet nach dem Speichern
        document.getElementById("autor").value = '';
        document.getElementById("titel").value = '';
        document.getElementById("imageUrl").value = '';

// Benutzerdefinierte ID erstellen
        let id = new Date().valueOf();
        let buch = { title: title, autor: autor, bildUrl: bildUrl, genre: genre };

// Daten im localStorage speichern
      localStorage.setItem(id, JSON.stringify(buch));

// Füge den neuen Link hinzu, nur wenn das Genre übereinstimmt
        if (genre === getGenreFromURL()) {
          let unterseite = document.getElementById("unterseite");
          if (unterseite) {
            let link = document.createElement("a");
            link.href = "seite3.html?id=" + id;
            link.title = title;
            link.textContent = title;
            unterseite.appendChild(link);
          } else {
            console.error('Das unterseite-Element wurde nicht gefunden.');
          }
        }

// Daten an den Server senden
      fetch('http://127.0.0.1:3004/saveBook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(buch)
      }).then(response => response.json())
        .then(data => {
          console.log('Success:', data); // Erfolgsnachricht
        })
        .catch((error) => {
          console.error('Error:', error); // Fehlermeldung
        });
    }


// Funktion zum Extrahieren des Genres aus der URL
      function getGenreFromURL() {
        let url = window.location.href;
        if (url.includes('Romantik')) {
          return 'Romantik';
        } else if (url.includes('Komedie')) {
          return 'Komedie';
        } else if (url.includes('Horror')) {
          return 'Horror';
        } else if (url.includes('Fantasy')) {
          return 'Fantasy';
        } else {
          return null;
        }
      }
    });
