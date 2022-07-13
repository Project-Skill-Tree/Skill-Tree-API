const Skill = require("../../models/skill.model");
const Item = require("../../models/item.model");
const Challenge = require("../../models/challenge.model");

class Controller {
  async getNodes(req, res) {
    /*
      #swagger.description = 'Endpoint for retrieving nodes (development only?)'
      #swagger.tags = ['Controller']
    */
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
}

module.exports = new Controller();