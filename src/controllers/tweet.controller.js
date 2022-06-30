const { TwitterApi } = require("twitter-api-v2");
const TweetSubscriber = require("../models/tweet.model");
const redisClient = require("../helpers/redis_client");
require("dotenv").config();

const client = new TwitterApi({
  clientId: process.env.AH_CLIENT_ID,
  clientSecret: process.env.AH_CLIENT_SECRED,
});

const callbackUrl = "http://localhost:5000/tweet/callback";

const genAuthLink = async (req, res) => {
  const { url, state, codeVerifier } = client.generateOAuth2AuthLink(
    callbackUrl,
    {
      scope: ["tweet.read", "tweet.write", "offline.access", "users.read"],
    }
  );

  //   save state and codeVerifier in redis DB.
  await redisClient.SET(
    state,
    JSON.stringify({ state: state, codeVerifier: codeVerifier }),
    {
      EX: 2700,
    }
  );

  res.redirect(url); // redirect's user to callback url.
};

const verifyCallback = async (req, res, next) => {
  const { state: qState, code } = req.query;

  //   check and get state in redis DB.
  const storedState = await redisClient.GET(qState);
  //   if no state was found, return `state code not found`
  if (!storedState)
    return res.status(404).json({ status: 404, error: "state code not found" });

  // get state and codeverifier from redis DB.
  const { state, codeVerifier } = JSON.parse(storedState);

  if (qState !== state) {
    return res.status(400).send("stored token didn't match");
  }
  client
    .loginWithOAuth2({ code, codeVerifier, redirectUri: callbackUrl })
    .then(
      async ({
        client: loggedClient,
        accessToken,
        refreshToken,
        expiresIn,
      }) => {
        try {
          const { data } = await loggedClient.v2.me();

          // add user data (id, name, username) and tokens to database.
          await TweetSubscriber.create({
            subscriberId: data.id,
            subscriberName: data.name,
            subscriberUsername: data.username,
            access: accessToken,
            refresh: refreshToken,
          });
          res.redirect("https://africanheritage.vercel.app");
        } catch (err) {
          next(err);
        }
      }
    )
    .catch((err) => {
      console.log(err);
      res.status(403).send("invalid verifier or access token");
      //   next(err);
    });
};

const autoPostTweet = async (req, res, next) => {
  console.log(req.body);
  // const {} = client.refreshOAuth2Token(req.body.refresh)
  res.send("tweet");

  // subscribers.forEach((subscriber) => {
  //   const { access, refresh } = subscriber;
  //   const {
  //     client: refreshedClient,
  //     accessToken,
  //     refreshToken: newRefreshToken,
  //   } = client.refreshOAuth2Token(refresh);

  //   res.send("okay");
  // });
  //   const { access, refresh } = await User.findOne();
  // const {
  //   client: refreshedClient,
  //   accessToken,
  //   refreshToken: newRefreshToken,
  // } = await client.refreshOAuth2Token(refresh);
  // refreshedClient.v2
  //   .tweet("testing the api")
  //   .then((data) => {
  //     res.send(data);
  //   })
  //   .catch((err) => {
  //     res.send(err);
  //   });
};

const refreshToken = async (req, res, next) => {};

const conPostContent = async (req, res) => {
  // find users in database and loop through.
  // refresh tokens
};

module.exports = { genAuthLink, verifyCallback, autoPostTweet };
