import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import 'hammerjs';

import { RouterModule, Routes } from '@angular/router';
import {HttpClientModule} from '@angular/common/http'
import {HttpModule} from '@angular/http'

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { HeldenbogenComponent } from './heldenbogen/heldenbogen.component';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HeldDetailComponent } from './heldenbogen/held-detail/held-detail.component';
import {AttributService} from './service/attribut.service';
import {HeldenService} from './service/helden.service';


import {MenuModule, MenubarModule, DataTableModule, SharedModule} from 'primeng/primeng';
import {TalentService} from "./service/talent.service";
import {TabViewModule} from "primeng/components/tabview/tabview";
import { SheetOverviewComponent } from './heldenbogen/sheet-overview/sheet-overview.component';
import {RestService} from "./service/rest.service";
import {FormsModule} from "@angular/forms";
import { KampfbogenComponent } from './heldenbogen/kampfbogen/kampfbogen/kampfbogen.component';
import {AusruestungService} from "./service/ausruestung.service";
import {KampfTalentService} from "./service/kampf-talent.service";

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
    HeldDetailComponent,
    SheetOverviewComponent,
    KampfbogenComponent
  ],
  imports: [
    BrowserModule, FormsModule, BrowserAnimationsModule, MenuModule, MenubarModule, DataTableModule, SharedModule, HttpModule, TabViewModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false }
    )
  ],
  providers: [AttributService, HeldenService, TalentService, RestService, AusruestungService, KampfTalentService],
  bootstrap: [AppComponent]
})
export class AppModule { }
