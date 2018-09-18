/* eslint-disable func-names */
export default (env => {
  switch (env) {
    case 'development': {
      return {
        TYPE: 'development',
        API: {
          VERSION: '1.0.0',
          HOST: 'localhost',
          PATH: '/api/v1',
          RELATIVE_PATH: './api/v1',
          PORT: 3000
        },
        BCRYPT: {
          SALT_ROUNDS: 14
        },
        JWT: {
          SECRET: 'secret',
          EXPIRES_IN: '1h'
        },
        MONGO: {
          USERNAME: 'user',
          PASSWORD: 'secret'
        }
      }
    }
    case 'production': {
      return {}
    }
    default: {
      throw new Error('Your NODE_ENV is invalid!')
    }
  }
})(process.env.NODE_ENV)
