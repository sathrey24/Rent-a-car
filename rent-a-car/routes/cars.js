const express = require('express');
const router = express.Router();
const data = require('../data/')

router.get('/:id', async function(req, res)  {
    try{
        var car = await data.cars.getCar(req.params.id)
    }catch(e){
        res.render('user/error', {error: `<p> ${e} </p>`});
    }
    res.render('user/carDetails', {details: car});
  });
  


module.exports = router;