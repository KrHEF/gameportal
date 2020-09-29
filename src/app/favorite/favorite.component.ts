import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.css']
})
export class FavoriteComponent implements OnInit {

  @Input() length = 0;

  @Output() toggleFavoriteHandler: EventEmitter<boolean> = new EventEmitter<boolean>();

  public show = false;

  constructor() { }

  ngOnInit(): void {
  }

  public toggleFavorite(target: EventTarget): void {
    if (!this.length && !this.show) { return; }

    this.show = !this.show;
    this.toggleFavoriteHandler.emit(this.show);
  }

}
