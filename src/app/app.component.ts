import {Component, OnInit} from '@angular/core';
import {TGameCategory} from './types';
import {DataService} from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'EF Game Portal';
  private categories: TGameCategory;

  constructor(
    private dataService: DataService
  ) {
  }

  ngOnInit(): void {
    // this.dataService.
  }


}
