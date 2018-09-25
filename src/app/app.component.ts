import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterContainerComponent, ToasterService, ToasterConfig } from 'angular2-toaster';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ToasterService],
})
export class AppComponent {

  title = 'csv';
  showHeader: boolean = false;
  public location = '';

  public toasterService: ToasterService;
  public toasterconfig: ToasterConfig =
    new ToasterConfig({
      showCloseButton: true,
      tapToDismiss: false,
      timeout: 3000
    });

  constructor(private router: Router, toasterService: ToasterService) {
    this.toasterService = toasterService;
    localStorage.removeItem('sidebartoggle');
    // localStorage.removeItem('title');
  }

  ngOnInit() {
    // listenging to routing navigation event
    this.router.events.subscribe(event => this.modifyHeader(event));
  }

  modifyHeader(location) {
    const url = window.location.pathname;
    if (url == '/login') {
      this.showHeader = false;
    } else {
      this.showHeader = true;
    }
  }
}
