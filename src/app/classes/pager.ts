export class Pager {
  private itemsCount: number;
  private itemsOnPage: number;
  private pageNumber: number;

  public get PageCount(): number { return Math.ceil( this.itemsCount / this.itemsOnPage); }

  public get PageNumber(): number { return this.pageNumber; }
  public set PageNumber(value) {
    if (isNaN(value) || (value > this.PageCount) ) {
      this.pageNumber = 1;
    } else if (value <= 0 ) {
      this.pageNumber = this.PageCount;
    } else {
      this.pageNumber = value;
    }
  }

  public get StartIndex(): number {
    return ((this.pageNumber - 1) * this.itemsOnPage);
  }
  public get EndIndex(): number {
    return this.pageNumber * this.itemsOnPage - 1;
  }

  public get ItemOnPage(): number { return this.itemsOnPage; }
  public set ItemOnPage(value: number) {
    if (value >= 0) {
      this.itemsOnPage = value;
      // Может оказаться, что текущая страница больше кол-ва страниц,
      // а в сеттере PageNumber есть проверка.
      this.PageNumber = this.PageNumber;
    }
  }

  public constructor(itemCount, itemOnPage, pageNumber = 1) {
    this.itemsCount = itemCount;
    this.itemsOnPage = (itemOnPage > 0) ? itemOnPage : 1;
    this.PageNumber = pageNumber;
  }

  public next(): void {
    this.PageNumber++;
  }
  public prev(): void {
    this.PageNumber--;
  }

  public update(itemsCount: number): void {
    if (itemsCount >= 0) {
      this.itemsCount = itemsCount;
      this.pageNumber = 1;
    }
  }
}
