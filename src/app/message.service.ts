import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  
  messages = [
    {sender: "nvovap3", content: 'Hi!', typeMessage: 0},
    {sender: "nvovap", content: 'Hello!', typeMessage: 0},
    {sender: "nvovap3", content: 'I love you!', typeMessage: 0},
    {sender: "nvovap", content: 'Me too!', typeMessage: 0},
  ]



  
  constructor(private messageService: MessageService) { }

  getMessages() {
    return this.messages;
  }
}
