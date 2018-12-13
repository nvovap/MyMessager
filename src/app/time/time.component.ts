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
    const host =  'wss://my-messager.herokuapp.com';
    const port = 54320;

    //this.socket$ = new WebSocketSubject(host + ':' + port);
    this.socket$ = new WebSocketSubject(host);

    console.log(this.socket$)

    this.socket$
            .subscribe(
              (message) => {
                if (message.typeMessage == 1) {
                  this.time = message.content
                } else if (message.typeMessage == 3) {
                  const message = new Message(localStorage.getItem('token'), '', 3);
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
