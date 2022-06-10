const allowOrigins = ["http://localhost:8080", "http://localhost:5000"];

const contributorCORS = {
  origin: (origin, callback) => {
    if (allowOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PATCH", "DELETE"],
  optionsSuccessStatus: 200,
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
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
  origin: "*",
  methods: "GET",
  optionsSuccessStatus: 204,
};

module.exports = {
  contributorCORS,
  apiCORS,
  allowOrigins,
  corsOptionsDelegate,
};
