document.addEventListener('DOMContentLoaded', (event) => {

// Plus-Button 
  let button = document.getElementById("addButton2");
  button.addEventListener('click', openpopup);

  function openpopup(event) {
    document.getElementById("popup").style.visibility = "visible";
  }

// Löschen-Button

  let buttonschließen = document.getElementById("closePopup");
  buttonschließen.addEventListener('click', closepopup);

  function closepopup(event) { 
    document.getElementById("popup").style.visibility = "hidden";
  }

// Genre aus der URL extrahieren
  let genre = getGenreFromURL();
  if (genre) {
    for (let i = 0; i < localStorage.length; i++) {
      let id = localStorage.key(i);
      let buchstring = localStorage.getItem(id);
      let buch = JSON.parse(buchstring);

      if (buch && buch.genre === genre) {
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
        speichern.addEventListener('click', safe);

        function safe(event) {
          event.preventDefault();
          let title = document.getElementById("titel").value;
          let autor = document.getElementById("autor").value;
          let bildUrl = document.getElementById("imageUrl").value;
          let genre = getGenreFromURL();

          document.getElementById("autor").value = '';  
          document.getElementById("titel").value = '';  
          document.getElementById("imageUrl").value = '';

          let id = new Date().valueOf(); 
          let buch = { title: title, autor: autor, bildUrl: bildUrl, genre: genre };
          localStorage.setItem(id, JSON.stringify(buch));

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

          // AJAX Request to send data to the server
          let xhr = new XMLHttpRequest();
          xhr.open("POST", "http://127.0.0.1:3001/saveBook", true);
          xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
          xhr.send(JSON.stringify(buch));

          xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
              console.log("Book saved to server");
            } else if (xhr.readyState === 4) {
              console.error("Failed to save book to server");
            }
          };
        }

//Buch in richtiges Genre einfügen
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
