class PasswordHash {
  async hash(password) {
    console.log('🚀 ~ PasswordHash ~ hash ~ password:', password);
    throw new Error('PASSWORD_HASH.METHOD_NOT_IMPLEMENTED');
  }

  async comparePassword(plain, encrypted) {
    console.log('🚀 ~ PasswordHash ~ comparePassword ~ encrypted:', encrypted);
    console.log('🚀 ~ PasswordHash ~ comparePassword ~ plain:', plain);
    throw new Error('PASSWORD_HASH.METHOD_NOT_IMPLEMENTED');
  }
}

export default PasswordHash;
