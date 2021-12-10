const myForm = document.getElementById('add-car-form');

if(myForm){
    myForm.addEventListener("submit", event =>{
        const model = document.getElementById('model');
        const type = document.getElementById('type');
        const color = document.getElementById('color');
        const numberDoors = document.getElementById('numberDoors');
        const seatingCapacity = document.getElementById('seatingCapacity');
        const hourlyRate = document.getElementById('hourlyRate');
        const availability = document.getElementById('availability');
        const engineType = document.getElementById('engineType');
        const errorDiv = document.getElementById('divError');
        event.preventDefault();
        if(!model.value || !type.value || !color.value || !numberDoors.value
            || !seatingCapacity.value || !hourlyRate.value || !availability.value || !engineType.value || !hourlyRate.value.includes('$/hr')){
                errorDiv.hidden = false;
                errorDiv.innerHTML = "None of the feilds should be empty."
        }
        else{
                errorDiv.hidden = true;
        }
    });
}