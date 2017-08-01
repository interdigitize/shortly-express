const models = require('../models');
const Promise = require('bluebird');
const cookieParser = require('./cookieParser');

module.exports.createSession = (req, res, next) => {
  if (Object.keys(req.cookies).length === 0) {
    models.Sessions.create()
    .then((session) => { 
      var hashId = session.insertId;
      let query = {id: hashId};
      models.Sessions.get(query)
      .then((searchReturn) => {
        req.session = {hash: searchReturn.hash};
        //Below code has to be called 'value'
        res.cookies = {'shortlyid': {'value': searchReturn.hash} };
        next();
      });
    })
    .catch((error) => {
      console.log('ERROR');
      res.status(500).send();
    });
  } else {
    console.log(req.cookies.shortlyid);
    req.session = {hash: req.cookies.shortlyid};
    next();



  }
};



/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

