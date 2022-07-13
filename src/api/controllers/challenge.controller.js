const Challenge = require("../../models/challenge.model");

class ChallengeController {
  async getChallenges(req, res) {
    /*
      #swagger.description = 'Endpoint for retrieving challenges'
      #swagger.tags = ['Challenge']
      #swagger.response[200] = {
          description: 'Retrieves a challenge',
          schema: {
            $ref: '#/definitions/Challenge'
          }
      }
    */
    console.log("GET /challenges");

    const challenges = await Challenge.find({});
    
    res.status(200).json({
      response: "success",
      challenges: challenges});
  }

  async createChallenge(req, res) {
    /*
      #swagger.description = 'Endpoint for creating a challenge'
      #swagger.tags = ['Challenge']
      #swagger.response[200] = {
          description: 'Retrieves the newly created challenge',
          schema: {
            $ref: '#/definitions/Challenge'
          }
      }
    */
    console.log("POST /challenges/create");

    const challenge = new Challenge(req.body);

    challenge.save();
    return res.status(201).json({
      response: "success",
      challenge: challenge});
  }

  async updateChallenge(req, res) {
    /*
      #swagger.description = 'Endpoint for updating a challenge'
      #swagger.tags = ['Challenge']
    */
    console.log("POST /challenges/update");

    const challenge = Challenge.findByIdAndUpdate(req.body.id,
      {$set: req.body},
    );

    challenge.save();
    res.status(200).json({response: "success"});
  }

  async deleteChallenge(req, res) {
    /*
      #swagger.description = 'Endpoint for deleting a challenge'
      #swagger.tags = ['Challenge']
    */
    console.log("POST /challenges/delete");

    Challenge.findByIdAndDelete(req.body.id);
    res.status(200).json({response: "success"});
  }
}

module.exports = new ChallengeController();
