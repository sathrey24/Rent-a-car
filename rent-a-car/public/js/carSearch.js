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

function onSelectionChange(element) {
    var numberofdays_element = document.getElementById("numberofdays");
    var numberofdays_element = document.getElementById("numberofdays");
    var total_element = document.getElementById("total_cost");
    let y = document.getElementsByClassName('rgrid');
    let perHourCost = parseInt(y[0].children[0].textContent.split(":")[1]);
    if(element.value == "Hour")
    {
        let total = numberofdays_element.value*perHourCost;
        total_element.value  = total + " $";
    }else if(element.value == "Day"){
        let total = numberofdays_element.value*24*perHourCost;
        total_element.value  = total + " $";
    }
}