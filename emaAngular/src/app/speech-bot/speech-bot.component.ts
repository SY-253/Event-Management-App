import { Component } from '@angular/core';
import { io } from 'socket.io-client';

@Component({
  selector: 'app-speech-bot',
  templateUrl: './speech-bot.component.html',
  styleUrls: ['./speech-bot.component.css']
})

export class SpeechBotComponent {

  text: string = "";
  audio: string = "";
  isConverted: boolean = false;

  socket: any;

  constructor() {
    this.socket = io("http://localhost:8080/");
  }

  ngOnInit() {
    this.listenToEvents();
  }

  listenToEvents() {
    this.socket.on("onReceiveAudio", (data: string) => {
      this.audio = "http://localhost:8080/" + data;
      this.isConverted = true;
    });
  }

  onConvertText() {
    this.socket.emit("speechBot", this.text);
    this.listenToEvents();
  }
}
