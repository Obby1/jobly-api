const express = require("express");
const { ensureLoggedIn, ensureAdmin } = require("../middleware/auth");
const Job = require("../models/job");
const { validate } = require("jsonschema");
const jobNewSchema = require("../schemas/jobNew.json");
const jobUpdateSchema = require("../schemas/jobUpdate.json");
const { BadRequestError } = require("../expressError");

const router = express.Router({ mergeParams: true });

router.post("/", ensureLoggedIn, ensureAdmin, async function (req, res, next) {
    try {
      const validator = validate(req.body, jobNewSchema);
      if (!validator.valid) {
        const errs = validator.errors.map((e) => e.stack);
        throw new BadRequestError(errs);
      }
      const job = await Job.create(req.body);
      return res.status(201).json({ job });
    } catch (err) {
      return next(err);
    }
  });
  
router.get("/", async function (req, res, next) {
    try {
        const jobs = await Job.findAll(req.query);
        return res.json({ jobs });
    } catch (err) {
        return next(err);
    }
});

router.get("/:id", async function (req, res, next) {
    try {
        const job = await Job.get(req.params.id);
        return res.json({ job });
    } catch (err) {
        return next(err);
    }
});

router.get("/companies/:handle", async function (req, res, next) {
    try {
        const jobs = await Job.getJobsFromHandle(req.params.handle);
        return res.json({ jobs });
    } catch (err) {
        return next(err);
    }
});

router.patch("/:id", ensureLoggedIn, ensureAdmin, async function (req, res, next) {
    try {
        if ("id" in req.body || "companyHandle" in req.body) {
            throw new BadRequestError("Not allowed to change 'id' or 'companyHandle'");
        }
        const validator = validate(req.body, jobUpdateSchema);
        if (!validator.valid) {
            const errs = validator.errors.map((e) => e.stack);
            throw new BadRequestError(errs);
        }
        const job = await Job.update(req.params.id, req.body);
    return res.json({ job });
    } catch (err) {
    return next(err);
    }
});

router.delete("/:id", ensureLoggedIn, ensureAdmin, async function (req, res, next) {
    try {
        await Job.remove(req.params.id);
        return res.json({ deleted: req.params.id });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
  