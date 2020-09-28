import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.css']
})
export class FavoriteComponent implements OnInit {

  @Input() length = 0;

  @Output() toggleFavoriteHandler: EventEmitter<boolean> = new EventEmitter<boolean>();

  private show = false;

  constructor() { }

  ngOnInit(): void {
  }

  public toggleFavorite(target: EventTarget): void {
    if (!this.length) { return; }

    this.show = !this.show;
    if (target instanceof HTMLAnchorElement) {
      if (this.show) {
        target.className += ' on';
      } else {
        target.className = target.className.replace('on', '').trim();
      }
    }

    this.toggleFavoriteHandler.emit(this.show);
  }

}
