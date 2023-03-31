"use strict";


const db = require("../db");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
  } = require("../expressError");


class Job {
    // Create a job (from data), update db, return new job data.
  static async create({ title, salary, equity, companyHandle }) {
    const result = await db.query(
      `INSERT INTO jobs (title, salary, equity, company_handle)
       VALUES ($1, $2, $3, $4)
       RETURNING id, title, salary, equity, company_handle AS "companyHandle"`,
      [title, salary, equity, companyHandle]
    );

    const job = result.rows[0];

    if (!job) throw new BadRequestError("Error creating job");

    return job;
  }

  static async findAll(filters) {
    const { title, minSalary, hasEquity } = filters;
    let query = `SELECT id, title, salary, equity, company_handle AS "companyHandle"
                 FROM jobs`;
    let whereConditions = [];
    let queryValues = [];

    if (title) {
      queryValues.push(`%${title}%`);
      whereConditions.push(`title ILIKE $${queryValues.length}`);
    }

    if (minSalary !== undefined) {
      queryValues.push(minSalary);
      whereConditions.push(`salary >= $${queryValues.length}`);
    }

    if (hasEquity) {
      whereConditions.push("equity > 0");
    }

    if (whereConditions.length > 0) {
      query += " WHERE " + whereConditions.join(" AND ");
    }

    query += " ORDER BY title";
    const jobsRes = await db.query(query, queryValues);
    return jobsRes.rows;
  }

  static async get(id) {
    const jobRes = await db.query(
      `SELECT id, title, salary, equity, company_handle AS "companyHandle"
       FROM jobs
       WHERE id = $1`,
      [id]
    );

    const job = jobRes.rows[0];

    if (!job) throw new NotFoundError(`No job: ${id}`);

    return job;
  }

//   add tests for this later
//   can add filters to this later similar to above
  static async getJobsFromHandle(handle) {
    const jobsRes = await db.query(
      `SELECT id, title, salary, equity, company_handle AS "companyHandle"
       FROM jobs
       WHERE company_handle = $1`,
      [handle]
    );

 

    const jobs = jobsRes.rows;

    if (jobs.length === 0) throw new NotFoundError(`No jobs found for: ${handle}`);

    return jobs;
  }

  static async update(id, data) {
    const { setCols, values } = sqlForPartialUpdate(data, {companyHandle: "company_handle"});
    const idVarIdx = "$" + (values.length + 1);
    const querySql = `UPDATE jobs 
                      SET ${setCols} 
                      WHERE id = ${idVarIdx} 
                      RETURNING id, 
                                title, 
                                salary, 
                                equity,
                                company_handle AS "companyHandle"`;

    const result = await db.query(querySql, [...values, id]);
    const job = result.rows[0];

    if (!job) throw new NotFoundError(`No job: ${id}`);

    return job;
  }

  static async remove(id) {
    const result = await db.query(
      `DELETE FROM jobs
       WHERE id = $1
       RETURNING id`,
      [id]
    );

    const job = result.rows[0];

    if (!job) throw new NotFoundError(`No job: ${id}`);
  }
}

module.exports = Job;

