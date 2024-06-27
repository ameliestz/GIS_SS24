/// Enthält spezifische Funktionen und Event-Listener für die Detailseite des Buchs.
// Funktionalität wie Anzeigen der Buchdetails, Ändern des Dokumenttitels, Einfügen von Autor und Bild, Lösch-Button, Sterne-Ranking, und Notizen

  document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    console.log(id);
    let buchstring = localStorage.getItem(id);
    let buch = JSON.parse(buchstring);
  console.log(buch.title);


fetch('http://127.0.0.1:3007/', {
method: 'GET'
}
 )

 
  let buchtitelseite3 = document.getElementById("buchtitelseite3");
  buchtitelseite3.textContent = buch.title;

// Dokumenttitel = Buchtitel
      document.title = buch.title;

// Autor einfügen
      let autorElement = document.getElementById("autor");
      autorElement.textContent = "Autor: " + buch.autor;

// Bild erstellen und in HTML einfügen
      let bildContainer = document.getElementById("bildContainer");
      let bildElement = document.createElement("img");
      bildElement.src = buch.bildUrl; // Bild-URL setzen
      bildElement.alt = "Buch-Cover";
      bildContainer.appendChild(bildElement);

// Lösch-Button aktivieren
      let loeschenButton = document.getElementById("elementToBeDeleted");
      loeschenButton.addEventListener('click', async function() {
        localStorage.removeItem(id);
        await sendDeleteRequestToServer(id); // Daten an den Server senden
        window.history.back();
      });

      async function sendDeleteRequestToServer(bookId) {
        try {
          const response = await fetch(`http://127.0.0.1:3007/deleteBook?id=${bookId}`, {
            method: 'DELETE'
          });
          if (!response.ok) {
            throw new Error('Fehler beim Löschen des Buches');
          }
          console.log("Buch erfolgreich vom Server gelöscht");
        } catch (error) {
          console.error("Fehler:", error.message);
        }
      }

// Sterne-Ranking 
      const stars = document.getElementsByName("rating");
      stars.forEach(star => {
        if (star.value == buch.rating) {
          star.checked = true;
        }
      });

      function saveRating() {
        const selectedRating = document.querySelector('input[name="rating"]:checked').value;
        buch.rating = selectedRating;
        localStorage.setItem(id, JSON.stringify(buch));
        sendUpdateRequestToServer(buch);
      }

      const starInputs = document.querySelectorAll('input[name="rating"]');
      starInputs.forEach(star => {
        star.addEventListener('change', saveRating);
      });

// Notizen 
        let notizenElement = document.getElementById("Notizen");
        notizenElement.value = buch.notizen || '';

        function saveNotizen() {
          buch.notizen = notizenElement.value;
          localStorage.setItem(id, JSON.stringify(buch));
          sendUpdateRequestToServer(buch);
        }

        notizenElement.addEventListener('input', saveNotizen);

        async function sendUpdateRequestToServer(book) {
          try {
            const response = await fetch('http://127.0.0.1:3007/updateBook', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(book)
            });
            if (!response.ok) {
              throw new Error('Fehler beim Aktualisieren des Buches');
            }
            console.log("Buch erfolgreich auf dem Server aktualisiert");
          } catch (error) {
            console.error("Fehler:", error.message);
          }
        }
      });