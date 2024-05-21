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
//speichern-Button
    let speichern= document.getElementById("safe");
    speichern.addEventListener('click', safe)
    function safe(event) {
      let title = document.getElementById("titel").value;
      console.log(title)
      let autor= document.getElementById("autor").value;
      console.log(autor)
    document.getElementById("autor").value = '';  //Text verschwindet nach speichern
    document.getElementById("titel").value = '';  //Text verschwindet nach speichern
    }

