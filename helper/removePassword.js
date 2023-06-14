// Exclude keys from user
function removePassword(user, keys) {
  for (let key of keys) {
    delete user[key];
  }
  return user;
}

module.exports = removePassword;
