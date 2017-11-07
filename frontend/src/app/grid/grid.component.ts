import {
  AfterContentInit, Component, ContentChild, ContentChildren, Input, OnInit, QueryList, TemplateRef,
  ViewChildren
} from '@angular/core';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent implements AfterContentInit{

  @Input() public rows = 3;

  @ContentChildren(TemplateRef) tabs: QueryList<TemplateRef<any>>
  constructor() {
  }

  ngAfterContentInit() {
    console.log(this.tabs.toArray())
  }

  public getSubset(index: number) {
    const setSize = Math.ceil(this.tabs.length / this.rows);
    const startIndex = index * setSize;
    const endIndex = Math.min(startIndex + setSize, this.tabs.length);

    return this.tabs.toArray().slice(startIndex, endIndex)
  }

  public getIteratorCollection() {
    return Array(this.rows)
  }


}
