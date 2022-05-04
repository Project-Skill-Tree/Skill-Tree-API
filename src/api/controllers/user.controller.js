const User = require("../../models/user.model");
const Item = require("../../models/item.model");
const log = require("npmlog");


class UserController {
  async profile(req, res) {
    if (req.headers["api_key"] !== process.env.API_KEY) {
      res.status(401);//Unauthorised
      return;
    }

    console.log("GET /profile");

    const user = await User.findOne({ discordid: req.headers["discordid"] });
    const items = await Item.find({
      _id: {$in : user.get("items")}
    });

    if (user) {
      res.status(200).json({
        user: user,
        items: items,
      });
    } else {
      res.status(409);
    }
  }

  async authUserDiscord(req, res) {
    //Validate API-KEY
    if (req.headers["api_key"] !== process.env.API_KEY) {
      res.status(401);//Unauthorised
      return;
    }

    const userExists = await User.exists({ discordid: req.headers["discordid"] });

    res.status(200).json({
      userExists: userExists,
    });
  }

  async authUser(req, res) {
    /*
        #swagger.description = 'Endpoint for authentifying a User'
        #swagger.tags = ['User']
        #swagger.produces = ['application/json']
        #swagger.parameters['username'] = {
            in: 'query',
            required: 'false',
            type: 'string',
            description: 'Username' 
        }
        #swagger.parameters['password'] = {
            in: 'query',
            required: 'false',
            type: 'string',
            description: 'password' 
        } 
        #swagger.responses[200] = {
            out: ['username','_id']
            description: "User authentified successfully." 
        }
        #swagger.responses[401] = {
          description: "User not found."
        }
        
    */
    //Validate API-KEY
    if (req.headers["api_key"] !== process.env.API_KEY) {
      res.status(401);//Unauthorised
      return;
    }

    const username = req.body.username;
    const password = req.body.password;

    const user = await User.findOne({ username });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,

      });
    } else {
      res.status(401);
      log.warn(`Cannot find user with query:  ${req.query}`);
    }
  }

  async register(req, res) {
    /*
        #swagger.description = 'Endpoint for creating a User'
        #swagger.tags = ['User']
        #swagger.responses[201] = {
          description: 'User created successfully.'
           }
        #swagger.produces = ['application/json']
        #swagger.parameters['username'] = {
          in:'query',
          required:false,
          type:'string',
          description:'name of the user'
        }
        #swagger.parameters['password'] = {
            in:'query',
            required:false,
            type:'string',
            description:'password of the user'
        }
        #swagger.parameters['discordid'] = {
            in:'query',
            required:false,
            type:'string',
            description:'discord ID of the user'
        }
        #swagger.requestBody = { 
            required: true,
            description: 'User information.',
        }
        #swagger.security=[{
          "apiKeyAuth":[]
        }]
    */
    console.log("POST /register");

    //Validate API-KEY
    if (req.headers["api_key"] !== process.env.API_KEY) {
      res.status(401);//Unauthorised
      return;
    }

    const username = req.body.username;
    const password = req.body.password;

    const userExists = await User.findOne({ username });

    if (userExists) {
      res.status(400);
      log.warn("Already found a user with the specified username");
    }

    const user = await User.create({
      username,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
      });
    } else {
      log.warn(`Cannot find user with query:  ${req.query}`);
      res.status(404);
    }
  }

  async registerDiscord(req, res) {
    console.log("POST /registerDiscord");

    //Validate API-KEY
    if (req.headers["api_key"] !== process.env.API_KEY) {
      res.status(401);//Unauthorised
      return;
    }

    const userExists = await User.findOne({ discordid: req.body.discordid });

    if (userExists) {
      res.status(400);
      log.warn("Already found a user with the specified username");
    }

    const user = await User.create({
      discordid: req.body.discordid,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
      });
    } else {
      log.warn(`Cannot create user:  ${req.query}`);
      res.status(404);
    }
  }

  async updateUserProfile() {
    /* 
    #swagger.description = 'Endpoint for editing a User'
    #swagger.tags = ['User']
    #swagger.responses[201] = { description: 'User edited successfully.' }
    #swagger.produces = ['application/json']
    #swagger.parameters['username','password'] = {
                in: 'path',
                type: 'integer',
                description: 'User ID.' } 
    */
    // Validate API-KEY
    //     if (req.headers["api_key"] !== process.env.API_KEY) {
    //       res.status(401);//Unauthorised
    //       return;
    //     }
    // log.verbose("UPDATE USER");
    // const user = await User.findOne({username},{password});

    // if (user) {
    //   user.username = req.body.name || user.username;
    //   user.pic = req.body.pic || user.pic;
    //   if (req.body.password) {
    //     user.password = req.body.password;
    //   }

    //   const updatedUser = await user.save();

    //   res.json({
    //     _id: updatedUser._id,
    //     username: updatedUser.username,
    //     pic: updatedUser.pic,
    //   });
    //   log.verbose("User updated");
    // } else {
    //   log.warn(`Cannot find user with query:  ${req.query}`);
    //   res.status(404);
    // }
  }

  async removeUser(req,res) {
    /* 
        #swagger.description = 'Endpoint for deleting a User'
        #swagger.tags = ['User']
        #swagger.responses[201] = { description: 'User deleted successfully.' }
        #swagger.produces = ['application/json']
    */
    //Validate API-KEY
    if (req.headers["api_key"] !== process.env.API_KEY) {
      res.status(401);//Unauthorised
      return;
    }

    log.verbose("DELETE USER");
    const UserExists = await User.findOne({username:req.body.username});

    if (UserExists) {
      try {
        const removedUser = await User.remove({username:req.body.username,password:req.body.password});
        res.json({
          _id:removedUser._id,
          username:removedUser.username,
          pic: removedUser.pic,
        });
        log.verbose("User deleted");
      } catch (error) {
        log.warn(error);
      }
    } else {
      res.status(404);
      throw new Error("User Not Found");
    }
  }
}

module.exports = new UserController();