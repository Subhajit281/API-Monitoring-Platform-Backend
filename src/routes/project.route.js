const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');

const {
    createProjectSchema,
    updateProjectSchema
} = require('../validators/project.validator');

const {
    createProject,
    getProjects,
    getProjectById,
    updateProject,
    deleteProject
} = require('../controllers/project.controller');

router.post('/',authMiddleware,validate(createProjectSchema),createProject);
router.patch('/:id',authMiddleware,validate(updateProjectSchema),updateProject);
router.get('/',authMiddleware,getProjects);
router.get('/:id',authMiddleware,getProjectById);
router.delete('/:id',authMiddleware,deleteProject);

module.exports = router;