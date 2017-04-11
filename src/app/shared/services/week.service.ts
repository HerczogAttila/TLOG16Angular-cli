import { Injectable } from '@angular/core';
import { Week } from '../classes/week';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { MyDate } from '../classes/myDate';

@Injectable()
export class WeekService {
  public workdaysCount: number;
  public reqWorkMinutes: number;
  public minutes: number;
  public extraMinutes: number;
  public chartData = [
    { data: [], label: '' },
    { data: [], label: '' },
  ];
  public chartLabels = ['1', '2', '3'];

  public weekStartIndex = 0;

  private weeks: Week[] = [];
  private workDays: MyDate[] = [];

  private selectedDay = 0;

  public refreshStatistics(): void {
    this.reqWorkMinutes = 0;
    this.minutes = 0;
    this.extraMinutes = 0;
    this.workdaysCount = this.workDays.length;
    const chartMinutes = [];
    const chartRequiredWorkMinutes = [];
    const chartLabels = [];
    let i = 1;
    for (const w of this.weeks) {
      for (const d of w.days) {
        this.reqWorkMinutes += d.requiredWorkMinutes;
        this.minutes += d.minutes;
        this.extraMinutes += d.extraMinutes;
        if ((d.isSimpleDay() && !d.isWeekend()) || d.isWorkDay()) {
          chartMinutes.push(d.minutes);
          chartRequiredWorkMinutes.push(d.requiredWorkMinutes);
          chartLabels.push(i + '');
        }
        if (!d.isEmptyDay()) {
          i++;
        }
      }
    }
    this.chartLabels = chartLabels;
    this.chartData = [];
    this.chartData.push({ data: chartMinutes, label: 'Work minutes'});
    this.chartData.push({ data: chartRequiredWorkMinutes, label: 'Required work minutes'});
    console.log(this.chartData);
    console.log(this.chartLabels);
  }

  public getDays(): MyDate[] {
    return this.workDays;
  }

  public getWeeks(): Week[] {
    return this.weeks;
  }

  public getSelectedDay(): MyDate {
    return this.workDays[this.selectedDay];
  }

  public setSelectedDayIfExist(date: MyDate): boolean {
    let i = 0;
    for (const day of this.workDays) {
      if (date.date.getDate() === day.date.getDate()) {
        this.selectedDay = i;
        return true;
      }
      i++;
    }

    return false;
  }

  public clear() {
    this.weeks = [];
    this.workDays = [];
  }

  public fillWeek(): void {
    const week = this.lastWeek();
    if (week) {
      while (!week.isFull()) {
        week.days.push(new MyDate());
      }
    }
  }

  public addDay(day: MyDate): void {
    let week = this.lastWeek();
    if (!week || week.isFull()) {
      this.newWeek();
      week = this.lastWeek();
    }
    week.days.push(day);
    this.addWorkDay(day);
  }

  public addWorkDay(day: MyDate): void {
    if (day.isWorkDay()) {
      this.workDays.push(day);
    }
  }

  private lastWeek(): Week {
    return this.weeks[this.weeks.length - 1];
  }

  private newWeek(): void {
    this.weeks.push(new Week());
  }
}
