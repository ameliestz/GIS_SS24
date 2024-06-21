const params1 = new URLSearchParams(window.location.search);
const id1 = params.get('id1');
console.log(id1);
let genrestring= localStorage.getItem(id1)	
let genrefile= JSON.parse(genrestring)	
console.log (genre1)
let buchtitelseite2= document.getElementById("genresContainer")
buchtitelseite2.textContent= genre1


// Dokumenttitel= Buchtitel
        document.title = genre1;


// Seiten-Titel
        let ueberschriftbuch = document.getElementById ("ueberschriftbuch")
        ueberschriftbuch.textContent = genre1