import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Http, HttpModule } from '@angular/http';
import { routes } from './app.router';
import { AppComponent } from './app.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { WorkdayComponent } from './calendar/workday/workday.component';
import { SimpleDayComponent } from './calendar/simple-day/simple-day.component';
import { PagerComponent } from './calendar/pager/pager.component';
import { MonthlyStatisticComponent } from './calendar/monthly-statistic/monthly-statistic.component';
import { CalendarComponent } from './calendar/calendar.component';
import { ModifyTaskComponent } from './task-list/task-table/modify-task/modify-task.component';
import { DailyStatisticComponent } from './task-list/daily-statistic/daily-statistic.component';
import { TaskTableComponent } from './task-list/task-table/task-table.component';
import { TaskListComponent } from './task-list/task-list.component';
import { ConfirmModalComponent } from './modals/confirm-modal/confirm-modal.component';
import { ErrorModalComponent } from './modals/error-modal/error-modal.component';
import { NavigationComponent } from './navigation/navigation.component';
import { LoginService } from './shared/services/login.service';
import { AuthGuard } from './shared/auth.guard.';
import { NetworkService } from './shared/services/network.service';
import { PagerService } from './shared/services/pager.service';
import { WeekService } from './shared/services/week.service';
import { TranslateLoader, TranslateModule, TranslateStaticLoader } from 'ng2-translate';

export function translateFactory(http: Http): TranslateStaticLoader {
  return new TranslateStaticLoader(http, 'assets/translations', '.json');
}

@NgModule({
  declarations: [
    AppComponent,

    NavigationComponent,

    ErrorModalComponent,
    ConfirmModalComponent,

    TaskListComponent,
    TaskTableComponent,
    DailyStatisticComponent,
    ModifyTaskComponent,

    CalendarComponent,
    MonthlyStatisticComponent,
    PagerComponent,
    SimpleDayComponent,
    WorkdayComponent,

    LoginComponent,
    RegisterComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routes,
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: translateFactory,
      deps: [Http]
    })
  ],
  providers: [
    WeekService,
    PagerService,
    NetworkService,
    AuthGuard,
    LoginService,
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
