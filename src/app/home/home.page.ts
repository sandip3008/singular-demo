import { Component } from '@angular/core';

declare var cordova: any;
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor() {}

  shareClick() {
    console.log('cordova.plugins: ', cordova.plugins);
    cordova.plugins.SingularCordovaSdk.eventWithArgs(
      'sngShare', // Event name
      {
        // Event attributes
        clickTimestamp: new Date().toISOString()
      }
    )
  }

}
