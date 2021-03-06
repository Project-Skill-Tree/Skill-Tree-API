const Challenge = require("../../models/challenge.model");

class ChallengeController {
  async getChallenges(req, res) {
    console.log("GET /challenges");

    const challenges = await Challenge.find({});
    
    res.status(200).json({
      response: "success",
      challenges: challenges});
  }

  async createChallenge(req, res) {
    console.log("POST /challenges/create");

    const challenge = new Challenge(req.body);

    challenge.save();
    return res.status(201).json({
      response: "success",
      challenge: challenge});
  }

  async updateChallenge(req, res) {
    console.log("POST /challenges/update");

    const challenge = Challenge.findByIdAndUpdate(req.body.id,
      {$set: req.body},
    );

    challenge.save();
    res.status(200).json({response: "success"});
  }

  async deleteChallenge(req, res) {
    console.log("POST /challenges/delete");

    Challenge.findByIdAndDelete(req.body.id);
    res.status(200).json({response: "success"});
  }
}

module.exports = new ChallengeController();
