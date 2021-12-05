const dbConnection = require('../config/mongoConnection');
const data = require('../data/');


async function main(){
    const db = await dbConnection();
    // create user
    const sanjay = await data.users.createUser("Sanjay", "Athrey", "123 Stevens Ave", "sathrey@stevens.edu", "111-111-1111", "A11111111111111", "sathrey@stevens.edu", "password1")
    const priyanka = await data.users.createUser("Priyanka", "Chaurasia", "456 Stevens Ave", "pchauras@stevens.edu", "222-222-2222", "A22222222222222", "pchauras@stevens.edu", "password2")
    const anjali = await data.users.createUser("Anjali", "Paliwal", "789 Stevens Ave", "apaliwa1@stevens.edu", "333-333-3333", "A33333333333333", "apaliwa1@stevens.edu", "password3")
    
    //create admin
    await data.admin.createAdmin("Patrick", "Hill", "phill@stevens.edu", "password4", "444-444-4444", "phill@stevens.edu")
    
    //create cars, reviews, and requests to rent
    const honda = await data.cars.createCar("2018 Honda Civic", "Sedan", "black", "4", "5", "30$/hr", true, "gas")
    await data.reviews.createReview(sanjay.userId, honda.carId, "This car was awesome!", 5)
    await data.requests.createRequest(sanjay.userId, honda.carId)
    await data.reviews.createReview(priyanka.userId, honda.carId, "This car was horrible!", 1)
    const audi = await data.cars.createCar("2020 Audi A6", "Sedan", "GREY", "4", "5", "60$/hr", true, "gas")
    await data.reviews.createReview(anjali.userId, audi.carId, "This car was amazing!", 4)
    await data.requests.createRequest(anjali.userId, audi.carId)
    const nissan = await data.cars.createCar("2019 Nissan Altima", "Coupe", "blue", "2", "4", "40$/hr", true, "gas")
    await data.requests.createRequest(sanjay.userId,nissan.carId)
    const tesla = await data.cars.createCar("2021 Tesla Model S", "Sedan", "red", "4", "5", "70$/hr", true, "electric")
    await data.reviews.createReview(priyanka.userId, nissan.carId, "This car was ok!", 3)
    await data.reviews.createReview(priyanka.userId, tesla.carId, "This car was outstanding!", 5)
    await data.requests.createRequest(priyanka.userId, tesla.carId)




    await db.serverConfig.close()

}

main()