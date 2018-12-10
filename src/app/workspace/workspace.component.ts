import { Component, OnInit, ElementRef } from '@angular/core';
import { MessageService } from '../message.service';
import { WebSocketSubject } from 'rxjs/observable/dom/WebSocketSubject';
import { User } from '../User';



export class Message {
  constructor(
    public sender: string,
    public content: string,
    public typeMessage: number
  ) { }
}


@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.css'],
  // providers: [MessageService]
})

export class WorkspaceComponent implements OnInit { 

  public messages = new Array<Message>();




  textMessage = ''


  
  last = true

  user = new User();

  

  sender = Math.random().toString(36).slice(2)

  private socket$: WebSocketSubject<Message>;
  
//   headers : {
//     Authorization : localStorage.getItem('Token')
// },

  constructor(private messageService: MessageService, private element: ElementRef) { 
    // const nativeElement = this.viewer.nativeElement;
    // console.log(nativeElement.scrollHeight - (nativeElement.scrollTop + nativeElement.clientHeight));

    this.socket$ = new WebSocketSubject('ws://localhost:54321',);

    this.socket$
            .subscribe(
              (message) => {
                if (message.typeMessage == 0) {
                  this.messages.push(message)
                  this.scrollToBottom();

                } else if (message.typeMessage == 3) {
                  const message = new Message(localStorage.getItem('token'), '', 3);
                  this.socket$.next(message);
                } else if (message.typeMessage == 5) {
                  //console.log(JSON.parse(message.content))
                  this.user = JSON.parse(message.content);
                }
              },
              (err) => {
                console.error(err) 
              },
              () => console.warn('Completed!')
            );

  }

 send() {
    const message = new Message(this.user.name, this.textMessage, 0);

    this.messages.push(message);
    this.socket$.next(message);
    this.textMessage = '';
    this.scrollToBottom();
}

  ngOnInit() {
    this.messages = this.messageService.getMessages();

    console.log(this.messages)
  }

  onChange() {
    //this.userService.setSize(+this.size)
    
    //this.messageService.messages.push({isSelf: true, text: this.textMessage})
    this.send();
    // this.scrollToBottom()
  }

  scrollToBottom() {
    this.element.nativeElement.childNodes[0].scrollTop = this.element.nativeElement.childNodes[0].scrollHeight;
  }


}
