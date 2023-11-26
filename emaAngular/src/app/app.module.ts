import { HttpClientModule } from '@angular/common/http';
import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

import {DatabaseService} from "./database.service";

import { AddEventComponent } from './add-event/add-event.component';
import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AddCategoryComponent } from './add-category/add-category.component';
import { DeleteCategoryComponent } from './delete-category/delete-category.component';
import { DeleteEventComponent } from './delete-event/delete-event.component';
import { InvalidDataErrorComponent } from './invalid-data-error/invalid-data-error.component';
import { LanguageBotComponent } from './language-bot/language-bot.component';
import { ListCategoryComponent } from './list-category/list-category.component';
import { ListEventComponent } from './list-event/list-event.component';
import { SpeechBotComponent } from './speech-bot/speech-bot.component';
import { StatsComponent } from './stats/stats.component';
import { StatsG2Component } from './stats-g2/stats-g2.component';
import { UpdateCategoryComponent } from './update-category/update-category.component';
import { UpdateEventComponent } from './update-event/update-event.component';
import { ViewCategoryComponent } from './view-category/view-category.component';
import { ViewEventComponent } from './view-event/view-event.component';
import { EmaComponent } from './ema/ema.component';

//Pipes
import { TransformMinutePipe } from "./transform-minute.pipe";
import { ServiceWorkerModule } from '@angular/service-worker';
import { TransformNamePipe } from './transform-name.pipe';

const appRoutes: Routes = [
  { path: "addcategory", component: AddCategoryComponent },
  { path: "addevent", component: AddEventComponent },
  { path: "deletecategory", component: DeleteCategoryComponent },
  { path: "deleteevent", component: DeleteEventComponent },
  { path: "invaliddataerror", component: InvalidDataErrorComponent },
  { path: "languagebot", component: LanguageBotComponent },
  { path: "listcategory", component: ListCategoryComponent },
  { path: "listevents", component: ListEventComponent },
  { path: "pagenotfound", component: PageNotFoundComponent },
  { path: "speechbot", component: SpeechBotComponent },
  { path: "updatecategory", component: UpdateCategoryComponent },
  { path: "updateevent", component: UpdateEventComponent },
  { path: "viewcategory/:categoryId", component: ViewCategoryComponent },
  { path: "viewevent/:id", component: ViewEventComponent },
  { path: "stats", component: StatsComponent },
  { path: "statsg2", component: StatsG2Component },
  { path: 'invalid-data', component: InvalidDataErrorComponent },
  { path: '', component: EmaComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  declarations: [
    //Main default "navigation header" component
    EmaComponent,

    // Other app components
    AppComponent,
    PageNotFoundComponent,
    AddCategoryComponent,
    DeleteCategoryComponent,
    InvalidDataErrorComponent,
    LanguageBotComponent,
    ListCategoryComponent,
    SpeechBotComponent,
    StatsComponent,
    UpdateCategoryComponent,
    ViewCategoryComponent,
    AddEventComponent,
    DeleteEventComponent,
    ListEventComponent,
    StatsG2Component,
    UpdateEventComponent,
    ViewEventComponent,

    //Pipes
    TransformMinutePipe,
    TransformNamePipe
  ],
  imports: [
    RouterModule.forRoot(appRoutes, { useHash: true }),
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [DatabaseService],
  bootstrap: [AppComponent]
})
export class AppModule { }
