//plus-button
    let button= document.getElementById("addButton1");
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
        let Genre = document.getElementById("Genre").value;
        console.log(Genre)
        document.getElementById("Genre").value = '';  //Text verschwindet nach speichern
        }
//löschen-Button
    let löschen= document.getElementById("elementToBeDeleted");
    löschen.addEventListener('click', deleteElement)
        function deleteElement(event){

    }