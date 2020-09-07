"use strict";

// Fabric smart contract class
const { Contract } = require("fabric-contract-api");

const EMR = require("./emr.js");
const User = require("./user.js");

/**
 * The EMR smart contract
 */
class EMRContract extends Contract {
  /**
   * Initialize the ledger with a few users to start with.
   * @param {Context} ctx the transaction context.
   */
  async initLedger(ctx) {
    const users = [
      {
        name: "John Doe",
        email: "john@gmail.com",
        type: "patient",
      },
      {
        name: "Mitch Starc",
        email: "starc@gmail.com",
        type: "doctor",
      },
      {
        name: "Mitch Johnson",
        email: "johnson@gmail.com",
        type: "patient",
      },
      {
        name: "Stuart Broad",
        email: "broad@gmail.com",
        type: "patient",
      },
      {
        name: "James Anderson",
        email: "jimmy@gmail.com",
        type: "lab",
      },
    ];
    for (let i = 0; i < users.length; i++) {
      await this.addUser(ctx, users[i].name, users[i].email, users[i].type);
    }

    return users;
  }

  // writing separate chaincode to initialize ledger with some EMRs.
  // needs to call grantAddAccess(owner, adder) before calling initEMR
  async initEMR(ctx) {
    const emrs = [
      {
        ID: "01",
        owner: "johnson@gmail.com",
        adder: "starc@gmail.com",
        type: "medical",
        content: `
                *************************************Prescription************************************
                                            Patient Name: Mitch Johnson
                                            Age: 40, Sex: Male
                                            Date: 08.09.2020
                ===================================Case Summary======================================
                The patient is  40-year-old man with hypertension (high blood pressure) and type
                2 diabetes. He has been a long-time customer of this pharmacy. He is here to pick
                up refill prescriptions for his diabetes, which has not been well controlled and also
                presents a new prescription for a burning sensation in his feet.

                =================================History of Present Illness==========================
                Has been seeing current doctor at the Family Medicine Clinic for 10 years. Health has
                been stable and feels well. Patient takes no hypertension medicine.

                ================================Family History=======================================
                Patient’s father died of a heart attack. Mother and sister have type 2 diabetes.

                ================================Recommended Test=====================================
                                Total CBC Count + Urine Test (S. Creatinine + Ketone Body)

                ================================Medication List======================================
                    Name                           Dose                DaysToBeContinued

                    Parasitamol  500 mg         1 + 0 + 1                   7 days
                    Albendazole  100 mg         0 + 0 + 1                   3 days
                    Azithromycin 500 mg         0 + 0 + 1                  14 days
                
                Checked By: Dr. Mitch Starc
                `,
      },

      {
        ID: "02",
        owner: "johnson@gmail.com",
        adder: "jimmy@gmail.com",
        type: "test",
        content: `
                    *************Blood Test Result************
                        Patient Name: Mitch Johnson
                        Age: 40, Sex: Male
                        Ref By: Dr Mitch Starc
                        Test Date: 09.08.2020
                    ==================CBC================
                        Hemoglobin:         14.4
                        PCV:                43.8
                        RBC Count:          5.27
                        MCV:                83.0
                        MCH:                27.2
                        TLC:                11.00
                    ==================DLC================
                        Neutrophils:        66.4
                        Lymphocytes:        24.7
                        Monocytes:          4.9
                        Eosinophils:        3.1
                        Basophils:          0.9     
                        Platelet:           290

                    ===============Comment===============
                                Normal Test Count

                        Checked By: James Anderson
                *******************************************
                `,
      },
    ];

    for (let i = 0; i < emrs.length; i++) {
      // grant add access to adder before adding emr
      //await this.grantAddAccess(ctx, emrs[i].owner, emrs[i].adder);
      await this.addEMR(
        ctx,
        emrs[i].owner,
        emrs[i].adder,
        emrs[i].ID,
        emrs[i].type,
        emrs[i].content
      );
    }
    return emrs;
  }

  /**
   * Adds a new user into the system.
   * @param {Context} ctx The transaction context
   * @param {String} name The name of this user.
   * @param {String} email The email of this user.
   * @param {String} type The type of user doctor/ patient
   */
  async addUser(ctx, name, email, type) {
    // Create a composite key 'User{email}' for this user.
    let key = ctx.stub.createCompositeKey("User", [email]);
    const userAsBytes = await ctx.stub.getState(key);
    //Check whether the corresponding user exists.
    if (userAsBytes.length > 0) {
      console.info("Here is an error");
      // including a lot of thing in error string for debugging purpose
      throw new Error(
        `User with ID: ${email} already exist`
      );
    }
    // as the user is just getting registered it doesn't own any EMR hence a blank array
    var owns = new Array();
    var adderList = new Array();

    // Create a new user object with the input data.
    const user = new User(name, email, type, owns, adderList);
    // Save the user in the datastore.
    await ctx.stub.putState(key, Buffer.from(JSON.stringify(user)));
    console.info("It looks like successful");
    return `User with ID: ${email} successfully added to system`;
  }

  // /**
  //  * Retrieves a user from the system.
  //  * @param {Context} ctx The transaction context
  //  * @param {String} email The email of this user.
  //  */
  // async getUser(ctx, email) {
  //   // Create a composite key 'User{email}' for this user.
  //   const key = ctx.stub.createCompositeKey("User", [email]);
  //   const userAsBytes = await ctx.stub.getState(key);
  //   //Check whether the corresponding user exists.
  //   if (userAsBytes.length === 0) {
  //     throw new Error(`${key} does not exist`);
  //   }

  //   const user = User.deserialize(JSON.parse(userAsBytes.toString()));
  //   return user;
  // }

  // /**
  //  * Add an EMR into the datastore.
  //  * @param {Context} ctx The transaction context
  //  * @param {String} ID The ID of this EMR.
  //  * @param {String} owner(userID = owner email) The email of the user to which EMR belongs.
  //  * @param {String} adder The email of user who added this EMR.
  //  * @param {String} content The content of EMR.
  //  * @param {String} type The type of user doctor/ patient.
  //  * @param {String} creationDate The date of when the EMR was created.
  //  */

  async addEMR(ctx, userID, adder, ID, type, content) {
    // userID is owner email
    // Create a composite key 'User{userID(actually owner email)}' for this user.
    let key = ctx.stub.createCompositeKey("User", [userID]);
    const userAsBytes = await ctx.stub.getState(key);
    //Check whether the corresponding user exists.
    if (userAsBytes.length === 0) {
      throw new Error(
        `User with ID: ${userID} doesn't exist`
      );
    }

    let adderKey = ctx.stub.createCompositeKey("User", [adder]);
    const adderAsBytes = await ctx.stub.getState(adderKey);

    if (adderAsBytes.length === 0) {
      throw new Error(
        `User with ID: ${adder} doesn't exist`
      );
    }
    // deserialize to create an user object from byte representation
    const user = User.deserialize(JSON.parse(userAsBytes.toString()));
    // if adder does not have permission return error
    if (user.checkUserInAdderList(adder) === false) {
      throw new Error(`User with ID: ${adder} does not have permission to add for user: ${userID}`);
    }
    // else insert EMR
    else {
      const emrKey = ctx.stub.createCompositeKey("EMR", [ID]);
      const emrAsBytes = await ctx.stub.getState(emrKey);
      // check if an EMR with that ID already exits
      if (emrAsBytes.length > 0) {
        throw new Error(
          `EMR with ID: ${ID}  already exist`
        );
      } else {
        // add EMR to the user owns list
        user.owns.push(ID); //user.addEMRID(ID);
        // find current date for creationDate
        var getDateString = function () {
          var sp = "/";
          var today = new Date();
          var dd = today.getDate();
          var mm = today.getMonth() + 1; //As January is 0.
          var yyyy = today.getFullYear();
          if (dd < 10) dd = "0" + dd;
          if (mm < 10) mm = "0" + mm;
          return dd + sp + mm + sp + yyyy;
        };
        // add the owner itself to the permitted list
        const permittedList = new Array();
        permittedList.push(userID);
        const emr = new EMR(
          ID, userID, adder, type, content, getDateString(), permittedList);
        // insert EMR
        await ctx.stub.putState(emrKey, Buffer.from(JSON.stringify(emr)));
        // update user
        await ctx.stub.putState(key, Buffer.from(JSON.stringify(user)));
        return `
        EMR with ID: ${ID} successfully added with following info
        owner: ${userID}
        adder: ${adder}
        type: ${type}
        creation date: ${emr.getCreationDate()} 
        `;
      }
    }
  }

  /**
   * View a EMR by ID from the datastore.
   * @param {Context} ctx The transaction context
   * @param {String} ID The ID of this EMR.
   * @param {email} email of the user who wants to view this EMR.
   */
  async getEMR(ctx, emrID, email) {
    // Create a composite key 'EMR{emrID}' for this EMR.
    const key = ctx.stub.createCompositeKey("EMR", [emrID]);
    const emrAsBytes = await ctx.stub.getState(key);
    //Check whether the corresponding EMR exists.
    if (emrAsBytes.length === 0) {
      throw new Error(`EMR with ID: ${emrID} does not exist`);
    }

    let key2 = ctx.stub.createCompositeKey("User", [email]);
    const userAsBytes = await ctx.stub.getState(key2);
    //Check whether the corresponding user exists.
    if (userAsBytes.length === 0) {
      console.info("Here is an error");
      // including a lot of thing in error string for debugging purpose
      throw new Error(
        `User with ID: ${email} doesn't exist`
      );
    }
    // deserialize to create an EMR object from byte representation
    const emr = EMR.deserialize(JSON.parse(emrAsBytes.toString()));
    if (emr.checkUserInPermittedList(email) === true ) {
      return emr.getContent();
    } else {
      throw new Error(`User with ID ${email} doesn't have access permission to EMR with ID: ${emrID}`);
    }
  }

  // /**
  //  * View all EMR owned by a patient.
  //  * @param {Context} ctx The transaction context
  //  * @param {String} name The name of this user.
  //  * @param {String} email The email of this user.
  //  */
  // async viewAllEMR(ctx, email) {
  //   // Create a composite key 'User{email}' for this user.
  //   const key = ctx.stub.createCompositeKey("User", [email]);
  //   const userAsBytes = await ctx.stub.getState(key);
  //   //Check whether the corresponding user exists.
  //   if (userAsBytes.length === 0) {
  //     throw new Error(`${key} does not exist`);
  //   }

  //   const user = User.deserialize(JSON.parse(userAsBytes.toString()));
  //   const emrIDs = user.getOwns();
  //   if (emrIDs.length > 0) {
  //     const emrs = [];
  //     for (let i = 0; i < emrIDs.length; i++) {
  //       const emrKey = ctx.stub.createCompositeKey("EMR", [ID]);
  //       const emrAsBytes = await ctx.stub.getState(emrKey);
  //       const emr = EMR.deserialize(JSON.parse(emrAsBytes.toString()));
  //       emrs.push(emr.getContent());
  //     }
  //     return emrs;
  //   } else {
  //     throw new Error(`${key} does not own any EMR`);
  //   }
  // }

  /**
   * Grant a user access to view contents of EMR.
   * @param {Context} ctx The transaction context
   * @param {String} email The email of the user to whom access will be granted.
   * @param {String} emrID The ID of this EMR.
   */
  async grantViewAccess(ctx, userEmail, viewerEmail, emrID) {
    // Create a composite key 'User{email}' for this user.
    const key = ctx.stub.createCompositeKey("User", [userEmail]);
    const userAsBytes = await ctx.stub.getState(key);
    //Check whether the corresponding user exists.
    if (userAsBytes.length === 0) {
      throw new Error(`User with ID: ${userEmail} does not exist`);
    }

    const key2 = ctx.stub.createCompositeKey("User", [viewerEmail]);
    const userAsBytes2 = await ctx.stub.getState(key2);
    //Check whether the corresponding user exists.
    if (userAsBytes2.length === 0) {
      throw new Error(`User with ID: ${viewerEmail} does not exist`);
    }
    // Create a composite key 'EMR{emrID}' to retrieve the EMR.
    const emrKey = ctx.stub.createCompositeKey("EMR", [emrID]);
    const emrAsBytes = await ctx.stub.getState(emrKey);

    if (emrAsBytes.length === 0) {
      throw new Error(`EMR with ID: ${emrID} does not exist`);
    }
    const emr = EMR.deserialize(JSON.parse(emrAsBytes.toString()));
    // add user email to permitted list of the emr.
    if(emr.getOwner() === userEmail) {
      if (emr.checkUserInPermittedList(viewerEmail) === false) {
        emr.permittedList.push(viewerEmail); //emr.addToPermittedList(email)
        await ctx.stub.putState(emrKey, Buffer.from(JSON.stringify(emr)));
        return `User with ID: ${viewerEmail} has been successfully given view access of EMR with ID: ${emrID}`;
      } else {
        return `User with ID: ${viewerEmail} already has view access`;
      }
      
    } else {
      throw new Error(`User with ID: ${userEmail} doesn't own EMR with ID: ${emrID}`);
    }
  }


  
  async revokeViewAccess(ctx, userEmail, viewerEmail, emrID) {
    // Create a composite key 'User{email}' for this user.
    const key = ctx.stub.createCompositeKey("User", [userEmail]);
    const userAsBytes = await ctx.stub.getState(key);
    //Check whether the corresponding user exists.
    if (userAsBytes.length === 0) {
      throw new Error(`User with ID: ${userEmail} does not exist`);
    }

    const key2 = ctx.stub.createCompositeKey("User", [viewerEmail]);
    const userAsBytes2 = await ctx.stub.getState(key2);
    //Check whether the corresponding user exists.
    if (userAsBytes2.length === 0) {
      throw new Error(`User with ID: ${viewerEmail} does not exist`);
    }
    // Create a composite key 'EMR{emrID}' to retrieve the EMR.
    const emrKey = ctx.stub.createCompositeKey("EMR", [emrID]);
    const emrAsBytes = await ctx.stub.getState(emrKey);

    if (emrAsBytes.length === 0) {
      throw new Error(`EMR with ID: ${emrID} does not exist`);
    }
    const emr = EMR.deserialize(JSON.parse(emrAsBytes.toString()));
    // add user email to permitted list of the emr.
    if(emr.getOwner() === userEmail) {
      if (emr.checkUserInPermittedList(viewerEmail) === true) {
        //emr.permittedList.push(email); //emr.addToPermittedList(email)
        let pos = emr.permittedList.indexOf(viewerEmail);
        emr.permittedList.splice(pos, 1);
        await ctx.stub.putState(emrKey, Buffer.from(JSON.stringify(emr)));
        return ` View access of EMR with ID: ${emrID} has been successfully removed from user with ID: ${viewerEmail}` ;
      } else {
        return `User with ID: ${viewerEmail} doesn't have view access yet`;
      }
      
    } else {
      throw new Error(`User with ID: ${userEmail} doesn't own EMR with ID: ${emrID}`);
    }
  }

  // // /**
  // //  * Revoke a user access to view contents of EMR.
  // //  * @param {Context} ctx The transaction context
  // //  * @param {String} email The email of the user to whom access will be revoked.
  // //  * @param {String} emrID The ID of this EMR.
  // //  */
  // // async revokeViewAccess(ctx, email, emrID) {
  // //   // Create a composite key 'User{name}{email}' for this user.
  // //   const key = ctx.stub.createCompositeKey("User", [email]);
  // //   const userAsBytes = await ctx.stub.getState(key);

  // //   if (userAsBytes.length === 0) {
  // //     throw new Error(`${key} does not exist`);
  // //   }
  // //   // Create a composite key 'EMR{emrID}' to retrieve the EMR.
  // //   const emrKey = ctx.stub.createCompositeKey("EMR", [emrID]);
  // //   const emrAsBytes = await ctx.stub.getState(emrKey);

  // //   if (emrAsBytes.length === 0) {
  // //     throw new Error(`${emrKey} does not exist`);
  // //   }
  // //   const emr = EMR.deserialize(JSON.parse(emrAsBytes.toString()));
  // //   // remove user email to permitted list of the emr.
  // //   if (emr.checkUserInPermittedList(email) === true) {
  // //     //emr.removeFromPermittedList(email);
  // //     let pos = emr.permittedList.indexOf(email);
  // //     emr.permittedList.splice(pos, 1);
  // //   }

  // //   await ctx.stub.putState(emrKey, Buffer.from(JSON.stringify(emr)));
  // //   return emrID;
  // // }

  /**
   * Grants a doctor or a lab-technician access to add EMR for patient
   * @param {Context} ctx the transaction context
   * @param {String} userEmail the user(patient) for whom the access will be granted
   * @param {String} adderEmail the user(doctor/lab) to whom the access will be granted
   */

  async grantAddAccess(ctx, userEmail, adderEmail) {
    // Create a composite key 'User{name}{email}' for this user.
    const key = ctx.stub.createCompositeKey("User", [userEmail]);
    const userAsBytes = await ctx.stub.getState(key);
    const adderKey = ctx.stub.createCompositeKey("User", [adderEmail]);
    const adderAsBytes = await ctx.stub.getState(adderKey);
    //Check whether the corresponding user exists.
    if (userAsBytes.length === 0) {
      throw new Error(`$User with ID: ${userEmail} does not exist`);
    } else if (adderAsBytes.length === 0) {
      throw new Error(`User with ID: ${adderEmail} does not exist`);
    } else {
      let user = User.deserialize(JSON.parse(userAsBytes.toString()));
      // add user email to adder list of the user.
      if (user.checkUserInAdderList(adderEmail) === false) {
        user.adderList.push(adderEmail);
        await ctx.stub.putState(key, Buffer.from(JSON.stringify(user)));
        // return the updated user in ledger too see if updated correctly
        return `User with ID: ${adderEmail} successfully given permission to add EMR for user with ID: ${userEmail}`;
      } else {
        return `User with ID: ${adderEmail} already in adder list`;
      }
    }
  }

  /**
   * Revoke a doctor or a lab-technician access to add EMR for patient
   * @param {Context} ctx the transaction context
   * @param {String} userEmail the user(patient) for whom the access will be removed
   * @param {String} adderEmail the user(doctor/lab) whose access to add will be revoked
   */
  async revokeAddAccess(ctx, userEmail, adderEmail) {
    // Create a composite key 'User{name}{email}' for this user.
    const userKey = ctx.stub.createCompositeKey("User", [userEmail]);
    const userAsBytes = await ctx.stub.getState(userKey);
    //Check whether the corresponding user exists.
    const adderKey = ctx.stub.createCompositeKey("User", [adderEmail]);
    const adderAsBytes = await ctx.stub.getState(adderKey);
    //Check whether the corresponding user exists.
    if (userAsBytes.length === 0) {
      throw new Error(`$User with ID: ${userEmail} does not exist`);
    } else if (adderAsBytes.length === 0) {
      throw new Error(`User with ID: ${adderEmail} does not exist`);
    } else {
      const user = User.deserialize(JSON.parse(userAsBytes.toString()));
      // remove user email to adder list of the user.
      if (user.checkUserInAdderList(adderEmail) === true) {
        //user.removeFromAdderList(adderEmail);
        let pos = user.adderList.indexOf(adderEmail);
        user.adderList.splice(pos, 1);
        await ctx.stub.putState(userKey, Buffer.from(JSON.stringify(user)));
        return `Permission successfully removed from user with ID: ${adderEmail} to add EMR for user with ID: ${userEmail}`;
      }
      return `$User with ${adderEmail} is yet to be in adder list!`;
    }
  }
 }

module.exports = EMRContract;
