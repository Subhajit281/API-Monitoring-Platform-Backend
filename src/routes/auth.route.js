const router = require('express').Router();

const {
    registerUser,
    loginUser,
    getProfile,
    updateUser,
    deleteUser
} = require('../controllers/auth.controller');

const authMiddleware = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');

const {
    registerSchema,
    loginSchema,
    updateProfileSchema
} = require('../validators/auth.validator');

router.post(
    '/register',
    validate(registerSchema),
    registerUser
);

router.post(
    '/login',
    validate(loginSchema),
    loginUser
);

router.get(
    '/profile',
    authMiddleware,
    getProfile
);

router.patch(
    '/update',
    authMiddleware,
    validate(updateProfileSchema),
    updateUser
);

router.delete(
    '/delete',
    authMiddleware,
    deleteUser
);

module.exports = router;