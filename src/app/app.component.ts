import { Component } from '@angular/core';
import { TranslateService } from 'ng2-translate';
import { LoginService } from './shared/services/login.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['app.component.css'],
})
export class AppComponent {
  public title = 'Time logger angular cli';

  constructor(
    private translate: TranslateService,
    private loginService: LoginService,
  ) {
    this.translate.setDefaultLang('en');
    this.translate.use(navigator.language.split('-')[0]);
    Observable.timer(0, 240000)
      .subscribe(() => {
        this.refreshToken();
      });
  }

  private refreshToken(): void {
    if (LoginService.isLogged()) {
      this.loginService.refreshToken();
    }
  }
}
