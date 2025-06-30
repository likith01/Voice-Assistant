import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatAssistantRoutingModule } from './chat-assistant-routing.module';
import { ChatInterfaceComponent } from './components/chat-interface/chat-interface.component';


@NgModule({
  declarations: [
    ChatInterfaceComponent
  ],
  imports: [
    CommonModule,
    ChatAssistantRoutingModule
  ]
})
export class ChatAssistantModule { }
