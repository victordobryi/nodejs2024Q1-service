import 'dotenv/config';

export const jwtConfigFactory = () => {
  return {
    secret: process.env.JWT_SECRET_KEY,
    signOptions: {
      expiresIn: process.env.TOKEN_EXPIRE_TIME || '3600s',
    },
  };
};
