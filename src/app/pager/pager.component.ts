import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {Pager} from '../classes/pager';
import {StorageService} from '../storage.service';

@Component({
  selector: 'app-pager',
  templateUrl: './pager.component.html',
  styleUrls: ['./pager.component.css']
})
export class PagerComponent implements OnInit, OnChanges {

  private storageService: StorageService;

  @Input() pager: Pager;
  @Input() saveInStorage = false;
  @Input() keyInStorage = 'pager';

  @Output() changePageHandler: EventEmitter<any> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {
    if (this.saveInStorage) {
      this.storageService = StorageService.get();
    }
  }

  ngOnChanges(): void {
    // Как-то кривовато, событие вызывается 3 раза, но другое событие,
    // которое вызывается при позднем связывании данных пока не нашел.
    if (this.saveInStorage && this.pager && (this.pager.PageCount > 1)) {
      this.pager.PageNumber = parseInt( this.storageService.getItem(this.keyInStorage), 10 );

      this.changePage();
    }
  }

  private changePage(): void {
    this.changePageHandler.emit();

    if (this.pager.PageNumber === 1) {
      this.storageService?.removeItem(this.keyInStorage);
    } else {
      this.storageService?.setItem(this.keyInStorage, this.pager.PageNumber.toString());
    }
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
