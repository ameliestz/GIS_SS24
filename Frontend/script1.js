// Plus-Button
          let button1 = document.getElementById("addButton1");
          button1.addEventListener('click', openpopup1);
    
          function openpopup1 (event) {
            document.getElementById("popup1").style.visibility = "visible";
          }
    


          document.addEventListener('DOMContentLoaded', (event) => {
// Schließen-Button 
           let buttonschließen1 = document.getElementById("closePopup1");
           buttonschließen1.addEventListener('click', closepopup1);
        
            function closepopup1(event) { 
                document.getElementById("popup1").style.visibility = "hidden";
            }
        
// Speichern-Button 
          let speichern1 = document.getElementById("safe1");
          speichern1.addEventListener('click', safe1);
        
          function safe1(event) {
                event.preventDefault();  // Verhindert das Standard-Submit-Verhalten
                let genre1 = document.getElementById("Genre").value.trim(); // Genre-Wert holen und trimmen
        
                // Prüfen, ob das Genre bereits existiert
                if (localStorage.getItem(genre1)) {
                    alert("Das Genre existiert bereits!");
                    return;
                }
        
                // Neues Genre zum LocalStorage hinzufügen
                localStorage.setItem(genre1, JSON.stringify([])); // Leeres Array für Bücher dieses Genres
        
                // Hinzufügen eines neuen Links auf der index.html Seite
                let genresContainer = document.getElementById("genresContainer");
                if (genresContainer) {
                    let link = document.createElement("a");
                    link.href = "Genres/" + genre1 + ".html";
                    link.textContent = genre1;
                    link.title = genre1;
                    genresContainer.appendChild(link);
                } else {
                    console.error('Das genresContainer-Element wurde nicht gefunden.');
                }
        
// Popup nach dem Speichern schließen
            document.getElementById("popup1").style.visibility = "hidden";
            }
        
// Beim Laden der Seite alle vorhandenen Genre-Links aus dem LocalStorage hinzufügen
            let genresContainer = document.getElementById("genresContainer");
            if (genresContainer) {
                // Durchlaufe den LocalStorage
                for (let i = 0; i < localStorage.length; i++) {
                    let key = localStorage.key(i);
                    let genre = localStorage.getItem(key);
        
                // Überprüfe, ob der Wert im LocalStorage ein Array ist (Genre)
                    if (Array.isArray(JSON.parse(genre))) {
                        let link = document.createElement("a");
                        link.href = "Genres/" + key + ".html";
                        link.textContent = key; // Verwende den Schlüssel als Text für den Link
                        link.title = key;
                        genresContainer.appendChild(link);
                    }
                }
            } else {
                console.error('Das genresContainer-Element wurde nicht gefunden.');
            }
        });

