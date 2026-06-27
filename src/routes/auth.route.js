const router = require('express').Router();

const {
    registerUser,
    sendRegistrationOtp,  
    verifyRegistrationOtp,
    loginUser,
    getProfile,
    updateUser,
    deleteUser,
    changePassword,
    requestOtp,
    verifyOtp
} = require('../controllers/auth.controller');

const authMiddleware = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');

const {
    registerSchema,
    loginSchema,
    updateProfileSchema
} = require('../validators/auth.validator');

router.post('/register/send-otp', sendRegistrationOtp);
router.post('/register/verify-otp', verifyRegistrationOtp);

router.post('/register',validate(registerSchema), registerUser); 

router.post(
    '/login',
    validate(loginSchema),
    loginUser
);

router.post(
    '/request-otp',
    // validate(requestOtpSchema), 
    requestOtp
);

router.post(
    '/verify-otp',
    // validate(verifyOtpSchema),
    verifyOtp
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


router.patch(
    '/change-password',
    authMiddleware,
    changePassword
);

router.delete(
    '/delete',
    authMiddleware,
    deleteUser
);

module.exports = router;