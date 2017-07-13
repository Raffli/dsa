import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {MdAutocompleteModule, MdInputContainer, MdInputDirective, MdCard, MdButton, MaterialModule } from '@angular/material';
import { AppComponent } from './app.component';
import 'hammerjs';

import { RouterModule, Routes } from '@angular/router';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { HeldenbogenComponent } from './heldenbogen/heldenbogen.component';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HeldDetailComponent } from './held-detail/held-detail.component';

const appRoutes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    data: { title: 'Home' }
  },
  { path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  { path: 'heldenbogen', component: HeldenbogenComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    HeldenbogenComponent,
    HomeComponent,
    PageNotFoundComponent,
    HeldDetailComponent
  ],
  imports: [
    BrowserModule, BrowserAnimationsModule, MaterialModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false }
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
