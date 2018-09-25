import { Component, OnInit } from '@angular/core';
import * as myGlobals from '../global';
declare var $;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  public base_url: any = myGlobals.base_url;
  public url = window.location.pathname;
  tabs : string = '';
  toggle : number = 1;
  
  
  constructor() {
    this.tabs = this.url.substr(1);
  }

  ngOnInit() {
  }

  sidebar(tab,title) {
    this.tabs = tab;
    localStorage.setItem('title', title);
    $('.page_title').html(title);
  }
  sidebartoggle(toggle) {
    localStorage.setItem('sidebartoggle', toggle);
    $('.main-header').toggleClass('full-header');
    $('.right-sidebar').toggleClass('full-rightbar');
    if (toggle == 1) {
      this.toggle = 0;
    }
    else if (toggle == 0) {
      this.toggle = 1;
    }
  }

}
