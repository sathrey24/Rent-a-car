function search_car() {
    let input = document.getElementById('searchbar').value;
    let errorDiv = document.getElementById('id_error');
    input=input.toLowerCase();
    let x = document.getElementsByClassName('cars');
    if(input.trim().length == 0){
        errorDiv.hidden = false;
        errorDiv.innerHTML = "You must enter valid text!";
        document.getElementById('searchbar').focus();
    }else{
        errorDiv.hidden = true;
    }
    for (i = 0; i < x.length; i++) { 
        if (!x[i].innerHTML.toLowerCase().includes(input)) {
            x[i].style.display="none";
        }
        else {
            x[i].style.display="list-item";                 
        }
    }
}