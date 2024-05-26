//plus-Button
  let button= document.getElementById("addButton2");
  button.addEventListener('click', openpopup);
  function openpopup(event) {
    document.getElementById("popup").style.visibility= "visible" ;
  }


//schließen-Button
  let buttonschließen= document.getElementById("closePopup");
  buttonschließen.addEventListener('click', closepopup);
  function closepopup(event) { 
    document.getElementById("popup").style.visibility= "hidden" ;
  } 

    for (let i = 0; i < localStorage.length; i++) {
      console.log(localStorage.key(i));
      let id= (localStorage.key(i))
      let buchstring= localStorage.getItem(id)	
      let buch= JSON.parse(buchstring)	

      
      console.log (buch.title)
      let unterseite= document.getElementById("unterseite")
      let link= document.createElement("a")
      link.href= "seite3.html?id="+id
      link.title= buch.title
      link.textContent= buch.title
      unterseite.append(link)
    }


    //speichern-Button
    let speichern= document.getElementById("safe");
    speichern.addEventListener('click', safe)
    function safe(event) {
      let title = document.getElementById("titel").value;
      console.log(title)
      let autor= document.getElementById("autor").value;
      console.log(autor)
      let bildUrl = document.getElementById("imageUrl").value; // Bild-URL aus dem Eingabefeld holen
      console.log(bildUrl)
      document.getElementById("autor").value = '';  //Text verschwindet nach speichern
      document.getElementById("titel").value = '';  //Text verschwindet nach speichern
      document.getElementById("imageUrl").value = '';

      let unterseite= document.getElementById("unterseite") 
      let link= document.createElement("a")
    let id=new Date().valueOf()
    link.href= "seite3.html?id="+id
    link.title= title
    link.textContent= title
    unterseite.append(link)
    let buch= {title:title, autor:autor, bildUrl: bildUrl} 
    localStorage.setItem(id, JSON.stringify(buch) );
    }