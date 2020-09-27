import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-pager',
  templateUrl: './pager.component.html',
  styleUrls: ['./pager.component.css']
})
export class PagerComponent implements OnInit {

  @Input() itemCountOnPage: number;
  @Input() currentPageNumber: number;
  @Input() itemCount: number;

  @Output() nextPage: EventEmitter<any> = new EventEmitter();
  @Output() prevPage: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  public goToNextPage(): void {
    this.nextPage.emit();
  }

  public goToPrevPage(): void {
    this.prevPage.emit();

  }

}
