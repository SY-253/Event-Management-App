const mongoose = require("mongoose");
const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");

const PORT_NUMBER = 8080;
const url = "mongodb://127.0.0.1:27017/ema";

async function connect(url) {
  await mongoose.connect(url);
  return "Connected Successfully";
}

connect(url)
  .then(console.log)
  .catch((err) => console.log(err));

const routerCategory = require("./backend/routes/category").router;
const routerEvent= require("./backend/routes/event").router;
const routerOperation = require("./backend/controllers/operation").router;
const categoryApi = require("./backend/routes/category-api");

app.use(express.json());

process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(__dirname, '/fit2095.json');

const { Translate } = require('@google-cloud/translate').v2;
const translate = new Translate();

const textToSpeech = require('@google-cloud/text-to-speech');
const client = new textToSpeech.TextToSpeechClient();

app.use("/", express.static(path.join(__dirname, "./dist/ema-angular")));
app.use(express.static(path.join(__dirname, "./backend/images")));

app.use(express.urlencoded({ extended: true }));
app.use("/", routerOperation);
app.use("/32880545", routerCategory);
app.use("/bryan", routerEvent);
app.use("/api/v1/category/32880545", categoryApi)

app.use(express.urlencoded({ extended: false }));

const server = require("http").Server(app);

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

let text = {
  originalText: '',
  translatedText: '',
  language: '',
};

io.on("connection", (socket) => {
  console.log("new connection made from client with ID=" + socket.id);

  socket.on("languageTranslate", async (data) => {
    try {
      console.log("Server received! Do translation here")
      console.log(data);

      let translation;
      // Translate the text, we use the "[]" to destructure array in order to retrieve array at 0
      // [first element] as output of raw translation is an array
      // Sample output:  "[ 'テスト', { data: { translations: [Array] } } ]"
      if(data.language === "japanese") {
        const [result] = await translate.translate(data.originalText, 'ja'); // translates to japanese
        translation = result;
      } else if (data.language === "german") {
        const [result] = await translate.translate(data.originalText, 'de'); // translates to german
        translation = result;
      } else if (data.language === "french") {
        const [result] = await translate.translate(data.originalText, 'fr'); // translates to french
        translation = result;
      }

      console.log(translation);
      // Update the text
      text.originalText = data.originalText;
      text.translatedText = translation;
      text.language= data.language;


      // Emit the translated data to all connected clients
      io.sockets.emit("onReceiveTranslate", text);
    } catch (error) {
      console.error(error);
    }
  });

  socket.on("speechBot", async(data) => {
    try {
      const request = {
        input: { text: data },
        voice: { languageCode: "en-US", ssmlGender: "NEUTRAL" },
        audioConfig: { audioEncoding: "MP3" }
      };

      client.synthesizeSpeech(request, (err, response) => {
        if (err) {
          console.error("ERROR", err);
          return;
        }
        fs.writeFile("output.mp3", response.audioContent, "binary", err => {
          if (err) {
            console.error("ERROR", err);
            return;
          }
        });
        io.sockets.emit("onReceiveAudio", "output.mp3");
      });
    } catch (err) {
      console.error(err);
    }
  });
});

app.get('/output.mp3', (req, res) => {
  res.header('Content-Type', 'audio/mpeg');
  res.sendFile('output.mp3', { root: __dirname });
});

server.listen(PORT_NUMBER, () => {console.log("Socket server listening to http://localhost:" + PORT_NUMBER + "/")});
