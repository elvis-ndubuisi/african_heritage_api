const contributorCORS = {
  origin: "http://localhost:8080",
  methods: ["GET", "POST", "PATCH", "DELETE"],
  optionsSuccessStatus: 200,
  credentials: true,
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
