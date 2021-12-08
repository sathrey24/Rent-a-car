const dbConnection = require('../config/mongoConnection');
const data = require('../data/');


async function main(){
    const db = await dbConnection();
    // create user
    const sanjay = await data.users.createUser("Sanjay", "Athrey", "123 Stevens Ave", "sathrey@stevens.edu", "111-111-1111", "A11111111111111", "sathrey@stevens.edu", "password1")
    const priyanka = await data.users.createUser("Priyanka", "Chaurasia", "456 Stevens Ave", "pchauras@stevens.edu", "222-222-2222", "A22222222222222", "pchauras@stevens.edu", "password2")
    const anjali = await data.users.createUser("Anjali", "Paliwal", "789 Stevens Ave", "apaliwa1@stevens.edu", "333-333-3333", "A33333333333333", "apaliwa1@stevens.edu", "password3")
    const user4 = await data.users.createUser("Joe", "Ronaldo", "546 Stevens Ave", "jronaldo@stevens.edu", "444-444-4444", "A33333333333334", "jronaldo@stevens.edu", "password6")
    const user5 = await data.users.createUser("John", "Jaferi", "367 Stevens Ave", "jJaferi@stevens.edu", "444-444-444", "A333333333333335", "jJaferi@stevens.edu", "password7")
    
    //create admin
    await data.admin.createAdmin("Patrick", "Hill", "phill@stevens.edu", "password4", "444-444-4444", "phill@stevens.edu")
    
    //create cars, reviews, and requests to rent
    const honda = await data.cars.createCar("2018 Honda Civic", "Sedan", "Black", "4", "5", "30$/hr", "Yes", "Gas")
    const request1 = await data.requests.createRequest(sanjay.username, honda.carId,"2021-12-08","2021-12-08","5 Hours","150$")
    await data.reviews.createReview(sanjay.username, request1.requestId, "This car was awesome!", 5)
    await data.reviews.createReview(priyanka.username, request1.requestId, "This car was horrible!", 1)

    const audi = await data.cars.createCar("2020 Audi A6", "Sedan", "Grey", "4", "5", "60$/hr", "Yes", "Gas")
    const request2=await data.requests.createRequest(anjali.username, audi.carId,"2021-12-09","2021-12-11","3 Day","4320$")
    await data.reviews.createReview(anjali.username, request2.requestId, "This car was amazing!", 4)

    const nissan = await data.cars.createCar("2019 Nissan Altima", "Coupe", "Blue", "2", "4", "40$/hr", "Yes", "Gas")
    const review3=await data.requests.createRequest(sanjay.username, nissan.carId,"2021-12-07","2021-12-08","1 Day","960$")

    const tesla = await data.cars.createCar("2021 Tesla Model S", "Sedan", "Red", "4", "5", "10$/hr", "Yes", "Electric")
    await data.reviews.createReview(priyanka.username, review3.requestId, "This car was ok!", 3)

    const review4= await data.requests.createRequest(priyanka.username, tesla.carId,"2021-12-07","2021-12-24","11 Day","2640$")
    await data.reviews.createReview(priyanka.username, review4.requestId, "This car was outstanding!", 5)
    
    const ranualt = await data.cars.createCar("2021 Ranualt Triber", "Sedan", "White", "3", "5", "20$/hr", "No", "Electric")
    await data.requests.createRequest(sanjay.username, ranualt.carId,"2021-12-13","2021-12-15","2 Day","960$")

    await db.serverConfig.close()

}

main()