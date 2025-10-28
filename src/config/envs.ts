import "dotenv/config";
import * as joi from "joi";

interface EnvVars {
  PORT: number;
  USER_MICROSERVICE_HOST: string;
  USER_MICROSERVICE_PORT: number;
  MOVIE_MICROSERVICE_HOST: string;
  MOVIE_MICROSERVICE_PORT: number;
}

const envSchema = joi.object({
  PORT: joi.number().default(3000),
  USER_MICROSERVICE_HOST: joi.string().required().default('localhost'),
  USER_MICROSERVICE_PORT: joi.number().required().default(3001),
  MOVIE_MICROSERVICE_HOST: joi.string().required().default('localhost'),
  MOVIE_MICROSERVICE_PORT: joi.number().required().default(3002),
})
.unknown(true);

const { error, value } = envSchema.validate(process.env);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

export const envs: EnvVars = {
    PORT: value.PORT,
    USER_MICROSERVICE_HOST: value.USER_MICROSERVICE_HOST,
    USER_MICROSERVICE_PORT: value.USER_MICROSERVICE_PORT,
    MOVIE_MICROSERVICE_HOST: value.MOVIE_MICROSERVICE_HOST,
    MOVIE_MICROSERVICE_PORT: value.MOVIE_MICROSERVICE_PORT,
};