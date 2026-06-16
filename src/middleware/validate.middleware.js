const AppError = require("../utils/AppError");

const validate = (schema) => {
    return (req, res, next) => {

        const { error, value } = schema.validate(
            req.body, {abortEarly: false, stripUnknown: true}
        );

        if (error) {
          //  console.log(error.details);
            const messages = error.details
                .map(detail => detail.message)
                .join(", ");

            return next(
                new AppError(
                    messages,
                    400
                )
            );
        }

        req.body = value;

        next();
    };
};

module.exports = validate;