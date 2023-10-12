import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';

declare var cordova: any;
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(public platform: Platform) {
    this.platform.ready().then(() => {
      console.log('cordova.plugins: ', cordova.plugins);
      var singularConfig = new cordova.plugins.SingularCordovaSdk.SingularConfig("deskcodesolution_7f6f5840", "fe1c80de3d28524969d554042c631b7e");
      cordova.plugins.SingularCordovaSdk.init(singularConfig);
    }); 
  }
}
