const JamManager = require('./JamManager');
const { generateCode } = require('./utilities');

class Jam {
  /**
   * 
   * @param {String} name Name of jam
   * @param {{public: boolean, width: number, height: number, description: string, hostID: string}} settings Jam settings
   * @param {JamManager} jamManager JamManager to add jam to
   */
  constructor(settings, jamManager = null) {
    this.id = jamManager ? generateJamID(jamManager) : null;
    this.name = settings.name ? settings.name : generateJamName();
    this.description = settings.description ? settings.description : null;
    this.hostID = settings.hostID ? settings.hostID : null;
    this.hostKey = generateJamAdminToken();
    this.public = settings.public ? settings.public : false;
    this.width = settings.width ? settings.width : 500;
    this.height = settings.height ? settings.height : 500;
    this.lastInteraction = new Date();

    if (jamManager) jamManager.addJam(this);
  }
}

module.exports = Jam;

function generateJamName() {
  var currentDate = new Date();
  return "Jam-" + currentDate.getMilliseconds() + "" + currentDate.getHours();
}

/**
 * 
 * @param {JamManager} jamManager 
 * @returns 
 */
function generateJamID (jamManager) {
  const jams = jamManager.listJams();
  var id = generateCode(8);
  for (const jam of jams) {
    if (jam.id === id) id = generateJamID();
  }
  return id;
}

function generateJamAdminToken () {return generateCode(20, "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890!@$")};