export class Pager {
  private itemCount: number;
  private itemOnPage: number;
  private pageNumber: number;

  public get PageCount(): number { return Math.ceil( this.itemCount / this.itemOnPage); }

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
    return ((this.pageNumber - 1) * this.itemOnPage);
  }
  public get EndIndex(): number {
    return this.pageNumber * this.itemOnPage - 1;
  }

  public get ItemOnPage(): number { return this.itemOnPage; }
  public set ItemOnPage(value: number) {
    if (value >= 0) {
      this.itemOnPage = value;
      // Может оказаться, что текущая страница больше кол-ва страниц,
      // а в сеттере PageNumber есть проверка.
      this.PageNumber = this.PageNumber;
    }
  }

  public constructor(itemCount, itemOnPage, pageNumber = 1) {
    this.itemCount = itemCount;
    this.itemOnPage = (itemOnPage > 0) ? itemOnPage : 1;
    this.PageNumber = pageNumber;
  }

  public next(): void {
    this.PageNumber++;
  }
  public prev(): void {
    this.PageNumber--;
  }

}
