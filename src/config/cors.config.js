const contributorCORS = {
//   origin: "http://localhost:8080",
  origin: "https://africanheritage.vercel.app",
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
};
