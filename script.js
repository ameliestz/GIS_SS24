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
  let genre = getGenreFromURL();
  if (genre) {
    for (let i = 0; i < localStorage.length; i++) {
      let id = localStorage.key(i);
      let buchstring = localStorage.getItem(id);
      let buch = JSON.parse(buchstring);

      if (buch && buch.genre === genre) { // Überprüfe, ob das Buch im richtigen Genre ist
        console.log('Geladenes Buch:', buch);

        let unterseite = document.getElementById("unterseite");
        if (unterseite) {
          let link = document.createElement("a");
          link.href = "seite3.html?id=" + id;
          link.title = buch.title;
          link.textContent = buch.title;
          unterseite.appendChild(link);
        } else {
          console.error('Das unterseite-Element wurde nicht gefunden.');
        }
      }
    }
  } else {
    console.error('Das Genre konnte nicht erkannt werden.');
  }

  // Speichern-Button
  let speichern = document.getElementById("safe");
  if (speichern) {
    speichern.addEventListener('click', safe);
  } else {
    console.error('Der Speichern-Button wurde nicht gefunden.');
  }

  function safe(event) {
    event.preventDefault();  // Verhindert das Standard-Submit-Verhalten
    let title = document.getElementById("titel").value;
    let autor = document.getElementById("autor").value;
    let bildUrl = document.getElementById("imageUrl").value;
    let genre = getGenreFromURL();

    // Überprüfen, ob alle Felder ausgefüllt sind
    if (title === '' || autor === '' || bildUrl === '' || !genre) {
      console.log('Bitte fülle alle Felder aus und stelle sicher, dass das Genre erkannt wird.');
      return;
    }

    console.log('Titel:', title);
    console.log('Autor:', autor);
    console.log('Bild-URL:', bildUrl);
    console.log('Genre:', genre);

    document.getElementById("autor").value = '';  // Text verschwindet nach speichern
    document.getElementById("titel").value = '';  // Text verschwindet nach speichern
    document.getElementById("imageUrl").value = '';

    let id = new Date().valueOf(); // Benutzerdefinierte ID erstellen
    let buch = { title: title, autor: autor, bildUrl: bildUrl, genre: genre };
    localStorage.setItem(id, JSON.stringify(buch));

    console.log('Buch gespeichert:', buch);

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