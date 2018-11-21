import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  
  messages = [
    {isSelf: false, text: 'Hi!'},
    {isSelf: false, text: 'How are your?'},
    {isSelf: true, text: 'Hi!'},
    {isSelf: false, text: 'What do you do?'},
  ]


  
  constructor(private messageService: MessageService) { }

  getMessages() {
    return this.messages;
  }
}
