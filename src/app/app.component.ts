import {Component, OnInit} from '@angular/core';
import {DataService} from './data.service';
import {Category} from './classes/category';
import {Game} from './classes/game';
import {Merchant} from './classes/merchant';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'EF Game Portal';
  public categories: Category[];
  public merchants: Merchant[];
  public games: Game[];

  constructor(
    private dataService: DataService
  ) {
  }

  ngOnInit(): void {
    this.dataService.loadData().subscribe((data) => {
      // this.categories = this.dataService.categories;
      this.categories = Category.getAll();
      // this.merchants = this.dataService.merchants;
      this.merchants = Merchant.getAll();
      // this.games = this.dataService.games;
      this.games = this.dataService.games;

      console.log(this.games);
    });
  }


}
