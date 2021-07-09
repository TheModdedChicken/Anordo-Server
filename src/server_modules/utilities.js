
/**
 * @param {number} length
 * @param {String} characters
 */
module.exports.generateCode = (length, characters) => {
  if (!characters) characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var out = "";

  for (var i = 0; i < length; i++) {
    var char = Math.floor(Math.random() * characters.length);
    out += characters.slice(char, char + 1);
  }
  return out;
}