import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatInterfaceComponent } from './components/chat-interface/chat-interface.component';

const routes: Routes = [
  {
		path: "chat",
		component: ChatInterfaceComponent
	},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChatAssistantRoutingModule { }
