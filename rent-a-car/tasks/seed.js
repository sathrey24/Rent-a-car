const dbConnection = require('../config/mongoConnection');
const data = require('../data/');


async function main(){
    const db = await dbConnection();
    await data.users.createUser("Sanjay", "Athrey", "123 Stevens Ave", "sathrey@stevens.edu", "111-111-1111", "A11111111111111", "sathrey@stevens.edu", "password1")
    await data.users.createUser("Priyanka", "Chaurasia", "456 Stevens Ave", "pchauras@stevens.edu", "222-222-2222", "A22222222222222", "pchauras@stevens.edu", "password2")
    await data.users.createUser("Anjali", "Paliwal", "789 Stevens Ave", "apaliwa1@stevens.edu", "333-333-3333", "A33333333333333", "apaliwa1@stevens.edu", "password3")
    await db.serverConfig.close()

}

main()