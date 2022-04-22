const asyncHandler = require("express-async-handler");
const User = require("../../models/user.model");
var log = require('npmlog')


class UserController {
 authUser = asyncHandler(async (req, res) => {
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
  const { username, password } = req.body;

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
});


registerUser = asyncHandler(async (req, res) => {
      /*
        #swagger.description = 'Endpoint for creating a User'
        #swagger.tags = ['User']
        #swagger.responses[201] = {
          description: 'User created successfully.'
           }
        #swagger.produces = ['application/json']
        #swagger.parameters['username'] = {
          in:'query',
          required:true,
          type:'string',
          description:'name of the user'
        }
          #swagger.parameters['password'] = {
            in:'query',
            required:true,
            type:'string',
            description:'password of the user'
        }
        #swagger.requestBody = { 
            required: true,
            description: 'User information.',
        }
        #swagger.security=[{
          "apiKeyAuth":[]
        }]
    */
  const {username, password } = req.body;

  const userExists = await User.findOne({ username });

  if (userExists) {
    res.status(400);
    log.warn('Already found a user with the specified username')
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
});

updateUserProfile = asyncHandler(async (req, res) => {
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
  log.verbose("UPDATE USER")
  const user = await User.findOne({username},{password});

  if (user) {
    user.username = req.body.name || user.username;
    user.pic = req.body.pic || user.pic;
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      pic: updatedUser.pic,
    });
    log.verbose("User updated")
  } else {
    log.warn(`Cannot find user with query:  ${req.query}`);
    res.status(404);
  }
});


removeUser = asyncHandler(async (req,res) =>{
      /* 
        #swagger.description = 'Endpoint for deleting a User'
        #swagger.tags = ['User']
        #swagger.responses[201] = { description: 'User deleted successfully.' }
        #swagger.produces = ['application/json']
    */
        log.verbose("DELETE USER")
        const UserExists = await User.findOne({username:req.body.username});

        if (UserExists){
            try {
                const removedUser = await User.remove({username:req.body.username,password:req.body.password});
                res.json({
                    _id:removedUser._id,
                    username:removedUser.username,
                    pic: removedUser.pic,
            })
                log.verbose("User deleted")
            }catch(error){
                log.warn(error)
            }
       }else{
          res.status(404);
          throw new Error("User Not Found");
        }
      })
    }


module.exports= new UserController;