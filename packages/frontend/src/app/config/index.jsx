import development from './development.config';
import staging from './staging.config';
import production from './production.config';

const env = process.env.REACT_APP_ENV || 'production';

const config = {
  development,
  production,
  staging,
};

export default config[env];
