class AuthenticationRepository {
  async addToken(token) {
    console.log('🚀 ~ AuthenticationRepository ~ addToken ~ token:', token);
    throw new Error('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async checkAvailabilityToken(token) {
    console.log(
      '🚀 ~ AuthenticationRepository ~ checkAvailabilityToken ~ token:',
      token,
    );
    throw new Error('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async deleteToken(token) {
    console.log('🚀 ~ AuthenticationRepository ~ deleteToken ~ token:', token);
    throw new Error('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

export default AuthenticationRepository;
