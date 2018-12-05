
const Sequelize = require('sequelize');
const crypto = require('crypto');

process.env.HOSTPOSTGRES = '10.10.1.243'

//const sequelize = new Sequelize('map_new_york', 'postgres', '123', {
const sequelize = new Sequelize('messager', process.env.USERPOSTGRES || 'postgres', process.env.PSWPOSTGRES || '123', {
  host: process.env.HOSTPOSTGRES || 'localhost',
  dialect: 'postgres',
  dialectOptions: {
    ssl: true
  },
  port: process.env.PORTPOSTGRES || 5432,
  logging: false

});


const User = sequelize.define('user', {
  name: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING
  },
  password: {
    type: Sequelize.STRING
  },
  salt: {
    type: Sequelize.STRING
  },
  token: {
    type: Sequelize.STRING
  },
  phone: {
    type: Sequelize.STRING
  }
});




const Messages = sequelize.define('Messages', {
  message: {
    type: Sequelize.STRING
  },
  from: {
    type: Sequelize.INTEGER
  },
  to: {
    type: Sequelize.INTEGER
  },
  owner: {
    type: Sequelize.INTEGER
  },
  dateCreate: {
    type:  Sequelize.DATE, defaultValue: Sequelize.NOW
  }
});


exports.findAllMessagesByUser_id = function (user_id, callback) {
  Items.findAll({
    where: {
      [Op.or]: [{from: user_id}, {to: user_id}]
    },
    order: ['dateCreate', 'DESC']
  }).then(messages => {
      callback(messages);
  });
};



exports.findAllMessages = function (order_by, callback) {
  Items.findAll({
    order: ['dateCreate', 'DESC']
  }).then(messages => {
      callback(messages);
  });
};


exports.createMessage = function (from, to, message, owner, callback) {
    
    
  Messages.sync({force: false}).then(() => {
    Messages.create({
        from: from,
        to: to,
        message: message,
        owner: owner
      }).then((item)=>{
        callback(user, item)
      });
    });
};



exports.connnectToDatabase = function () {
	sequelize
  		.authenticate()
  		.then(() => {
   				console.log('Connection has been established successfully.');
  		})
  		.catch(err => {
    		console.error('Unable to connect to the database:', err);
  	});
};


exports.findAllUsersByName = function (name, callback) {
  User.findAll({
        where: {
        name: name
      }
  }).then(users => {
      callback(users);
  });
};

exports.findAllUsersByMail = function (email, callback) {
  User.findAll({
        where: {
        email: email
      }
  }).then(users => {
      callback(users);
  });
};

exports.findAllUser = function (callback) {
  User.findAll().then(users => {
      callback(users);
  });
};

exports.findUser = function (email, password, callback) {
	User.findOne({
  			where: {
    		email: email
  		}
	}).then(user => {
		var err = null;
		if (user == null) {
			err = 'email'
		} else { //checkPassword

       var hashpasswordNew = crypto.createHash('sha512')
                   .update(user.salt + password, 'utf8')
                   .digest('hex');


			if (user.password != hashpasswordNew) {
				err = 'password'
			}
		}

    var token = null;

    if (user) {
      token = user.token; 
    }

  	callback(token, err);
	});
};


exports.findUserByToken = function (token, callback) {
	User.findOne({
  			where: {
    		token: token
  		}
	}).then(user => {
  		callback(user);
	});
};


exports.findUserById = function (id, callback) {
  User.findOne({
        where: {
        id: id
      }
  }).then(user => {
      callback(user);
  });
};


exports.createUser = function (name, email, password, phone, callback) {

  if (password === "") {
    err =  {field: 'current_password', message: "Wrong current password"}
    callback(null, err);
  } else {

    const token = Math.round((Date.now() * Math.random())) + '';

    var salt = Math.round((Date.now() * Math.random())) + '';
    var hashpassword = crypto.createHash('sha512')
                   .update(salt + password, 'utf8')
                   .digest('hex');

    User.findOne({
        where: {
        email: email
      }
    }).then(user => {
      if (user == null) {

          User.sync({force: false}).then(() => {
            User.create({
              name: name,
              email: email,
              password: hashpassword,
              salt: salt,
              token: token,
              phone: phone
            }).then(()=>{callback(token)});
          });
     

      } else {
        err =  {field: 'email exists', message: "Wrong email"}
        callback(null, err);
      }

    }).catch(() => {
      User.sync({force: false}).then(() => {
        User.create({
          name: name,
          email: email,
          password: hashpassword,
          salt: salt,
          token: token,
          phone: phone
        }).then(()=>{callback(token)});
      });
    });
  }

};



exports.updateUser = function (token, name, email, password, phone, callback) {


  User.findOne({
        where: {
        token: token
      }
  }).then(user => {
    if (user) {
     
      if (name != '')     user.name      = name;
      if (email != '')    user.email     = email;

      var salt = Math.round((Date.now() * Math.random())) + '';
      var hashpassword = crypto.createHash('sha512')
                   .update(salt + password, 'utf8')
                   .digest('hex');

      user.salt = salt;
      user.password  = hashpassword;
      if (phone != '')    user.phone     = phone;

      user.save();

      callback(user);

    } else {
        err = "token don't exists";
        callback(null, err);
    }

  });


};







