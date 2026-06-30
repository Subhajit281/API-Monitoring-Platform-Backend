const crypto = require("crypto");
const redis = require("../config/redis");
const { GOOGLE_CONFIG } = require("../config/oauth.config");
const axios = require("axios");
const { OAuth2Client } = require("google-auth-library");
const prisma = require("../config/prisma");
const { generateToken } = require("./auth.service");
const AppError = require("../utils/AppError");


const GOOGLE_SCOPES = ["openid","email","profile",];
const OAUTH_STATE_EXPIRY = 300; 
const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL ="https://oauth2.googleapis.com/token";
const googleClient = new OAuth2Client(GOOGLE_CONFIG.clientId);

const generateState = () => {
    return crypto.randomBytes(32).toString("hex");
};

const saveState = async (state) => {
    
    await redis.set(
        `oauth:state:${state}`,
        JSON.stringify({
            provider: "google",
            createdAt: Date.now(),
        }),
        "EX",
        OAUTH_STATE_EXPIRY 
    );
};

const buildGoogleAuthUrl = (state) => {
    
    const params = new URLSearchParams({
        client_id: GOOGLE_CONFIG.clientId,
        redirect_uri: GOOGLE_CONFIG.redirectUri,
        response_type: "code",
        scope: GOOGLE_SCOPES.join(" "),
        state,
        access_type: "offline",
        prompt: "select_account",
    });

   return `${GOOGLE_AUTH_URL}?${params.toString()}`;
};

const getGoogleAuthUrl = async () => {
    const state = generateState();

    await saveState(state);

    return buildGoogleAuthUrl(state);
};

const verifyState = async (state) => {
    const key = `oauth:state:${state}`;

    const data = await redis.get(key);

    if (!data) {
        throw new AppError(
            "Invalid or expired OAuth state",
            401
        );
    }

    try {
        const stateData = JSON.parse(data);

        if (stateData.provider !== "google") {
            throw new AppError(
                "Invalid OAuth provider.",
                401
            );
        }

        return true;
    } finally {
        await redis.del(key);
    }
};

const exchangeCodeForTokens = async (code) => {
    const response = await axios.post(
        GOOGLE_TOKEN_URL,
        {
            code,
            client_id: GOOGLE_CONFIG.clientId,
            client_secret: GOOGLE_CONFIG.clientSecret,
            redirect_uri: GOOGLE_CONFIG.redirectUri,
            grant_type: "authorization_code",
        }
    );

    return response.data;
};

const verifyGoogleToken = async (idToken) => {
    const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: GOOGLE_CONFIG.clientId,
    });

    const payload = ticket.getPayload();

    return {
        googleId: payload.sub,
        email: payload.email,
        name: payload.name,
        emailVerified: payload.email_verified,
    };
};

const handleGoogleCallback = async ({ code, state }) => {

    if (!code || !state) {
        throw new AppError(
            "Invalid OAuth callback.",
            400
        );
    }

    await verifyState(state);

    let tokens;

    try {
        tokens = await exchangeCodeForTokens(code);
    } catch (error) {
        throw new AppError(
            "Google authentication failed.",
            401
        );
    }

    let googleUser;

    try {
        googleUser = await verifyGoogleToken(tokens.id_token);
    } catch (error) {
        throw new AppError(
            "Invalid Google ID token.",
            401
        );
    }

    const user = await findOrCreateGoogleUser(googleUser);

    const accessToken = generateToken(user);

    return {
        accessToken,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
        },
    };
};

const findOrCreateGoogleUser = async ({
    email,
    name,
    googleId,
    emailVerified,
}) => {

    if (!emailVerified) {
        throw new AppError(
            "Google account email is not verified.",
            401
        );
    }

    let user = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    // Existing user
    if (user) {

        if (user.googleSub && user.googleSub !== googleId) {
            throw new AppError(
                "This email is already linked with another Google account.",
                409
            );
        }

        // Link Google account if not already linked
        if (!user.googleSub) {
            user = await prisma.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    googleSub: googleId,
                    isVerified: true,
                },
            });
        }

        return user;
    }
    

    // First Google login
    user = await prisma.user.create({
        data: {
            name,
            email,
            password: null,
            googleSub: googleId,
            isVerified: true,
        },
    });

    return user;
};


module.exports = {
    getGoogleAuthUrl,
    verifyState,
    exchangeCodeForTokens,
    verifyGoogleToken,
    handleGoogleCallback,
    findOrCreateGoogleUser, 
};