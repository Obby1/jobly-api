"use strict";

const db = require("../db.js");
const User = require("../models/user");
const Company = require("../models/company");
const { createToken } = require("../helpers/tokens");
const Job = require("../models/job.js");

// const testJobIds = {};
// let jobId1 = 0;
// let jobId2 = 0;

const testJobIds = [];

async function commonBeforeAll() {
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM users");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM companies");
  await db.query("DELETE FROM jobs");

  await Company.create(
      {
        handle: "c1",
        name: "C1",
        numEmployees: 1,
        description: "Desc1",
        logoUrl: "http://c1.img",
      });
  await Company.create(
      {
        handle: "c2",
        name: "C2",
        numEmployees: 2,
        description: "Desc2",
        logoUrl: "http://c2.img",
      });
  await Company.create(
      {
        handle: "c3",
        name: "C3",
        numEmployees: 3,
        description: "Desc3",
        logoUrl: "http://c3.img",
      });

  await User.register({
    username: "u1",
    firstName: "U1F",
    lastName: "U1L",
    email: "user1@user.com",
    password: "password1",
    isAdmin: false,
  });
  await User.register({
    username: "u2",
    firstName: "U2F",
    lastName: "U2L",
    email: "user2@user.com",
    password: "password2",
    isAdmin: false,
  });
  await User.register({
    username: "u3",
    firstName: "U3F",
    lastName: "U3L",
    email: "user3@user.com",
    password: "password3",
    isAdmin: false,
  });
  await User.register({
    username: "a1",
    firstName: "a1f",
    lastName: "a1l",
    email: "admin1@admin.com",
    password: "password3",
    isAdmin: true,
  });
  // let job1 = await Job.create({
  testJobIds[0] = (await Job.create(
      { title: "Job1", salary: 100000, equity: 0.1, companyHandle: "c1" })).id;
  // await Job.create({
  //   title: "Job1",
  //   salary: 100000,
  //   equity: 0.1,
  //   companyHandle: "c1",
  // });
  // jobId1 = job1.id
  // testJobIds.jobId1 = job1.id;
  // console.log(`job1: ${job1}`);
  // console.log(`job1.id: ${job1.id}`);
  // console.log(`testJobIds.jobId1: ${testJobIds.jobId1}`);
  // let job2 = await Job.create({
  await Job.create({
    title: "Job2",
    salary: 150000,
    equity: 0.2,
    companyHandle: "c2",
  });  
  // jobId2 = job2.id
  // return { jobId1: job1.id, jobId2: job2.id };
  // return {jobId1, jobId2}

}



async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}

// async function getJobIds() {
//   const jobs1 = await Job.findAll({ title: "Job1" });
//   const jobs2 = await Job.findAll({ title: "Job2" });
//   const job1 = jobs1[0];
//   const job2 = jobs2[0];

//   return { jobId1: job1.id, jobId2: job2.id };
// }

const u1Token = createToken({ username: "u1", isAdmin: false });
const u2Token = createToken({ username: "u2", isAdmin: false });
const a1Token = createToken({ username: "a1", isAdmin: true });


module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token,
  a1Token,
  testJobIds,
  // getJobIds,
};



// "username": "u2",
// "firstName": "U2F",
// "lastName": "U2L",
// "email": "user2@user.com",
// "password": "password2",
// "isAdmin": false,
// {
//   "username": "obby1",
//   "firstName": "obby",
//   "lastName": "obbyd",
//   "email": "obby@user.com",
//   "password": "password1",
//   "isAdmin": true
    
//   }

// {
//   "username": "obby1",
//   "firstName": "obby",
//   "lastName": "obbyd",
//   "email": "obby@user.com",
//   "password": "password1"	
//   }


// {
// 	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im9iYnkxIiwiaXNBZG1pbiI6dHJ1ZSwiaWF0IjoxNjgwMTIyODA2fQ.L8FZZf-nNiBH4X8szZGSDUJXWeyDkcfmdo8pvD4I5eI"
// }