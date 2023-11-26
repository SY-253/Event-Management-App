import { Component } from '@angular/core';
import { io } from 'socket.io-client';

interface Text {
  originalText: string;
  translatedText: string;
  language: string;
}
@Component({
  selector: 'app-language-bot',
  templateUrl: './language-bot.component.html',
  styleUrls: ['./language-bot.component.css']
})
export class LanguageBotComponent {

  translatedTexts: Text[] = [];

  text: Text = { originalText: '', translatedText: '', language: 'japanese' };

  socket: any;

  constructor() {
    this.socket = io("http://localhost:8080/");
  }
  // using "on" on sockets makes it acts as a "listener", because it is defined in ngOnInit, it will always listen
  // for any sockets that emit a message with the keyword "onReceiveTranslate".
  // In a sense, sockets are like broadcast messages in mobile application development.
  ngOnInit() {
    this.listen2Events();
  }

  listen2Events() {
    this.socket.on("onReceiveTranslate", (data: Text) => {
      this.translatedTexts.push(data);
      console.log("translated texts: ");
      console.log(this.translatedTexts);
    });
  }

  // This socket would receive function and send off the data of the form (not submit data, it is only 1)
  // why we can do this? because of the two way data binding of ngModel.
  // we update the driver object which consist of "name" and "task" directly, no need to submit form data
  // with how I have made it here.

  //This socket would send a "broadcast message" to "driverTranslate" [will be picked up in app.js]
  sendTextData() {
    console.log('Text::'+this.text)
    this.socket.emit("languageTranslate", this.text);
  }
}
