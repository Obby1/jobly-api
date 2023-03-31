"use strict";

/** Routes for companies. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureLoggedIn, ensureAdmin } = require("../middleware/auth");
const Company = require("../models/company");

const companyNewSchema = require("../schemas/companyNew.json");
const companyUpdateSchema = require("../schemas/companyUpdate.json");

const router = new express.Router();


/* 
POST to /companies 
{ handle, name, description, numEmployees, logoUrl } =>  { company }
Authorization required: login
*/
router.post("/", ensureAdmin, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, companyNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const company = await Company.create(req.body);
    return res.status(201).json({ company });
  } catch (err) {
    return next(err);
  }
});

/*
 GET to /companies  
 => { companies: [ { handle, name, description, numEmployees, logoUrl }, ...] }
 * Can filter on provided search filters:
 * - minEmployees
 * - maxEmployees
 * - nameLike (will find case-insensitive, partial matches)
Authorization required: none
*/
router.get("/", async function (req, res, next) {
  try {
    // create filters object from query string, assign int to values, and pass to findAll
    const filters = req.query;
    // check if minEmployees filter is present and convert to integer
    if (filters.minEmployees !== undefined) {
      filters.minEmployees = parseInt(filters.minEmployees);
    }
    // check if maxEmployees filter is present and convert to integer
    if (filters.maxEmployees !== undefined) {
      filters.maxEmployees = parseInt(filters.maxEmployees);
    }
    // check if minEmployees is greater than maxEmployees & throw error if true
    if (
      filters.minEmployees !== undefined &&
      filters.maxEmployees !== undefined &&
      filters.minEmployees > filters.maxEmployees
    ) {
      throw new BadRequestError(
        "minEmployees cannot be greater than maxEmployees"
      );
    }
    const companies = await Company.findAll(filters);
    return res.json({ companies });
  } catch (err) {
    return next(err);
  }
});



/** GET /[handle]  =>  { company }
 *
 *  Company is { handle, name, description, numEmployees, logoUrl, jobs }
 *   where jobs is [{ id, title, salary, equity }, ...]
 *
 * Authorization required: none
 */

router.get("/:handle", async function (req, res, next) {
  try {
    const company = await Company.get(req.params.handle);
    return res.json({ company });
  } catch (err) {
    return next(err);
  }
});

/** PATCH /[handle] { fld1, fld2, ... } => { company }
 *
 * Patches company data.
 *
 * fields can be: { name, description, numEmployees, logo_url }
 *
 * Returns { handle, name, description, numEmployees, logo_url }
 *
 * Authorization required: login
 */

router.patch("/:handle", ensureAdmin, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, companyUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const company = await Company.update(req.params.handle, req.body);
    return res.json({ company });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /[handle]  =>  { deleted: handle }
 *
 * Authorization: login
 */

router.delete("/:handle", ensureAdmin, async function (req, res, next) {
  try {
    await Company.remove(req.params.handle);
    return res.json({ deleted: req.params.handle });
  } catch (err) {
    return next(err);
  }
});


module.exports = router;
