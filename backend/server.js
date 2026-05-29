const express = require("express");
const session = require("express-session");
const cors = require("cors");
const dotenv = require("dotenv");
const jsforce = require("jsforce");

dotenv.config();

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "https://salesforce-validation-manager.netlify.app",
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,

    cookie: {
      secure: true,
      httpOnly: true,
      sameSite: "none",
    },
  })
);

const oauth2 = new jsforce.OAuth2({
  loginUrl: process.env.SF_LOGIN_URL,
  clientId: process.env.SF_CLIENT_ID,
  clientSecret: process.env.SF_CLIENT_SECRET,
  redirectUri: process.env.SF_REDIRECT_URI,
});

let originalRules = [];

app.get("/login", (req, res) => {
  res.redirect(oauth2.getAuthorizationUrl());
});

app.get("/oauth2/callback", async (req, res) => {
  const conn = new jsforce.Connection({ oauth2 });

  const code = req.query.code;

  try {
    const userInfo = await conn.authorize(code);

    req.session.accessToken = conn.accessToken;
    req.session.instanceUrl = conn.instanceUrl;
    req.session.userInfo = userInfo;

    console.log("Connected to Salesforce");

    res.redirect("https://salesforce-validation-manager.netlify.app");
  } catch (err) {
    console.log(err);
    res.status(500).send("OAuth Error");
  }
});

app.get("/user", async (req, res) => {
  if (!req.session.accessToken) {
    return res.status(401).json({
      loggedIn: false,
    });
  }

  const conn = new jsforce.Connection({
    instanceUrl: req.session.instanceUrl,
    accessToken: req.session.accessToken,
  });

  try {
    const identity = await conn.identity();

    res.json({
      loggedIn: true,
      username: identity.username,
      organizationId: identity.organization_id,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      error: "Failed to fetch user",
    });
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy();

  res.json({
    success: true,
  });
});

app.get("/validation-rules", async (req, res) => {
  if (!req.session.accessToken) {
    return res.status(401).json({
      error: "Not authenticated",
    });
  }

  const conn = new jsforce.Connection({
    instanceUrl: req.session.instanceUrl,
    accessToken: req.session.accessToken,
  });

  try {
    const result = await conn.tooling.query(`
      SELECT Id, ValidationName, EntityDefinition.QualifiedApiName, Active
      FROM ValidationRule
    `);

    const rules = result.records.map((rule) => ({
      id: rule.Id,
      name: rule.ValidationName,
      object:
        rule.EntityDefinition &&
        rule.EntityDefinition.QualifiedApiName
          ? rule.EntityDefinition.QualifiedApiName
          : "Unknown",
      active: rule.Active,
    }));

    originalRules = JSON.parse(JSON.stringify(rules));

    res.json(rules);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      error: "Failed to fetch validation rules",
    });
  }
});

app.post("/deploy", async (req, res) => {
  if (!req.session.accessToken) {
    return res.status(401).json({
      error: "Not authenticated",
    });
  }

  const conn = new jsforce.Connection({
    instanceUrl: req.session.instanceUrl,
    accessToken: req.session.accessToken,
  });

  const rules = req.body.rules;

  try {
    for (const rule of rules) {

      const metadata =
        await conn.metadata.read(
          "ValidationRule",
          `${rule.object}.${rule.name}`
        );

      metadata.active = rule.active;

      await conn.metadata.update(
        "ValidationRule",
        metadata
      );
    }

    res.json({
      success: true,
      message: "Changes deployed successfully",
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: "Deployment failed",
    });
  }
});


app.get("/rollback", (req, res) => {
  res.json(originalRules);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
