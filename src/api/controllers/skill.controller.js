const Skill = require('../../models/skill.model');

class SkillController {
  async getSkills(req, res) {
    console.log('GET /skills');

    //Validate API-KEY
    if(req.headers["api_key"] !== process.env.API_KEY){
      res.status(401);//Unauthorised
      return;
    }

    const skills = await Skill.find({});
    console.log(skills)

    res.status(200).json(skills);
  }

  createSkill(req, res) {
    console.log('POST /skills');
    const skill = new Skill(req.body);

    skill.validate(async err => {
      if (err) return res.status(400).json({ errCode: 400, message: "Validation failed. Please check your input.", error: err });
      
      if(await Skill.findOne({ title: skill.title, level: skill.level }).exec()) return res.status(409).json({ errCode: 409, message: "Skill already exists." });

      skill.save();

      return res.status(201).json(skill);
    })


  }

  editSkill(req, res) { }

  deleteSkill(req, res) { }
}

module.exports = new SkillController();
