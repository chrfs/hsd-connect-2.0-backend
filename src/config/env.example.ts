/* eslint-disable func-names */
export default (env => {
  const commonProperties = {
    API: {
      VERSION: "1.0.0",
      HOST: "localhost",
      PATH: "/api/v1",
      PORT: 3000
    },
    BCRYPT: {
      SALT_ROUNDS: 14
    },
    JWT: {
      SECRET: "solid-secret",
      EXPIRES_IN: "1h"
    },
    MONGO: {
      HOST: "mongodb://localhost",
      PORT: 27017,
      USERNAME: "hsdconnect-user",
      PASSWORD: "secret",
      DATABASE: "hsdconnect"
    },
    WINSTON: {
      LOG_DIR: "logs",
      LOG_LEVEL: "debug"
    }
  };
  switch (env) {
    case "development": {
      return {
        TYPE: "development",
        ...commonProperties
      };
    }
    case "test": {
      return {
        TYPE: "test",
        ...commonProperties,
        MONGO: {
          HOST: "mongodb://localhost",
          PORT: 27017,
          USERNAME: "hsdconnect-user",
          PASSWORD: "secret",
          DATABASE: "hsdconnect_testing"
        }
      };
    }
    case "production": {
      return {
        TYPE: "production",
        ...commonProperties
      };
    }
    default: {
      /* eslint-disable no-console */
      throw new Error("Your NODE_ENV is invalid!");
    }
  }
})(process.env.NODE_ENV);
