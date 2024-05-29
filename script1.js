// Plus-Button
          let button1 = document.getElementById("addButton1");
          button1.addEventListener('click', openpopup1);
    
          function openpopup1 (event) {
            document.getElementById("popup1").style.visibility = "visible";
          }
    
// Schließen-Button
          let buttonschließen1 = document.getElementById("closePopup1");
          buttonschließen1.addEventListener('click', closepopup1);
    
          function closepopup1 (event) { 
            document.getElementById("popup1").style.visibility = "hidden";
          }


// Speichern-Button
          let speichern1 = document.getElementById("safe1");
          speichern1.addEventListener('click', safe1);
      
          function safe1(event) {
            event.preventDefault();  // Verhindert das Standard-Submit-Verhalten
            let genre1 = document.getElementById("Genre").value;
            console.log(genre1)

          // Text verschwindet nach speichern
            document.getElementById("Genre").value = '';  
        
          }


          //let genretitel = //getGenreFromURL();
            for (let i1 = 0; i1 < localStorage.length; i1++) {
              let id1 = localStorage.key(i1);
              let genrestring = localStorage.getItem(id1);
              let genre1 = JSON.parse(genrestring);
    
                let unterseite1 = document.getElementById("unterseite1");
                if (unterseite1) {
                  let link1 = document.createElement("a");
                  link1.href = "seite2.html?id=" + id1;
                  unterseite1.appendChild(link1);
                } else {
                  console.error('Das unterseite-Element wurde nicht gefunden.');
                }
              }
          