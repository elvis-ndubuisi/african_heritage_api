const whiteList = ["http://localhost:8080"];

const contributorCORS = {
  origin: (origin, callback) => {
    if (whiteList.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PATCH", "DELETE"],
  optionsSuccessStatus: 204,
  credentials: true,
};

const apiCORS = {
  origin: "*",
  methods: "GET",
  optionsSuccessStatus: 204,
};

module.exports = { contributorCORS, apiCORS };
