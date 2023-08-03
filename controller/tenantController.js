const Tenant = require("../models/tenant");

router.post("/tenant/register", async (req, res) => {
  try {
    let tenant = await Tenant.findOne({ name: req.body.name });
    if (tenant) {
      return res.status(400).json({ msg: "Tenant already exists" });
    }

    tenant = new Tenant({
      name: req.body.name,
      contactEmail: req.body.contactEmail,
      subscriptionPlan: req.body.subscriptionPlan,
    });

    await tenant.save();

    res.status(201).json({ msg: "Tenant registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});
