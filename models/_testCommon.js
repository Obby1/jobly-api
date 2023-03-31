const bcrypt = require("bcrypt");

const db = require("../db.js");
const { BCRYPT_WORK_FACTOR } = require("../config");


let jobId1 = 0;
let jobId2 = 0;

// delete users, companies info and re-insert default info
async function commonBeforeAll() {
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM companies");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM users");
  await db.query("DELETE FROM jobs");

  await db.query(`
    INSERT INTO companies(handle, name, num_employees, description, logo_url)
    VALUES ('c1', 'C1', 1, 'Desc1', 'http://c1.img'),
           ('c2', 'C2', 2, 'Desc2', 'http://c2.img'),
           ('c3', 'C3', 3, 'Desc3', 'http://c3.img')`);

  await db.query(`
        INSERT INTO users(username,
                          password,
                          first_name,
                          last_name,
                          email)
        VALUES ('u1', $1, 'U1F', 'U1L', 'u1@email.com'),
               ('u2', $2, 'U2F', 'U2L', 'u2@email.com')
        RETURNING username`,
      [
        await bcrypt.hash("password1", BCRYPT_WORK_FACTOR),
        await bcrypt.hash("password2", BCRYPT_WORK_FACTOR),
      ]);


    // await db.query(`
    //   INSERT INTO jobs(title, salary, equity, company_handle)
    //   VALUES ('Job2', 150000, 0.2, 'c2'),
    //           ('Job1', 100000, 0.1, 'c1')`);

  const jobRes1 = await db.query(`
    INSERT INTO jobs(title, salary, equity, company_handle)
    VALUES ('Job1', 100000, 0.1, 'c1')
    RETURNING id`);
  jobId1 = jobRes1.rows[0].id;
  console.log(`jobId1 = ${jobId1}`)

  const jobRes2 = await db.query(`
    INSERT INTO jobs(title, salary, equity, company_handle)
    VALUES ('Job2', 150000, 0.2, 'c2')
    RETURNING id`);
  jobId2 = jobRes2.rows[0].id;
  console.log(`jobId2 = ${jobId2}`)
  return { jobId1, jobId2 };
  
}

// start a sql transaction (transactions will be temporary until committed or rolled back)
async function commonBeforeEach() {
  await db.query("BEGIN");
}

// roll back transaction to undo any changes made during the test
async function commonAfterEach() {
  await db.query("ROLLBACK");
}

// sever db connection 
async function commonAfterAll() {
  await db.end();
}


module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  // jobId1,
  // jobId2,
  // getJobIds: () => ({ jobId1 }),
};


// need to add users here too not just in common file for routes. 
//  await Job.create({
//   title: "Job1",
//   salary: 100000,
//   equity: 0.1,
//   companyHandle: "c1",
// });
// await Job.create({
//   title: "Job2",
//   salary: 150000,
//   equity: 0.2,
//   companyHandle: "c2",
// });  

  // let testJob1 = await Job.create({
  //     title: "Job1",
  //     salary: 100000,
  //     equity: 0.1,
  //     companyHandle: "c1",
  //   });
  // let testJob2 = await Job.create({
  //     title: "Job2",
  //     salary: 150000,
  //     equity: 0.2,
  //     companyHandle: "c2",
  //   });