class UserRepository {
  async addUser(registerUser) {
    console.log('🚀 ~ UserRepository ~ addUser ~ registerUser:', registerUser);
    throw new Error('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async verifyAvailableUsername(username) {
    console.log(
      '🚀 ~ UserRepository ~ verifyAvailableUsername ~ username:',
      username,
    );
    throw new Error('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async getPasswordByUsername(username) {
    console.log(
      '🚀 ~ UserRepository ~ getPasswordByUsername ~ username:',
      username,
    );
    throw new Error('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async getIdByUsername(username) {
    console.log('🚀 ~ UserRepository ~ getIdByUsername ~ username:', username);
    throw new Error('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

export default UserRepository;
