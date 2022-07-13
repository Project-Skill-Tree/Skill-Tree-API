const User = require("../../models/user.model");
const Skill = require("../../models/skill.model");
const Item = require("../../models/item.model");
const Challenge = require("../../models/challenge.model");
const log = require("npmlog");
const {levelDiff} = require("../../modules/XPHandler");


class UserController {
  async profile(req, res) {
    /*
      #swagger.description = 'Endpoint for retrieving a user's profile'
      #swagger.tags = ['User']
    */
    console.log("GET /users/profile");
    const user = await User.findById(req.headers["id"])
      .populate({path: "completed", model: Skill})
      .populate({path: "inprogress", model: Skill})
      .populate({path: "items", model: Item});
    if (user) {
      res.status(200).json({
        response: "success",
        user: user,
      });
    } else {
      res.status(409).json({response: "error", error: "Invalid user"});
    }
  }

  async authUserDiscord(req, res) {
    /*
      #swagger.description = 'Endpoint for authenticating a user's discord account'
      #swagger.tags = ['User']
    */
    console.log("GET /users/loginDiscord");

    const user = await User.findOne({ discordid: req.headers["discordid"] });
    let id = null;
    if (user) {
      id = user.get("_id");
    }
    res.status(200).json({
      response: "success",
      id: id
    });
  }

  async authUser(req, res) {
    /*
        #swagger.description = 'Endpoint for authentifying a User'
        #swagger.produces = ['application/json']
        #swagger.parameters['username'] = {
            in: 'query',
            required: 'false',
            type: 'string',
            description: 'Username'
        }
        #swagger.tags = ['User']
        #swagger.parameters['password'] = {
            in: 'query',
            required: 'false',
            type: 'string',
            description: 'password' 
        } 
        #swagger.responses[200] = {
            out: ['username','_id']
            description: "User authenticated successfully."
        }
        #swagger.responses[401] = {
          description: "User not found."
        }
        
    */
    console.log("GET /users/loginUser");

    const username = req.body.username;
    const password = req.body.password;

    const user = await User.findOne({ username });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
      });
    } else {
      res.status(401).json({response: "error", error: "cannot find user"});
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
    console.log("POST /users/register");

    const username = req.body.username;
    const password = req.body.password;

    const userExists = await User.findOne({ username });

    if (userExists) {
      res.status(400).json({response: "error", error: "User already exists"});
    }

    const user = await User.create({
      username,
      password,
    });

    if (user) {
      res.status(201).json({
        response: "success",
        _id: user._id,
        username: user.username,
      });
    } else {
      log.warn(`Cannot find user with query:  ${req.query}`);
      res.status(404).json({response: "error", error: "Cannot find user"});
    }
  }

  async registerDiscord(req, res) {
    /*
      #swagger.description = 'Endpoint for registering a user's discord account'
      #swagger.tags = ['User']
    */
    console.log("POST /users/registerDiscord");

    const userExists = await User.findOne({ discordid: req.body.discordid });

    if (userExists) {
      res.status(400).json({response: "error", error: "User already exists"});
      return;
    }

    const user = await User.create({
      discordid: req.body.discordid,
      character: req.body.character,
      difficulty: req.body.difficulty,
      timezone: req.body.timezone,
      baselocation: req.body.baselocation,
    });

    if (user) {
      res.status(201).json({
        response: "success",
        _id: user._id,
      });
    } else {
      log.warn(`Cannot create user:  ${req.query}`);
      res.status(404).json({response: "error", error: "User already exists"});
    }
  }

  async updateUserProfile() {
    /* 
    #swagger.description = 'Endpoint for updating a user's profile'
    #swagger.tags = ['User']
    #swagger.responses[201] = { description: 'User edited successfully.' }
    #swagger.produces = ['application/json']
    #swagger.parameters['username','password'] = {
                in: 'path',
                type: 'integer',
                description: 'User ID.' } 
    */
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
        #swagger.description = 'Endpoint for removing a user'
        #swagger.tags = ['User']
        #swagger.responses[201] = { description: 'User deleted successfully.' }
        #swagger.produces = ['application/json']
    */
    console.log("GET /users/profile");
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
      res.status(404).json({response: "error", error: "User not found"});
      throw new Error("User not Found");
    }
  }

  /**
   * Complete user's skill
   * @param userID
   * @param skillID
   */
  async completeSkill(userID, skillID) {
    /*
      #swagger.description = 'Endpoint for completing a user's skill'
      #swagger.tags = ['User']
    */
    const skill = await Skill.findById(skillID);

    const user = await User.findByIdAndUpdate(userID, {
      $pull: { inprogress: skillID },
      $addToSet: { completed: skillID }
    });

    user.save();
    return await this.addXP(userID, skill.get("xp"));
  }

  async updateXPHistory(req, res) {
    /*
      #swagger.description = 'Endpoint for updating the xp history of a user'
      #swagger.tags = ['User']
    */
    console.log("POST /users/updateXPHistory");

    const user = await User.findByIdAndUpdate(req.body.id, {
      $addToSet: { xpHistory: req.body.xp }
    });
    user.save();
    res.status(200).json({response: "success", error: ""});
  }

  // adds  XP to a given user
  async addXP(id, xp) {
    /*
      #swagger.description = 'Endpoint for adding xp to a user'
      #swagger.tags = ['User']
    */
    const user = await User.findByIdAndUpdate(id, {
      $inc : {"xp" : xp}
    });
    const lastXP = user.get("xp") - xp;
    return levelDiff(lastXP, user.get("xp"));
  }

  async updateUser(req, res) {
    /*
      #swagger.description = 'Endpoint for updating a user'
      #swagger.tags = ['User']
    */
    console.log("POST /users/updateUser");

    const user = await User.findByIdAndUpdate(req.body.userid, {"$set":{
      character: req.body.character,
      difficulty: req.body.difficulty,
      timezone: req.body.timezone,
      baselocation: req.body.baselocation,
    }});
    user.save();
    res.status(200).json({response: "success", error: ""});
  }

  async updateTimezone(req, res) {
    /*
      #swagger.description = 'Endpoint for updating a user's timezone'
      #swagger.tags = ['User']
    */
    console.log("POST /users/updateTimezone");

    const user = await User.findByIdAndUpdate(req.body.id, {
      timezone: req.body.timezone,
    });
    user.save();
    res.status(200).json({response: "success", error: ""});
  }

  async updateBaseLocation(req, res) {
    /*
      #swagger.description = 'Endpoint for updating a user's base location'
      #swagger.tags = ['User']
    */
    console.log("POST /users/updateBaseLocation");

    const user = await User.findByIdAndUpdate(req.body.id, {
      baselocation: req.body.baselocation,
    });
    user.save();
    res.status(200).json({response: "success", error: ""});
  }

  async getAll(req, res) {
    /*
      #swagger.description = 'Endpoint for getting all users'
      #swagger.tags = ['User']
    */
    console.log("GET /users/getAll");

    const users = await User.find({});

    res.status(200).json({
      response: "success",
      users: users,
    });
  }

  async getAllInTimezone(req, res) {
    /*
      #swagger.description = 'Endpoint for getting all the users in a timezone'
      #swagger.tags = ['User']
    */
    console.log("GET /users/getAllInTimezone");

    const users = await User.find({
      timezone: req.headers["offset"],
    });
    res.status(200).json({
      response: "success",
      users: users,
    });
  }

  async getAvailable(req, res) {
    /*
      #swagger.description = 'Endpoint for getting available skills and challenges of a user'
      #swagger.tags = ['User']
    */
    console.log("GET /users/available");

    const user = await User.findById(req.headers["id"]);
    const completed = user.get("completed");

    let skills = await Skill.find({
      _id: {$nin : user.get("inprogress").concat(completed)}, //skill not in progress
      $expr: {$setIsSubset: ["$requires", completed]},
    });
    skills = skills.forEach(skill => {
      skill.type = "Skill";
    });

    let challenges = await Challenge.find({
      _id: {$nin : user.get("inprogress").concat(completed)}, //skill not in progress
      $expr: {$setIsSubset: ["$requires", completed]},
    });
    challenges = challenges.forEach(skill => {
      skill.type = "Challenge";
    });

    res.status(200).json({
      response: "success",
      available: [].concat(skills, challenges),
    });
  }
}

module.exports = new UserController();