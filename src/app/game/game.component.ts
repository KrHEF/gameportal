import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Game} from '../classes/game';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  @Input() game: Game;

  @Output() changeFavoritesHandler: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {

  }

  public toggleFavorites(): void {
    this.game.isFavorites = !this.game.isFavorites;
    this.changeFavoritesHandler.emit();
  }


}
