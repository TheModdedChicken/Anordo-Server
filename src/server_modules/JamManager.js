const Jam = require("./Jam");

class JamManager {
  constructor(id) {
    this.id = id;
    this.jams = {};

    this.addJam = this.addJam.bind(this);
    this.addJams = this.addJams.bind(this);
    this.removeJam = this.removeJam.bind(this);
  }
  /**
   * 
   * @param {Jam} jam 
   */
  addJam(jam) {
    this.jams[jam.id] = jam;
    return this;
  }
  /**
   * 
   * @param {Jam[]} jams 
   */
  addJams(jams) {
    for (const jam of jams) {
      this.jams[jam.id] = jam;
    }
    return this;
  }
  /**
   * 
   * @param {String} id ID of jam
   */
  removeJam(id) {
    delete this.jams[id];
  }
  /**
   * 
   * @param {{name: string, public: boolean, width: number, height: number, hostKey: string, id: string}} filters Search filters
   * @returns {Jam[]}
   */
  listJams(filters = null) {
    const jamIDs = Object.keys(this.jams);
    var out = [];


    for (const jamID of jamIDs) {
      if (filters === null) {
        out.push(this.jams[jamID]);
      } else {
        const filterKeys = Object.keys(filters);
        var meetsAll = true;
        for (const filter of filterKeys) {
          if (this.jams[jamID][filter] !== filters[filter]) {
            meetsAll = false;
          }
        }
        if (meetsAll === true) out.push(this.jams[jamID]);
      }
    }

    return out;
  }
  /**
   * 
   * @param {string} id ID of jam
   * @param {{name: string, public: boolean, width: number, height: number}} variables Variables to edit
   */
  editJam(id, variables) {
    const jam = this.listJams({id: id});
    if (jam.length <= 0) return false;
    if (!variables) return new Error("No variables specified (editJam)");

    const variableKeys = Object.keys(variables);
    if (variableKeys <= 0) return new Error("No variables specified (editJam)");

    for (const variable of variableKeys) {
      if (["hostKey", "id", "lastInteraction"].includes(variable) === false) this.jams[jam[0].id][variable] = variables[variable];
    }

    return true
  }
}

module.exports = JamManager;