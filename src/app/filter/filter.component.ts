import {Component, EventEmitter, Input, Output} from '@angular/core';
import {IFiltered} from '../types';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent {

  @Input() type: 'multiselect' | 'select' | 'input';
  @Input() values: IFiltered[];
  // @Input() init: IFiltered[] | string;

  @Output() changeValueHandler: EventEmitter<IFiltered[] | string> = new EventEmitter<IFiltered[] | string>();

  private timer = 0;

  constructor() {
  }

  public changeValue(element: EventTarget): void {
    // Пришлось немного усложнить логику, чтобы можно было переизпользовать.
    // Основная идея, добавлять в начало поле Не выбрано с индексом < 0
    // ToDo: хранить коллекции в Map, чтобы иметь доступ к элементу по id и неделать кучи фильтраций.
    switch (this.type) {
      case 'multiselect':
        if (element && element instanceof HTMLSelectElement) {
          const selectIds: number[] = Array.from(element.selectedOptions)
            .map((opt) => +opt.value)
            .filter((id) => !isNaN(id));

          const result: IFiltered[] = this.values.filter((val) => {
            return selectIds.some((id) => id >= 0 && id === val.Id);
          });

          this.changeValueHandler.emit(result);
        }
        break;
      case 'select':
        if (element && element instanceof HTMLSelectElement) {
          const selectId: number = +element.value;
          let result: IFiltered[] = [];

          if (selectId >= 0) {
            result = this.values.filter((val) => val.Id === selectId);
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
