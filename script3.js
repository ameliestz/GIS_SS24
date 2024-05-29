// Enthält spezifische Funktionen und Event-Listener für die Detailseite des Buchs.
// Funktionalität wie Anzeigen der Buchdetails, Ändern des Dokumenttitels, Einfügen von Autor und Bild, Lösch-Button, Sterne-Ranking, und Notizen

const params = new URLSearchParams(window.location.search);
const id = params.get('id');
console.log(id);
let buchstring= localStorage.getItem(id)	
let buch= JSON.parse(buchstring)	
console.log (buch.title)
let buchtitelseite3= document.getElementById("buchtitelseite3")
buchtitelseite3.textContent= buch.title


// Dokumenttitel= Buchtitel
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
        window.history.back();
        });

// Sterne-Ranking 
        // gespeicherte Sterne-Bewertung des Buches wird geladen und die entsprechenden Sterne werden im HTML-Formular markiert.
                const stars = document.getElementsByName("rating");
                stars.forEach(star => {
                if (star.value == buch.rating) {
                star.checked = true;
                }
                });

        // Funktion zum Speichern des Sterne-Rankings im Buchobjekt und aktualisiert den lokalen Speicher
                function saveRating() {
                const selectedRating = document.querySelector('input[name="rating"]:checked').value;
                buch.rating = selectedRating;
                localStorage.setItem(id, JSON.stringify(buch));
                }

        // Event-Listener für das Sterne-Ranking um  Bewertung zu speichern, wenn sie geändert wird
                const starInputs = document.querySelectorAll('input[name="rating"]');
                starInputs.forEach(star => {
                star.addEventListener('change', saveRating);
                });

// Notizen 
        let notizenElement = document.getElementById("Notizen");
        notizenElement.value = buch.notizen || '';

        // Funktion zum Speichern der Notizen
                function saveNotizen() {
                buch.notizen = notizenElement.value;
                localStorage.setItem(id, JSON.stringify(buch));
                }

        // Event-Listener für die Notizen
                notizenElement.addEventListener('input', saveNotizen);