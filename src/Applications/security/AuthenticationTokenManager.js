class AuthenticationTokenManager {
  async createRefreshToken(payload) {
    console.log(
      '🚀 ~ AuthenticationTokenManager ~ createRefreshToken ~ payload:',
      payload,
    );
    throw new Error('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
  }

  async createAccessToken(payload) {
    console.log(
      '🚀 ~ AuthenticationTokenManager ~ createAccessToken ~ payload:',
      payload,
    );
    throw new Error('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
  }

  async verifyRefreshToken(token) {
    console.log(
      '🚀 ~ AuthenticationTokenManager ~ verifyRefreshToken ~ token:',
      token,
    );
    throw new Error('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
  }

  async decodePayload() {
    throw new Error('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
  }
}

export default AuthenticationTokenManager;
