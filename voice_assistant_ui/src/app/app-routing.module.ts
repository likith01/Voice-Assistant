import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
		path: "",
		redirectTo: "chat/interface",
		pathMatch: "full",
	},
  {
		path: "chat",
		loadChildren: () => import("./chatbot/chat-assistant/chat-assistant.module").then((m) => m.ChatAssistantModule),
	},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
