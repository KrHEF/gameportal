import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit {

  @Input() type: 'select' | 'input';
  @Input() values: any[];
  @Input() value: any;

  @Output() changeValueHandler: EventEmitter<any> = new EventEmitter<any>();

  public stringValues: string[] = [];
  public stringValue = '';

  public get selectedIndex(): number {
    return !this.stringValues ? 0 : this.stringValues.indexOf(this.stringValue);
  }

  constructor() {
  }

  ngOnInit(): void {
    // Т. к. тип <any>, то надо привести всё к строке, чтобы находить индекс.
    this.stringValue = this.value?.toString();
    this.stringValues = this.values?.map((item) => item.toString());
  }

  public changeValue(element: HTMLElement): void {
    if (element instanceof HTMLSelectElement) {
      this.changeValueHandler.emit(this.values[parseInt(element.value, 10)]);
    } else if (element instanceof HTMLInputElement) {
      this.changeValueHandler.emit(element.value);
    }
  }


}
