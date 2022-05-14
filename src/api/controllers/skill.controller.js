const Skill = require("../../models/skill.model");
const User = require("../../models/user.model");
const Task = require("../../models/task.model");
const {intervalToInt} = require("../../modules/TaskHelper");

class SkillController {
  async getSkills(req, res) {
    console.log("GET /skills");

    //Validate API-KEY
    if(req.headers["api_key"] !== process.env.API_KEY){
      res.status(401);//Unauthorised
      return;
    }

    const skills = await Skill.find({});

    res.status(200).json(skills);
  }

  async getAvailableSKills(req, res) {
    console.log("GET skills/available");

    //Validate API-KEY
    if (req.headers["api_key"] !== process.env.API_KEY) {
      res.status(401); //Unauthorised
      return;
    }

    const user = await User.findOne({discordid: req.headers.discordid});

    const completed = user.get("skillscompleted");

    const skills = await Skill.find({
      _id: {$nin : user.get("skillsinprogress")}, //skill not in progress
      $expr: {$setIsSubset: ["$requires", completed]},
    });

    res.status(200).json(skills);
  }

  async createSkill(req, res) {
    //Validate API-KEY
    if (req.headers["api_key"] !== process.env.API_KEY) {
      res.status(401);//Unauthorised
      return;
    }

    console.log("POST /skills");
    const skill = new Skill(req.body);

    skill.validate(async err => {
      if (err) return res.status(400).json({ errCode: 400, message: "Validation failed. Please check your input.", error: err });
      
      if (await Skill.findOne({ title: skill.title, level: skill.level }).exec()) return res.status(409).json({ errCode: 409, message: "Skill already exists." });

      skill.save();

      return res.status(201).json(skill);
    });
  }

  async startSkill(req, res) {
    //Validate API-KEY
    if (req.headers["api_key"] !== process.env.API_KEY) {
      res.status(401);//Unauthorised
      return;
    }

    //Get skill to start
    const skill = await Skill.findOne({title: req.body.title, level: req.body.level});

    const filter = {
      discordid: req.body.discordid,
      skillsinprogress: {$ne : skill.get("id")}, //skill not in progress
    };

    //Add requirement if necessary
    if (skill.get("requires").length !== 0) {
      filter["skillscompleted"] = {$all : skill.get("requires")};
    }

    const user = await User.findOne(filter);

    //If no user found
    if (!user) {
      res.status(409).json({ errCode: 409, message: "No available skills." });
      return;
    }

    //Convert skill to frequency
    //if freq=5 interval=week, becomes 5/7=0.71....
    const freq = skill.get("frequency") / intervalToInt(skill.get("interval"));

    //Get number of instances of skill
    //if timelimit=30 freq=0.71..., 30*0.71 = 21
    const numTasks = Math.floor(skill.get("timelimit") * freq);
    const tasks = new Array(numTasks).fill(0);

    const task = new Task({
      userID: user.get("_id"),
      skillID: skill.get("_id"),
      startDate: new Date(),
      data: tasks,
      completed: false,
    });
    task.save();

    //Update the user to start the skill
    user.get("skillsinprogress").push(skill.get("_id"));
    user.save();

  }
}

module.exports = new SkillController();
