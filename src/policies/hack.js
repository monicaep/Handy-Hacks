const ApplicationPolicy = require("./application");

module.exports = class HackPolicy extends ApplicationPolicy {
  new() {
    return this.user != null;
  }

  create() {
    return this.new();
  }

  edit() {
    return this._isOwner();
  }

  update() {
    return this.edit();
  }

  destroy() {
    return this.update() || this._isAdmin();
  }
}
