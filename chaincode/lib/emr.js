"use strict";

/**
 * The EMR model.
 */
class EMR {
  constructor(ID, owner, adder, type, content, creationDate, permittedList) {
    this.ID = ID; //string -- unique identifier for an EMR
    this.owner = owner; // string -- user Email
    this.adder = adder; // string -- the userEmail who added this EMR
    this.type = type; //medical record / test
    this.content = content; // string
    this.creationDate = creationDate; // string
    this.permittedList = permittedList; // this array will hold userEmails who have access to this EMR
  }

  //getter and setters
  getID() {
    return this.ID;
  }

  getOwner() {
    return this.owner;
  }

  getAdder() {
    return this.adder;
  }

  getType() {
    return this.type;
  }

  getCreationDate() {
    return this.creationDate;
  }

  getContent() {
    return this.content;
  }

  getPermittedList() {
    return this.permittedList;
  }

  checkUserInPermittedList(ID) {
    let pos = this.permittedList.indexOf(ID);
    if (pos === -1) return false;
    return true;
  }

  addToPermittedList(ID) {
    // if (checkUserInPermittedList(ID)) {
    //     console.info("user with ID" + ID + "already in permitted list");

    // }
    // else {
    var added = this.permittedList.push(ID);
    console.info("added user with ID" + ID + "to permitted list");
    // }
  }

  removeFromPermittedList(ID) {
    // if (checkUserInPermittedList(ID)) {
    let pos = this.permittedList.indexOf(ID);
    let removed = this.permittedList.splice(pos, 1);
    console.info("removed user with ID" + ID + "from permitted list");
    // } else {
    //     console.info("user with ID" + ID + "is already not in permitted list!!!!");
    // }
  }

  static deserialize(data) {
    return new EMR(
      data.ID,
      data.owner,
      data.adder,
      data.type,
      data.content,
      data.creationDate,
      data.permittedList
    );
  }
}

module.exports = EMR;
