import { Component, OnInit, ElementRef } from '@angular/core';
import { MessageService } from '../message.service';
import { WebSocketSubject } from 'rxjs/observable/dom/WebSocketSubject';



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
  styleUrls: ['./workspace.component.css']
})

export class WorkspaceComponent implements OnInit { 

  public masseges = new Array<Message>();

  textMessage = ''
  
  last = true

  sender = Math.random().toString(36).slice(2)

  private socket$: WebSocketSubject<Message>;
  

  constructor(private messageService: MessageService, private element: ElementRef) { 
    // const nativeElement = this.viewer.nativeElement;
    // console.log(nativeElement.scrollHeight - (nativeElement.scrollTop + nativeElement.clientHeight));

    this.socket$ = new WebSocketSubject('ws://localhost:54321',);

    this.socket$
            .subscribe(
              (message) => {
                if (message.typeMessage == 0) {
                  this.masseges.push(message)
                } else if (message.typeMessage == 3) {
                  const message = new Message('1234567890', '', 3);
                  this.socket$.next(message);
                }
              },
              (err) => {
                console.error(err) 
              },
              () => console.warn('Completed!')
            );

  }

 send() {
    const message = new Message(this.sender, this.textMessage, 0);

    this.masseges.push(message);
    this.socket$.next(message);
    this.textMessage = '';
    this.scrollToBottom();
}

  ngOnInit() {
    ///this.masseges = this.messageService.getMessages();

    console.log(this.masseges)
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
