const models = require('../models');
const Promise = require('bluebird');

// module.exports.createSession = (req, res, next) => {
//   Promise.resolve(res.cookies)
//   .then( cookie => {
//     if (cookie === undefined || Object.keys(cookie).length === 0) { throw cookie; }
//   })  
//   .catch( () => {

//     models.Sessions.create()
//       .then((session) => { 
//         var hashId = session.insertId;
//         let query = {id: hashId};
//         return models.Sessions.get(query);
//       })
//       .then((session) => {
//         //Below code has to be called 'value'
//         // res.cookies = {'shortlyid': session.hash};
//         res.cookie = ('shortlyid', session.hash);
//         req.session = session;
//         return session;
//       });
//     next();
//   })
//   .error( () => {
//     console.log(ERROR);
//     res.status(500).send();
//   });


// };


// module.exports.createSession = (req, res, next) => {
//   console.log(res.cookies);
//   Promise.resolve(res.cookies.shortlyid)
//   .then( hash => {
//     if (!hash) { throw hash; } 
//     return models.Sessions.get({hash});
//   })
//   .then(session => {
//     if (!session) {
//       throw session;
//       return session;
//     }
//   })  
//   .catch((cookie) => {
//     return models.Sessions.create()
//       .then((session) => { 
//         console.log(session);
//         var hashId = session.insertId; 
//         let query = {id: hashId};
        
//         return models.Sessions.get(query);
//       })
//       .then((session) => {
//         //Below code has to be called 'value'
//         res.cookies = {'shortlyid': session.hash};
//         return session;
//       });
//   })
//   .then( session => {
//     console.log('SESSION', session);
//     req.session = session;
//     console.log('RES.SESSION', res.session);
//     next();
//   });

// };





/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/
module.exports.createSession = (req, res, next) => {


  if (Object.keys(req.cookies).length === 0) {
    models.Sessions.create()
    .then((session) => { 
      var hashId = session.insertId;
      let query = {id: hashId};
      models.Sessions.get(query)
      .then((searchReturn) => {
        req.session = searchReturn;
        //Below code has to be called 'value'
        res.cookies = {'shortlyid': {'value': searchReturn.hash} };
        next();
      });
    })
    .catch((error) => {
      console.log('ERROR1');
      res.status(500).send();
    });
  } else {
    req.session = {hash: req.cookies.shortlyid};
    models.Sessions.get(req.session)
    .then((searchReturn) => {
      if (searchReturn.userId) {
        req.session = searchReturn;
      } else {
        req.cookies = {};
        models.Sessions.create()
        .then((session) => { 
          var hashId = session.insertId;
          let query = {id: hashId};
          models.Sessions.get(query)
          .then((searchReturn) => {
            req.session = searchReturn;
            //Below code has to be called 'value'
            req.cookies = {'shortlyid': searchReturn.hash}; 
          });
        });  
      }
      next();
      console.log('not nexting!');
    })
    .catch((error) => {
      console.log('ERROR2');
      res.status(500).send();
    });
  }
};