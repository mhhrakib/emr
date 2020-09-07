"use strict";


/**
 * The User model.
 */

class User {
  constructor(name, email, type, owns, adderList) {
    this.name = name; //string
    this.email = email; // string
    this.type = type; //string -- doctor/ patient/ lab
    this.owns = owns; // arrayList holds emrID for which belongs to this user
    this.adderList = adderList; //arrayList holds userEmail who can add EMR for this user
  }

  getName() {
    return this.name;
  }

  getEmail() {
    return this.email;
  }

  getType() {
    return this.type;
  }

  getOwns() {
    return this.owns;
  }

  getAdderList() {
    return this.adderList;
  }

  addEMRID(ID) {
    console.info("adding EMR with ID " + ID + " to owns list");
    this.owns.push(ID);
  }

  checkUserInAdderList(email) {
    let pos = this.adderList.indexOf(email);
    if (pos === -1) return false;
    return true;
  }

  // addToAdderList(email) {
  //     // if (checkUserInAdderList(email)) {
  //     //     console.info("user with ID" + email + "already in adder list");
  //     // }
  //     // else {
  //         var added = this.adderList.push(email);
  //         console.info("added user with ID" +  + "to adder list");
  //     // }
  // }

  removeFromAdderList(email) {
    // if (checkUserInAdderList(email)) {
    let pos = this.adderList.indexOf(email);
    let removed = this.adderList.splice(pos, 1);
    console.info("removed user with ID" + email + "from adder list");
    // } else {
    //     console.info("user with ID" + email + "is already not in permitted list!!!!");
    // }
  }

  static deserialize(data) {
    return new User(
      data.name,
      data.email,
      data.type,
      data.owns,
      data.adderList
    );
  }
}

module.exports = User;
