import { Component, OnInit, ElementRef } from '@angular/core';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.css']
})
export class WorkspaceComponent implements OnInit {

  masseges = []

  textMessage = ""
  last = true
  

  constructor(private messageService: MessageService, private element: ElementRef) { 
    // const nativeElement = this.viewer.nativeElement;
    // console.log(nativeElement.scrollHeight - (nativeElement.scrollTop + nativeElement.clientHeight));
  }

  ngOnInit() {
    this.masseges = this.messageService.getMessages();

    console.log(this.masseges)
  }

  onChange() {
    //this.userService.setSize(+this.size)
    
    this.messageService.messages.push({isSelf: true, text: this.textMessage})
  }

  scrollToBottom() {
    this.element.nativeElement.childNodes[0].scrollTop = this.element.nativeElement.childNodes[0].scrollHeight;
   //console.log('scrollHeight '+ this.element.nativeElement.scrollHeight)
  }


}
