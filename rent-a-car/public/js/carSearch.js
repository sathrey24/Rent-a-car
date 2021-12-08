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
    let noresponseDiv = document.getElementById('noresponseError')
    if (typeof(noresponseDiv) != 'undefined' && noresponseDiv != null){
        noresponseDiv.hidden = true
    }
    let errorDiv = document.getElementById('id_error1');
    errorDiv.hidden = true;
    var dateObj = new Date();
    var month = dateObj.getMonth() + 1; //months from 1-12
    var day = dateObj.getDate();
    var year = dateObj.getFullYear();
    let selectedDay = parseInt(element.value.substr(8,9))
    let selectedYear = parseInt(element.value.substr(0,4))
    let selectedMonth = parseInt(element.value.substr(5,2))
    if(dateObj == "Invalid Date") throw "Invalid Date";
    if(selectedDay != day || selectedMonth != month || selectedYear != year) {
        errorDiv.hidden = false;
        errorDiv.innerHTML = "From date should be current or future date only";
        document.getElementById('from_date').focus();
    }else{
        errorDiv.hidden = true;
    }
}

function onToDateChange(element){
    let errorDiv = document.getElementById('id_error1');
    var dateObj = new Date();
    var month = dateObj.getMonth() + 1; //months from 1-12
    var day = dateObj.getDate();
    var year = dateObj.getFullYear();
    if (!element.value){
        errorDiv.hidden = false;
        errorDiv.innerHTML = "To date should be current or future date only";
        document.getElementById('to_date').focus();
    }
    let selectedDay = parseInt(element.value.substr(8,9))
    let selectedYear = parseInt(element.value.substr(0,4))
    let selectedMonth = parseInt(element.value.substr(5,2))
    if(dateObj == "Invalid Date") throw "Invalid Date";
    if (selectedYear < year){
        errorDiv.hidden = false;
        errorDiv.innerHTML = "To date should be current or future date only";
        document.getElementById('to_date').focus();
    }
    if (selectedYear > year){
        errorDiv.hidden = true;
    }
    if (selectedYear === year){
        if (selectedDay >= day && selectedMonth >= month){
                errorDiv.hidden = true;
            } else {
                errorDiv.hidden = false;
                errorDiv.innerHTML = "To date should be current or future date only";
                document.getElementById('to_date').focus();
            }
    }
}