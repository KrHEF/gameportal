import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {IFiltered} from '../types';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit, OnChanges {

  @Input() type: 'multiselect' | 'select' | 'input';
  @Input() values: IFiltered[];
  // @Input() init: IFiltered[] | string;

  @Output() changeValueHandler: EventEmitter<IFiltered[] | string> = new EventEmitter<IFiltered[] | string>();

  private timer = 0;
  public stringValues: string[] = [];

  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    if (this.values) {
      this.stringValues = this.values?.map((item) => item.Name);
    }
  }

  public changeValue(element: EventTarget): void {
    switch (this.type) {
      case 'multiselect':
        if (element && element instanceof HTMLSelectElement) {
          const selectIds: number[] = Array.from(element.selectedOptions)
            .map((opt) => +opt.value)
            .filter((id) => !isNaN(id));
          const result: IFiltered[] = selectIds.map((id) => this.values[id]);
          this.changeValueHandler.emit(result);
        }
        break;
      case 'select':
        if (element && element instanceof HTMLSelectElement) {
          const selectId: number = +element.value;
          const result: IFiltered[] = [];
          if (selectId >= 0) {
            result.push(this.values[selectId]);
          }
          this.changeValueHandler.emit(result);
        }
        break;
      case 'input':
        if (element && element instanceof HTMLInputElement) {
          clearTimeout(this.timer);
          this.changeValueHandler.emit(element.value);
        }
        break;
    }
  }

  public prechangeValue(element: EventTarget): void {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.changeValue(element);
    }, 1000);
  }

}
