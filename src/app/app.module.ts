import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { GameComponent } from './game/game.component';
import {HttpClientJsonpModule, HttpClientModule} from '@angular/common/http';
import { PagerComponent } from './pager/pager.component';
import { SettingComponent } from './setting/setting.component';
import { FavoriteComponent } from './favorite/favorite.component';
import { FilterComponent } from './filter/filter.component';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    PagerComponent,
    SettingComponent,
    FavoriteComponent,
    FilterComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpClientJsonpModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
