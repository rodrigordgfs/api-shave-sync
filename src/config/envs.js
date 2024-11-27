import "dotenv/config";

const environment = {
  port: parseInt(process.env.PORT),
  jwt_secret: process.env.JWT_SECRET,
};

export default environment;
