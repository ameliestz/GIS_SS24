const params1 = new URLSearchParams(window.location.search);
const id1 = params1.get('id1');
console.log(id1);
let genrestring= localStorage.getItem(id1)	
let genrefile= JSON.parse(genrestring)	
console.log (genrefile)
//let buchtitelseite2= document.getElementById("genresContainer")
//buchtitelseite2.textContent= genre1


// Dokumenttitel= Buchtitel
        document.title = genrefile.genre;


// Seiten-Titel
        let ueberschriftbuch = document.getElementById ("ueberschriftbuch")
        ueberschriftbuch.textContent = genrefile.genre