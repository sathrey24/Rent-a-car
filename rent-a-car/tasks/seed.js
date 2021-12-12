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
    const honda = await data.cars.createCar("2018 Honda Civic", "Sedan", "Black", "4", "5", "30$/hr", "Yes", "Gas")
    const request1 = await data.requests.createRequest(sanjay.username, honda.carId,"2021-12-08","2021-12-08","5 Hours","150$")
    await data.reviews.createReview(sanjay.username, request1.requestId, "This car was awesome!", 5)
    await data.reviews.createReview(priyanka.username, request1.requestId, "This car was horrible!", 1)

    const audi = await data.cars.createCar("2020 Audi A6", "Sedan", "Grey", "4", "5", "60$/hr", "Yes", "Gas")
    const request2=await data.requests.createRequest(anjali.username, audi.carId,"2021-12-09","2021-12-11","3 Day","4320$")
    await data.reviews.createReview(anjali.username, request2.requestId, "This car was amazing!", 4)

    const nissan = await data.cars.createCar("2019 Nissan Altima", "Coupe", "Blue", "2", "4", "40$/hr", "Yes", "Gas")
    const review3=await data.requests.createRequest(sanjay.username, nissan.carId,"2021-12-14","2021-12-15","1 Day","960$")

    const tesla = await data.cars.createCar("2021 Tesla Model S", "Sedan", "Red", "4", "5", "10$/hr", "Yes", "Electric")
    await data.reviews.createReview(priyanka.username, review3.requestId, "This car was ok!", 3)

    const review4= await data.requests.createRequest(priyanka.username, tesla.carId,"2021-12-07","2021-12-24","11 Day","2640$")
    await data.reviews.createReview(priyanka.username, review4.requestId, "This car was outstanding!", 5)
    
    const ranualt = await data.cars.createCar("2021 Ranualt Triber", "Sedan", "White", "3", "5", "20$/hr", "Yes", "Electric")
    await data.requests.createRequest(sanjay.username, ranualt.carId,"2021-12-13","2021-12-15","2 Day","960$")

   await data.cars.createCar("2015 MAZDA MAZDA3", "Sedan", "White", "3", "4", "25$/hr", "No", "Electric")

   const c5=await data.cars.createCar("2019 HONDA HR-V", "SUV", "Red", "3", "5", "35$/hr", "Yes", "Petrol")
   const r5=await data.requests.createRequest(sanjay.username, c5.carId,"2021-12-07","2021-12-07","1 Hour","35$")
    await data.requests.approveRequest(r5.requestId,true);
    // await data.reviews.createReview(sanjay.username, r5.requestId, "This car was outstanding!", 4)

    await data.cars.createCar("2019 CHEVROLET EQUINOX", "LT Sport Utility 4D", "White", "2", "6", "40$/hr", "No", "Gas")

   await data.cars.createCar("2017 HYUNDAI SANTA FE SPORT", "Sport Utility 4D", "Grey", "3", "5", "20$/hr", "Yes", "Electric")

   const c6 = await data.cars.createCar("2017 FORD TAURUS", "Sedan", "Blue", "3", "5", "20$/hr", "Yes", "Petrol")
   const r6=await data.requests.createRequest(sanjay.username, c6.carId,"2021-11-07","2021-11-12","1 Hour","2400$")
    await data.requests.approveRequest(r6.requestId,true);
    await data.reviews.createReview(sanjay.username, r6.requestId, "This car was good!", 3)

   await data.cars.createCar("2014 HYUNDAI ELANTRA", "Sedan", "Black", "3", "6", "20$/hr", "Yes", "Diesel")

   const c13=await data.cars.createCar("2013 KIA SOUL", "Wagon", "Red", "2", "2", "20$/hr", "Yes", "Diesel")
   const r13=await data.requests.createRequest(anjali.username, c13.carId,"2021-12-25","2021-12-27","2 Day","960$")
    await data.requests.approveRequest(r13.requestId,true);

   await data.cars.createCar("2017 HONDA FIT", "Hatchback", "Yellow", "4", "4", "20$/hr", "Yes", "Electric")

  const c1 = await data.cars.createCar("2016 NISSAN ALTIMA", "Sedan", "White", "4", "6", "15$/hr", "Yes", "Gas")
  const r1=await data.requests.createRequest(anjali.username, c1.carId,"2021-12-07","2021-12-08","1 Day","3600$")
  await data.requests.approveRequest(r1.requestId,true);
  // await data.reviews.createReview(anjali.username, r1.requestId, "This car was outstanding!", 5)

  await data.cars.createCar("2018 MITSUBISHI MIRAGE G4", "Sedan", "Black", "3", "5", "10$/hr", "Yes", "Gas")

  await data.cars.createCar("2019 Subaru Ascent", "Subaru", "Black", "3", "5", "10$/hr", "Yes", "Petrol")

  const c11=await data.cars.createCar("2018 Mercedes-Benz C-Class C 300 4MATIC", "Mercedes", "Red", "3", "4", "35$/hr", "No", "Electric")
  const r11=await data.requests.createRequest(sanjay.username, c11.carId,"2021-12-17","2021-12-26","10 Day","8400$")
  await data.requests.approveRequest(r11.requestId,true);

  await data.cars.createCar("2021 Mazda CX-5 Grand Touring", "Mazda", "Black", "3", "5", "10$/hr", "Yes", "Petrol")

  await data.cars.createCar("2018 Nissan Rogue SV", "Nissan", "Red", "3", "5", "35$/hr", "Yes", "Gas")

  await data.cars.createCar("2018 Porsche Panamera 4", "Porsche", "Grey", "3", "5", "20$/hr", "No", "Diesel")

  const c2=await data.cars.createCar("2020 Porsche Macan Base", "Porsche", "White", "3", "5", "35$/hr", "Yes", "Electric")
  const r8=await data.requests.createRequest(anjali.username, c2.carId,"2021-12-01","2021-12-01","1 Day","840$")
  await data.requests.approveRequest(r8.requestId,true);
  await data.reviews.createReview(anjali.username, r8.requestId, "This car was outstanding!", 5)

  const c12=await data.cars.createCar("2020 Tesla Model Y Performance", "Tesla", "Black", "3", "5", "20$/hr", "Yes", "Gas")
  const r12=await data.requests.createRequest(priyanka.username, c12.carId,"2021-12-21","2021-12-21","11 Hour","220$")
  await data.requests.approveRequest(r12.requestId,true);

  await data.cars.createCar("2018 Volvo XC90 T5 Momentum", "Volvo", "Grey", "3", "3", "20$/hr", "Yes", "Diesel")

  await data.cars.createCar("2019 Volvo XC90 T5 Momentum", "Volvo", "White", "3", "4", "35$/hr", "No", "Petrol")

  await data.cars.createCar("2020 BMW 530 i xDrive", "BMW", "Red", "3", "5", "10$/hr", "Yes", "Electric")

  const c3=await data.cars.createCar("2018 BMW X5 M Base", "BMW", "Black", "3", "6", "20$/hr", "Yes", "Gas")
  const r2=await data.requests.createRequest(anjali.username, c3.carId,"2021-12-05","2021-12-08","3 Day","1440$")
  await data.requests.approveRequest(r2.requestId,true);
  await data.reviews.createReview(anjali.username, r2.requestId, "Bad experience!", 1)

  const c4=await data.cars.createCar("2021 Honda Civic EX", "Honda", "White", "3", "5", "40$/hr", "Yes", "Electric")
  const r3=await data.requests.createRequest(anjali.username, c4.carId,"2021-12-13","2021-12-17","4 Day","3840$")
  await data.requests.approveRequest(r3.requestId,true);
  await data.requests.createRequestExtension(r3.requestId,1,'Day');

  await data.cars.createCar("2018 MITSUBISHI MIRAGE G4", "Honda", "Black", "3", "5", "10$/hr", "Yes", "Petrol")

  const c7=await data.cars.createCar("2019 Honda Accord Sport 2.0T", "Honda", "White", "3", "3", "35$/hr", "Yes", "Diesel")
  await data.requests.createRequest(anjali.username, c7.carId,"2021-12-20","2021-12-20","9 Hour","315$")

  const c8=await data.cars.createCar("2019 Honda Pilot Touring 8-Passenger", "Honda", "Blue", "4", "8", "20$/hr", "Yes", "Electric")
  await data.requests.createRequest(sanjay.username, c8.carId,"2022-01-01","2022-01-02","2 Day","960$")


    await db.serverConfig.close()

}

main()