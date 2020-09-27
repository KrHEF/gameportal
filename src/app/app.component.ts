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
  readonly title = 'EF Game Portal';

  public pager = {
    countOnPage: 10,
    curPageNumber: 1,
  };



  public categories: Category[] = [];
  public merchants: Merchant[] = [];
  private games: Game[] = [];
  private gamesOnPage: Game[] = [];
  private gamesInFavorite: Game[] = [];

  public get GamesCount(): number {
    return this.games.length;
  }
  public get PagesCount(): number {
    return Math.ceil (this.GamesCount / this.pager.countOnPage);
  }

  public get Games(): Game[] {
    if (!this.gamesOnPage.length) { this.setCurrentGames(); }
    return this.gamesOnPage;
  }

  constructor(
    private dataService: DataService
  ) {
  }

  ngOnInit(): void {
    this.dataService.loadData().subscribe((data) => {
      this.categories = this.dataService.categories;
      this.merchants = this.dataService.merchants;
      this.games = this.dataService.games;
    });
  }

  private setCurrentGames(): void {
    const  startIndex = ((this.pager.curPageNumber - 1) * this.pager.countOnPage);
    let endIndex = this.pager.curPageNumber * this.pager.countOnPage - 1;
    endIndex = endIndex < this.GamesCount ? endIndex : this.GamesCount;
    this.gamesOnPage = this.games.slice(startIndex, endIndex);
  }

  public goToPage(newPageNumber: number): void {
    if (newPageNumber > this.PagesCount ) {
      this.pager.curPageNumber = 1;
    } else if (newPageNumber <= 0 ) {
      this.pager.curPageNumber = this.PagesCount;
    } else {
      this.pager.curPageNumber = newPageNumber;
    }

    this.setCurrentGames();
  }
}
