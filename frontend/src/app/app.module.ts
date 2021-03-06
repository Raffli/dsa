import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import 'hammerjs';

import { RouterModule, Routes } from '@angular/router';
import {HttpModule} from '@angular/http'

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { HeldenbogenComponent } from './heldenbogen/heldenbogen.component';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import {AttributService} from './service/attribut.service';
import {HeldenService} from './service/helden.service';


import {MenuModule, MenubarModule, DataTableModule, SharedModule, DialogModule, DropdownModule} from 'primeng/primeng';
import {TalentService} from "./service/talent.service";
import {TabViewModule} from "primeng/components/tabview/tabview";
import { SheetOverviewComponent } from './heldenbogen/sheet-overview/sheet-overview.component';
import {RestService} from "./service/rest.service";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { KampfbogenComponent } from './heldenbogen/kampfbogen/kampfbogen/kampfbogen.component';
import {AusruestungService} from "./service/ausruestung.service";
import {KampfTalentService} from "./service/kampf-talent.service";
import { HeldLadenComponent } from './held-laden/held-laden.component';
import {SonderfertigkeitenService} from "./service/sonderfertigkeiten.service";
import { KampfToolComponent } from './meistertools/kampf-tool/kampf-tool.component';
import { CreateKampfComponent } from './meistertools/kampf-tool/create-kampf/create-kampf.component';
import { LoadKampfComponent } from './meistertools/kampf-tool/load-kampf/load-kampf.component';
import { DisplayKampfComponent } from './meistertools/kampf-tool/display-kampf/display-kampf.component';
import {LoggingService} from "./service/logging.service";
import {SessionStoreService} from "./service/session-store.service";
import { DisplayKampfMemberComponent } from './meistertools/kampf-tool/display-kampf-member/display-kampf-member.component';
import {PanelModule} from "primeng/components/panel/panel";
import {GrowlModule} from "primeng/components/growl/growl";
import {KampfService} from "./service/kampf.service";
import { SaveKampfComponent } from './meistertools/kampf-tool/create-kampf/save-kampf/save-kampf.component';
import { SaveKampfteilnehmerComponent } from './meistertools/kampf-tool/create-kampf/save-kampfteilnehmer/save-kampfteilnehmer.component';
import {MessageService} from './service/message.service';
import { HeldSpeichernComponent } from './held-speichern/held-speichern.component';
import { LoadKampfMemberComponent } from './meistertools/kampf-tool/load-kampf-member/load-kampf-member.component';
import { HeldLadenPasswortComponent } from './held-laden/held-laden-passwort/held-laden-passwort.component';
import { EreignisBogenComponent } from './heldenbogen/ereignis-bogen/ereignis-bogen.component';
import { ZauberbogenComponent } from './heldenbogen/zauberbogen/zauberbogen.component';
import { HeldenUpdaterComponent } from './helden-updater/helden-updater.component';
import {HeldenUpdaterService} from "./service/helden-updater.service";
import { GridComponent } from './grid/grid.component';
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
  { path: 'laden', component: HeldLadenComponent },
  { path: 'tools/kampf', component: KampfToolComponent},
  { path: 'save', component: HeldSpeichernComponent},
  { path: 'updater', component: HeldenUpdaterComponent},

  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    HeldenbogenComponent,
    HomeComponent,
    PageNotFoundComponent,
    SheetOverviewComponent,
    KampfbogenComponent,
    HeldLadenComponent,
    KampfToolComponent,
    CreateKampfComponent,
    LoadKampfComponent,
    DisplayKampfComponent,
    DisplayKampfMemberComponent,
    SaveKampfComponent,
    SaveKampfteilnehmerComponent,
    HeldSpeichernComponent,
    LoadKampfMemberComponent,
    HeldLadenPasswortComponent,
    EreignisBogenComponent,
    ZauberbogenComponent,
    HeldenUpdaterComponent,
    GridComponent,
  ],
  imports: [
    BrowserModule, FormsModule, BrowserAnimationsModule, MenuModule, MenubarModule,
    DialogModule, DataTableModule, SharedModule, HttpModule, TabViewModule,
    FormsModule, ReactiveFormsModule, PanelModule, GrowlModule, DropdownModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false }
    )
  ],
  providers: [AttributService, HeldenService, TalentService, RestService, AusruestungService, KampfTalentService, SonderfertigkeitenService, LoggingService, SessionStoreService, KampfService, MessageService, HeldenUpdaterService],
  bootstrap: [AppComponent]
})
export class AppModule { }
