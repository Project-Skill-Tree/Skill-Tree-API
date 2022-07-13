const mongoose = require("mongoose");
const bcrypt =require("bcryptjs");
const Schema = mongoose.Schema;


/**
 * User Object
 * @param username - the name of the user.
 * @param password - the password of the user.
 * @param discordid - discordID of the user
 * @param pic - the avatar of the user .
 * @param exp - Total experience earned by the user.
 * @param level - The currrent level of the user.
 * @param items - The list of items owned by the user.
 * @param completed - The list of skills completed by the user.
 * @param inprogress - The list of skills currently being trained by the user.
 * @param difficulty - the difficulty level of the user (easy,medium,hard)
 * @param dm_enabled - whether or not the user wants to receive DM's (DISCORD EXCLUSIVE)
 * @param gender - the gender of the in-game character
 */
const UserSchema = new Schema({
  username: {
    type: String,
    required: false
  },
  password: {
    type:String,
    required: false,
  },
  discordid: {
    type: String,
    required: false,
  },
  xp:{
    type:Number,
    required:true,
    default:0,
  },
  xpHistory:{
    type: [Number],
    required: true,
    default: [0],
  },
  items:{ 
    type:[Schema.Types.ObjectId],
    required:false,
  },
  completed:{
    type:[Schema.Types.ObjectId],
    required: false,
  },
  inprogress:{
    type:[Schema.Types.ObjectId],
    required: false,
  },
  difficulty:{
    type:String,
    required:false,
  },
  character:{
    type:String,
    required:false,
    default:"male",
  },
  timezone:{
    type: Number,
    required: true,
    default: 0,
  },
  baselocation:{
    type: String,
    default: function() {
      return this.discordid;
    },
    required: true,
  },
  lastTracked:{
    type: Date,
    default: new Date(),
    required: true,
  },
  numDaysTracked:{
    type: Number,
    default: 0,
    required: true,
  },
  dm_enabled:{
    type:Boolean,
    default: true,
    required:true
  },
},
{collection:"Users"}
);
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
// will encrypt password everytime its saved
UserSchema.pre("save", async function(next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});


module.exports = mongoose.model("User",UserSchema);