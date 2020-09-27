import {Component, OnInit} from '@angular/core';
import {DataService} from './data.service';
import {Category} from './classes/category';
import {Game} from './classes/game';
import {Merchant} from './classes/merchant';
import {Pager} from './classes/pager';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  readonly title = 'EF Game Portal';
  readonly version: number[] = [1, 0, 0, 3];

  public pager: Pager;

  public categories: Category[] = [];
  public merchants: Merchant[] = [];
  private games: Game[] = [];
  private gamesOnPage: Game[] = [];
  private gamesInFavorite: Game[] = [];

  public get GamesCount(): number {
    return this.games.length;
  }

  public get Games(): Game[] {
    if (!this.gamesOnPage.length) { this.setCurrentGames(); }
    return this.gamesOnPage;
  }

  constructor(
    private dataService: DataService,
  ) {
  }

  ngOnInit(): void {
    this.dataService.loadData().subscribe((data) => {
      this.categories = this.dataService.categories;
      this.merchants = this.dataService.merchants;
      this.games = this.dataService.games;
      this.pager = new Pager(this.GamesCount, 10);
    });
  }

  private setCurrentGames(): void {
    if (this.pager) {
      this.gamesOnPage = this.games.slice(this.pager.StartIndex, this.pager.EndIndex);
    }
  }

  public changePage(): void {
    this.setCurrentGames();
  }
}
