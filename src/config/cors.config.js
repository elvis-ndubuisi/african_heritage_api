const allowOrigins = ["http://localhost:8080", "http://localhost:5000"];

const contributorCORS = {
  origin: "http://localhost:8080",
  methods: ["GET", "POST", "PATCH", "DELETE"],
  optionsSuccessStatus: 200,
  credentials: true,
};

const corsOptionsDelegate = (req, fn) => {
  let corsOptions;
  if (allowOrigins.indexOf(req.header("Origin")) !== -1) {
    // reflect the requested origin in the CORS response.
    corsOptions = { origin: true };
  } else {
    // disable CORS for this request.
    corsOptions = { origin: false };
  }
  fn(null, corsOptions);
};

const apiCORS = {
  origin: true,
  methods: "GET",
  optionsSuccessStatus: 204,
};

module.exports = {
  contributorCORS,
  apiCORS,
  allowOrigins,
  corsOptionsDelegate,
};
