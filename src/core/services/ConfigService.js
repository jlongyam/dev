// core/services/ConfigService.js
class ConfigService {
  constructor() {
    this._config = {};
    this._env = process.env.NODE_ENV || 'development';
  }

  load(config) {
    this._config = {
      ...this._getDefaultConfig(),
      ...config
    };
  }

  get(key, defaultValue = undefined) {
    const keys = key.split('.');
    let value = this._config;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return defaultValue;
      }
    }
    
    return value !== undefined ? value : defaultValue;
  }

  get env() {
    return this._env;
  }

  _getDefaultConfig() {
    return {
      app: {
        name: 'MyCrossPlatformApp',
        version: '1.0.0'
      },
      api: {
        baseUrl: this._env === 'production' 
          ? 'https://api.example.com' 
          : 'https://dev.api.example.com'
      }
    };
  }
}

export default ConfigService;