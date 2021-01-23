import development from "./development.config";
import production from "./production.config";
import staging from "./staging.config";
import example from "./example.config";
const env = process.env.NODE_ENV || "example";

const config = {
  example,
  development,
  production,
  staging,
};

export default config[env];
