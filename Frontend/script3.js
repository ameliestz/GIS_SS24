// Enthält spezifische Funktionen und Event-Listener für die Detailseite des Buchs.
// Funktionalität wie Anzeigen der Buchdetails, Ändern des Dokumenttitels, Einfügen von Autor und Bild, Lösch-Button, Sterne-Ranking, und Notizen

const params = new URLSearchParams(window.location.search);
const id = params.get('id');
console.log(id);
let buchstring = localStorage.getItem(id);
let buch = JSON.parse(buchstring);
console.log(buch.title);

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
loeschenButton.addEventListener('click', function() {
  localStorage.removeItem(id);
  sendDeleteRequestToServer(id); // Daten an den Server senden
  window.history.back();
});

function sendDeleteRequestToServer(bookId) {
  let xhr = new XMLHttpRequest();
  xhr.open("DELETE", "http://127.0.0.1:3000/deleteBook?id=" + bookId, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      console.log("Book deleted from server");
    } else if (xhr.readyState === 4) {
      console.error("Failed to delete book from server");
    }
  };
  xhr.send();
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

function sendUpdateRequestToServer(book) {
  let xhr = new XMLHttpRequest();
  xhr.open("PUT", "http://127.0.0.1:3000/updateBook", true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      console.log("Book updated on server");
    } else if (xhr.readyState === 4) {
      console.error("Failed to update book on server");
    }
  };
  xhr.send(JSON.stringify(book));
}
