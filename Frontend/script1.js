// Plus-Button
        let button1 = document.getElementById("addButton1");
        button1.addEventListener('click', openpopup1);

        function openpopup1(event) {
            document.getElementById("popup1").style.visibility = "visible";
        }

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
                event.preventDefault();  
                let genre1 = document.getElementById("Genre").value; 

                document.getElementById("Genre").value = '';

                let id1 = new Date().valueOf();
                localStorage.setItem(id1, JSON.stringify({ genre: genre1 }));

                let genresContainer = document.getElementById("genresContainer");
                if (genresContainer) {
                    let link1 = document.createElement("a");
                    link1.href = "seite2.html?id1=" + id1;
                    link1.title = genre1;
                    link1.textContent = genre1;
                    genresContainer.appendChild(link1);
                } else {
                    console.error('Das genresContainer-Element wurde nicht gefunden.');
                }
            }

// Event-Listener für Seitenladen, um das Genre dynamisch in Seite 2 HTML einzufügen
        document.addEventListener('DOMContentLoaded', (event) => {
            let params1 = new URLSearchParams(window.location.search);
            let id1 = params1.get('id1');
            if (id1) {
                let genreInfo = localStorage.getItem(id1);
                if (genreInfo) {
                    let genreObj = JSON.parse(genreInfo);
                    document.getElementById('genreTitel').textContent = genreObj.genre;
                } else {
                    console.error('Genre-Informationen konnten nicht gefunden werden.');
                }
            } else {
                console.error('ID1 wurde nicht gefunden.');
            }
        });
