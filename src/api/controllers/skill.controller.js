const Skill = require("../../models/skill.model");
const User = require("../../models/user.model");
const Task = require("../../models/task.model");
const mongoose = require("mongoose");

class SkillController {
  async getAvailableSkills(req, res){
    /*
      #swagger.description = 'Endpoint for retrieving available skills'
      #swagger.tags = ['Skill']
    */
    console.log("CALLED GET AVAILABLE SKILLS")
    console.log("REQ:" + req.body)
    res.status(501).json({
      response: "Not implemented yet!"
    })
  }

  async getSkillsInProgress(req, res) {
    /*
      #swagger.description = 'Endpoint for retrieving in-progress skills'
      #swagger.tags = ['Skill']
      #swagger.responses[200] = {
          description: 'A collection of skills',
          schema: [{
            $ref: '#/definitions/Skill'
          }]
      }
    */
    console.log("GET /skillsInProgress");

    const user = await User.findById(req.headers["userid"]);
    const skills = await Skill.find({
      _id: {$in : user.get("inprogress")},
    });
    res.status(200).json({
      response: "success",
      skills: skills});
  }

  async getSkills(req, res) {
    /*
      #swagger.description = 'Endpoint for retrieving skills'
      #swagger.tags = ['Skill']
      #swagger.responses[200] = {
          description: 'A collection of skills',
          schema: [{
            $ref: '#/definitions/Skill'
          }]
      }
    */
    console.log("GET /skills");

    const skills = await Skill.find({});
    const root = await Skill.find({
      requires: []
    });

    res.status(200).json({
      response: "success",
      skills: skills,
      root: root
    });
  }
  
  async getAllInList(req, res) {
    /*
      #swagger.description = 'Endpoint for retrieving all skills'
      #swagger.tags = ['Skill']
      #swagger.responses[200] = {
          description: 'A collection of skills',
          schema: [{
            $ref: '#/definitions/Skill'
          }]
      }
    */
    console.log("GET /skills/getAllInList");

    const skillIDs = req.headers.skills.replace(/\s/g, "").split(",");
    const skills = await Skill.find({
      _id : {$in : skillIDs}
    });

    res.status(200).json({
      response: "success",
      skills: skills,
    });
  }

  async startSkill(req, res) {
    /*
      #swagger.description = 'Endpoint for starting a skill'
      #swagger.tags = ['Skill']
    */
    console.log("POST /skills/startSkill");

    //Get skill to star
    const skill = await Skill.findById(req.body.skillid);
    const user = await User.findById(req.body.userid);
    
    const task = new Task({
      userID: user.get("_id"),
      skillID: skill.get("_id"),
      startDate: new Date(),
      data: [],
      completed: false,
    });
    task.save();

    //Update the user to start the skill
    user.get("inprogress").push(skill.get("_id"));
    user.save();
    res.status(200).json({response: "success"});
  }

  async skipSkill(req, res) {
    /*
      #swagger.description = 'Endpoint for skipping a skill'
      #swagger.tags = ['Skill']
    */
    console.log("POST /skills/skipSkill");

    //complete without XP
    await User.findByIdAndUpdate(req.body.userid, {
      $addToSet: { completed: req.body.skillid },
    });

    res.status(200).json({response: "success"});
  }

  async revertSkill(req, res) {
    /*
      #swagger.description = 'Endpoint for reverting a skill'
      #swagger.tags = ['Skill']
    */
    console.log("POST /skills/revertSkill");
    //Get skill to revoke
    const skill = await Skill.findById(req.body.skillID);

    //complete without XP
    const user = await User.findByIdAndUpdate(req.body.userid, {
      $pullAll: { inprogress: skill.get("requires")},
    });
    user.save();
    res.status(200).json({response: "success"});
  }

  async cancelSkill(req,res) {
    /*
      #swagger.description = 'Endpoint for cancelling a skill'
      #swagger.tags = ['Skill']
    */
    console.log("POST /skills/cancel");

    await User.findByIdAndUpdate(req.body.userid,{
      $pull: {inprogress: mongoose.Types.ObjectId(req.body.skillid)},
    });

    await Task.findOneAndUpdate({
      userID: req.body.userid,
      skillID: req.body.skillid,
      completed: false,
    },{
      completed: true,
    });

    res.status(200).json({response: "success"});
  }

  async createSkill(req, res) {
    /*
      #swagger.description = 'Endpoint for creating a skill'
      #swagger.tags = ['Skill']
      #swagger.responses[201] = {
          description: 'A skill object',
          schema: {
            $ref: '#/definitions/Skill'
          }
      }
    */
    console.log("POST /skills/create");

    const skill = new Skill(req.body);

    skill.validate(async err => {
      if (err) return res.status(400).json({
        response: "error",
        error: err });

      if (await Skill.findOne({ title: skill.title, level: skill.level }).exec()) {
        return res.status(409).json({
          response: "error",
          error: "Skill already exists." });
      }

      skill.save();

      return res.status(201).json({
        response: "success",
        skill: skill
      });
    });
  }

  async updateSkill(req, res) {
    /*
      #swagger.description = 'Endpoint for updating a skill'
      #swagger.tags = ['Skill']
    */
    console.log("POST /skills/update");

    Skill.findByIdAndUpdate(req.body.id,
      {$set: req.body},
      (err, skill) => {
        if (err) return res.status(400).json({
          response: "error",
          error: err });

        return res.status(200).json({
          response: "success",
          skill: skill
        });
      }
    );
  }

  async deleteSkill(req, res) {
    /*
      #swagger.description = 'Endpoint for deleting a skill'
      #swagger.tags = ['Skill']
    */
    console.log("POST /skills/delete");

    Skill.findByIdAndDelete(req.body.id);
    res.status(200).json({response: "success"});
  }
}

module.exports = new SkillController();
