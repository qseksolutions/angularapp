import { Component, OnInit } from '@angular/core';

declare var $;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  toggle = localStorage.getItem('sidebartoggle');
  title = localStorage.getItem('title');
  public url = window.location.pathname;
  
  constructor() {
    this.url = this.url.substr(1);
    if(this.url != this.title.toLowerCase()) {
      if(this.url == '') {
        this.title = 'Dashboard';
      }
      else {
        this.title = this.url;
      }
    }
  }

  ngOnInit() {
  }

  /* sidebartoggle(toggle) {
    localStorage.setItem('sidebartoggle', toggle);
    $('.sidebar').toggleClass('icon-sidebar');
    $('.right-sidebar').toggleClass('full-rightbar');
    if (toggle == 1) {
      this.toggle = 0;
    }
    else if (toggle == 0) {
      this.toggle = 1;
    }
  } */

}
