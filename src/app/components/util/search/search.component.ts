import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent {
  @ViewChild('myInput') myInput: ElementRef | undefined;

  constructor(private router: Router) {}

  doSearch(value: string) {
    console.log('value: ', value);
    if (value.length > 0) {
      this.myInput!.nativeElement.value = '';

      this.router.navigateByUrl(`/search/${value}`);
    }
  }
}
