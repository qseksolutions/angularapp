import { Component, OnInit } from '@angular/core';

declare var $;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  toggle : number = 1;

  constructor() {
    localStorage.removeItem('sidebartoggle');
  }

  ngOnInit() {
  }

  sidebartoggle(toggle) {
    localStorage.setItem('sidebartoggle', toggle);
    $('.sidebar').toggleClass('icon-sidebar');
    $('.right-sidebar').toggleClass('full-rightbar');
    if (toggle == 1) {
      this.toggle = 0;
    }
    else if (toggle == 0) {
      this.toggle = 1;
    }
  }

}
