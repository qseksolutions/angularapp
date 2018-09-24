import { Component, OnInit } from '@angular/core';
import * as myGlobals from '../global';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  public base_url: any = myGlobals.base_url;
  public url = window.location.pathname;
  tabs : string = '';
  toggle = localStorage.getItem('sidebartoggle');
  
  constructor() {
    this.tabs = this.url.substr(1);
  }

  ngOnInit() {
  }

  sidebar(tab) {
    this.tabs = tab;
  }

}
