

var datamodel = require('./datamodel');


//========= Validation ================
function itIsPhonenumber(inputtxt) {
  var phoneno = /^\+?([0-9]{2})\(?([0-9]{3})\)?([0-9]{3})?[-. ]?([0-9]{2})?[-. ]?([0-9]{2})$/;
  if(inputtxt.match(phoneno)) {
    return true;
  }  
  else {  
    return false;
  }
}

function itIsEmail(inputtxt) {
  var mail = /\S+@\S+\.\S+/;
  if(inputtxt.match(mail)) {
    return true;
  }  
  else {  
    return false;
  }
}
//================


exports.getUsers= function(req,res){

 
    datamodel.findAllUser((users) => {
      res.send(users);
    })

}


exports.getUsersByNameOrMail = function(req,res){

  if (req.query.name != '' && req.query.email != '') {
    datamodel.findAllUsersByNameAndMail(req.query.name, req.query.email, (users) => {
      res.send(users);
    })
  } else if (req.query.name != '') {
    datamodel.findAllUsersByName(req.query.name, (users) => {
      res.send(users);
    })
  } else if (req.query.email != '') {

    datamodel.findAllUsersByMail(req.query.email, (users) => {
      res.send(users);
    })

  } else {
    datamodel.findAllUser((users) => {
      res.send(users);
    })
  }

}


exports.getUserById = function(req,res){
  datamodel.findUserById(req.params.id, (user) => {
    if  (user) {
      res.json({id: user.id, phone: user.phone, name: user.name, email: user.email }); 
    } else {
      res.status(404).send('Not found');
    }
  });
}


//checkAccess
exports.checkToken = function (req, res, next) {
  // if (req.method == "GET" && req.path == "/login") {
  //   next();
  // } else if (req.method == "POST" && (req.path == "/api/login" || req.path == "/api/register") || req.method == "OPTIONS") {
  //   next();
  // } else {
  //   datamodel.findUserByToken(req.headers.authorization, (user) => {
  //     if (user) {
  //        next();
  //    } else {
  //    //res.statusCode = 400;
  //       next();
  //      //return res.status(400).json({error: 'No credentials sent!' });
  //    }
  //   });
  //}  

  if (req.method == "POST" && (req.path == "/api/login" || req.path == "/api/register" || req.path == "/api/users")  || req.method == "OPTIONS") {
     next();
  } else if  ( req.path.indexOf("/api/") >= 0 ) {
    datamodel.findUserByToken(req.headers.authorization, (user) => {
      if (user) {
        next();
      } else {
        return res.status(400).json({error: 'No credentials sent!' });
      }
    })
  } else {
    next()
  }
};








exports.meUpdate = function(req,res){
  var name    = "";
  var email    = ""; 
  var password = "";
  var phone    = ""; 

  req.pipe(req.busboy);

  req.busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
    

    val  = val.replace( "\r\n", "" );
    
    if (fieldname == 'email') {
      email = val;
    }

    if (fieldname == 'name') {
      name = val;
    }

    if (fieldname == 'password') {
      password = val;
    }

    if (fieldname == 'phone') {
      phone = val;
    }

  });

  req.busboy.on('finish', function() {

    if (!itIsPhonenumber(phone) && phone != '' ) {
      res.status(422).json({"field": "phone", "message": "Phone must match the format +XX(XXX)XXX-XX-XX" });
    } else if (!itIsEmail(email) && (email != '')) {
      res.status(422).json({"field": "email", "message": "It is not email"});
    } else {

      datamodel.updateUser(req.headers.authorization, name, email, password, phone, (user, err) => {
        if (err) {
          res.status(423).json({field: err, message: "Wrong email"}); 
        } else {
          res.json({id: user.id, phone: user.phone, name: user.name, email: user.email}); 
        }
      
      })
    }
  });

}


exports.register = function(req,res){
  var name    = "";
  var email    = ""; 
  var password = "";
  var phone    = ""; 

  // if (req.busboy == nil) {
  //   res.status(423).send(''); 
  //   return;
  // }

  if (!req.busboy) {
    res.status(999).json({}); 
    return;
  }

  req.pipe(req.busboy);

  req.busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
    

    val  = val.replace( "\r\n", "" );
    
    if (fieldname == 'email') {
      email = val;
    }

    if (fieldname == 'name') {
      name = val;
    }

    if (fieldname == 'password') {
      password = val;
    }

    if (fieldname == 'phone') {
      phone = val;
    }

  });

  req.busboy.on('finish', function() {

    if (!itIsPhonenumber(phone)) {
      res.status(422).json({"field": "phone", "message": "Phone must match the format +XX(XXX)XXX-XX-XX" });
    } else if (!itIsEmail(email)) {
      res.status(422).json({"field": "email", "message": "It is not email"});
    } else {
      datamodel.createUser(name, email, password, phone, (token, err) => {
        if (err) {
          res.status(423).json(err); 
        } else {
          res.json({token: token}); 
        }
      
      })
    }

  });

}

exports.login = function(req,res){
  var email    = ""; 
  var password = "";

  if (!req.busboy) {
    res.status(999).json({}); 
    return;
  }

  req.pipe(req.busboy);

  req.busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
    

    val  = val.replace( "\r\n", "" );
    
    if (fieldname == 'email') {
      email = val;
    }

    if (fieldname == 'password') {
      password = val;
    }

  });

  req.busboy.on('finish', function() {

     datamodel.findUser(email, password, (token, err) => {
      if (err) {
        res.status(422).json({field: err, message: "Wrong email or password"}); 
      } else {

        
        res.json({token: token}); 
      }
      
    })
  });

}