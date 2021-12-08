function onFilterChange(){
    document.getElementById('searchbar').value = "";
}

function search_car() {
    let errorDiv = document.getElementById('id_error');
    let input = document.getElementById('searchbar').value;
    let filterValue = document.getElementById('filter').value;
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
        if(x[i].innerHTML.toLowerCase().includes(filterValue.toLowerCase())){
            if (!x[i].innerHTML.toLowerCase().includes(input)) {
                x[i].style.display="none";
            }
            else {
                x[i].style.display="list-item";                 
            }
        }else{
            if (!x[i].innerHTML.toLowerCase().includes(input)) {
                x[i].style.display="none";
            }
            else {
                x[i].style.display="list-item";                 
            }
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
        total_element.value  = total + "$";
    }else if(element.value == "Day"){
        let total = numberofdays_element.value*24*perHourCost;
        total_element.value  = total + "$";
    }
}

function onFromDateChange(element){
    let errorDiv = document.getElementById('id_error1');
    let currentDate = new Date();
    let slectedDate = new Date(new Date(element.value).getTime() + 86400000);
    if(slectedDate == "Invalid Date") throw "Invalid Date";
    if(currentDate.getDate() != slectedDate.getDate() || currentDate.getMonth() != slectedDate.getMonth() || currentDate.getFullYear() != slectedDate.getFullYear()) {
        errorDiv.hidden = false;
        errorDiv.innerHTML = "From date should be current or future date only";
        document.getElementById('from_date').focus();
    }else{
        errorDiv.hidden = true;
    }
}

function onToDateChange(element){
    let errorDiv = document.getElementById('id_error1');
    let currentDate = new Date();
    let slectedDate = new Date(new Date(element.value).getTime() + 86400000);
    if(slectedDate == "Invalid Date") throw "Invalid Date";
    if(currentDate.getDate() != slectedDate.getDate() || currentDate.getMonth() != slectedDate.getMonth() || currentDate.getFullYear() != slectedDate.getFullYear()) {
        errorDiv.hidden = false;
        errorDiv.innerHTML = "To date should be current or future date only";
        document.getElementById('to_date').focus();
    }else{
        errorDiv.hidden = true;
    }
}