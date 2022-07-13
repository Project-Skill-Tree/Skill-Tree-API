const Skill = require("../../models/skill.model");
const Item = require("../../models/item.model");
const Challenge = require("../../models/challenge.model");

class Controller {
  async getNodes(req, res) {
    console.log("GET /getNodes");

    const skills = await Skill.find({});
    const items = await Item.find({});
    const challenges = await Challenge.find({});
    const root = await Skill.find({
      requires: []
    });

    res.status(200).json({
      response: "success",
      skills: skills,
      items: items,
      challenges: challenges,
      root: root,
    });
  }

  async getStatus(req, res) {
    console.log("GET /status");
    res.status(200).json({response: "success"});
  }
}

module.exports = new Controller();