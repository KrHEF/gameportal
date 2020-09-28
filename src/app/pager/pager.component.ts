import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Pager} from '../classes/pager';

@Component({
  selector: 'app-pager',
  templateUrl: './pager.component.html',
  styleUrls: ['./pager.component.css']
})
export class PagerComponent {


  @Input() pager: Pager;

  @Output() changePageHandler: EventEmitter<any> = new EventEmitter();

  constructor() {}

  private changePage(): void {
    this.changePageHandler.emit();
  }

  public goToNextPage(): void {
    this.pager.next();
    this.changePage();
  }

  public goToPrevPage(): void {
    this.pager.prev();
    this.changePage();
  }

}
