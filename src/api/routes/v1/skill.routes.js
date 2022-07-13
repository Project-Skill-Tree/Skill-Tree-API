const express = require("express");
const path = require('path')
const auth = require("../../middlewares/auth");
const SkillController = require("../../controllers/skill.controller");

const router = express.Router();
const prefix = "/" + path.basename(__dirname) + "/" + path.basename(__filename).split(".")[0] + "s"
// const prefix = "/v1/skills"

router.get(prefix+"/", auth, SkillController.getSkills);
// router.get("/available", auth, SkillController.getAvailableSkills);
router.post(prefix+"/createSkill", auth, SkillController.createSkill);
router.post(prefix+"/startSkill", auth, SkillController.startSkill);
router.post(prefix+"/skipSkill", auth, SkillController.skipSkill);
router.post(prefix+"/revertSkill", auth, SkillController.revertSkill);
router.post(prefix+"/cancelSkill", auth, SkillController.cancelSkill);
router.get(prefix+"/inProgress", auth, SkillController.getSkillsInProgress);
router.put(prefix+"/updateSkill", auth, SkillController.updateSkill);
router.delete(prefix+"/deleteSkill", auth, SkillController.deleteSkill);
router.get(prefix+"/getAllInList", auth, SkillController.getAllInList);

module.exports = router;
