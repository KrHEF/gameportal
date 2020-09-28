import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { GameComponent } from './game/game.component';
import {HttpClientJsonpModule, HttpClientModule} from '@angular/common/http';
import { PagerComponent } from './pager/pager.component';
import { SettingComponent } from './setting/setting.component';
import { FavoriteComponent } from './favorite/favorite.component';

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    PagerComponent,
    SettingComponent,
    FavoriteComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpClientJsonpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
