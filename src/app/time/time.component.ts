import { Component, OnInit } from '@angular/core';
import { WebSocketSubject } from 'rxjs/observable/dom/WebSocketSubject';
// npm install --save rxjs-compat

export class Message {
  constructor(
    public sender: string,
    public content: string,
    public typeMessage: number
  ) { }
}

@Component({
  selector: 'app-time',
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.css']
})
export class TimeComponent implements OnInit {

  private socket$: WebSocketSubject<Message>;
  time = ""

  constructor() { 
    this.socket$ = new WebSocketSubject('ws://localhost:54321',);

    this.socket$
            .subscribe(
              (message) => {
                if (message.typeMessage == 1) {
                  this.time = message.content
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

  ngOnInit() {
  }

}
