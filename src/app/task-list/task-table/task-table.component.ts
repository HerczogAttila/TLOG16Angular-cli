import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from '../../shared/classes/backend/task';
import { DeleteTaskRB } from '../../shared/classes/backend/deleteTaskRB';
import { WeekService } from '../../shared/services/week.service';
import { FinishingTaskRB } from '../../shared/classes/backend/finishingTaskRB';
import { StartTaskRB } from '../../shared/classes/backend/startTaskRB';
import { ErrorModalComponent } from '../../modals/error-modal/error-modal.component';
import { STATUS_CODE_NOT_MODIFIED, NetworkService } from '../../shared/services/network.service';
import { ConfirmModalComponent } from '../../modals/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-task-table',
  templateUrl: 'task-table.component.html',
  styleUrls: ['task-table.component.scss'],
})

export class TaskTableComponent {
  @Input() public tasks: Task[];
  @Output() public refresh = new EventEmitter();

  public taskId = TaskTableComponent.GenerateRandomTaskId();
  public comment = '';
  public startTime = TaskTableComponent.getActualTimeString();

  public selectedTask: Task;
  private requestDeleteTask: Task;

  public static nextQuarterHour(task: Task): string {
    const startDate = TaskTableComponent.getDateFromTimeString(task.startingTime);
    const endDate = new Date();
    let minutes = (endDate.getTime() - startDate.getTime()) / 60000;
    minutes -= minutes % 15 - 15;
    if (minutes < 15) {
      minutes = 15;
    }

    startDate.setMinutes(startDate.getMinutes() + minutes);

    return TaskTableComponent.dateToTimeString(startDate);
  }

  private static getDateFromTimeString(time: string): Date {
    const date = new Date();
    const split = time.split(':');
    date.setHours(+split[0]);
    date.setMinutes(+split[1]);

    return date;
  }

  private static getActualTimeString(): string {
    return TaskTableComponent.dateToTimeString(new Date());
  }

  private static dateToTimeString(date: Date): string {
    let minutes = date.getMinutes() + '';
    if (date.getMinutes() < 10) {
      minutes = '0' + minutes;
    }

    return date.getHours() + ':' + minutes;
  }
  private static GenerateRandomTaskId(): string {
    let taskId = '';
    for (let i = 0; i < 4; i++) {
      taskId += Math.round(Math.random() * 9);
    }
    return taskId;
  }

  constructor(
    private weekService: WeekService,
    private networkService: NetworkService,
  ) {}

  public onCreateTask(): void {
    const startTask = new StartTaskRB(this.weekService.getSelectedDay(), this.taskId, this.comment, this.startTime);
    this.networkService.startTask(startTask)
      .subscribe(
        () => {
          this.refresh.emit();
          this.taskId = TaskTableComponent.GenerateRandomTaskId();
          this.comment = '';
          this.startTime = TaskTableComponent.getActualTimeString();
        },
        error => {
          if (error.status === STATUS_CODE_NOT_MODIFIED) {
            ErrorModalComponent.show('The task can not be created');
          }
        }
      );
  }

  public onRequestDeleteTask(task: Task): void {
    this.requestDeleteTask = task;
    ConfirmModalComponent.show('Are you sure you delete this task?',
      () => this.onConfirmDeleteTask());
  }

  public onConfirmDeleteTask(): void {
    if (!this.requestDeleteTask || !this.requestDeleteTask.startingTime) {
      return;
    }

    if (this.selectedTask === this.requestDeleteTask) {
      this.selectedTask = null;
    }

    const deleteTask = new DeleteTaskRB(this.weekService.getSelectedDay(), this.requestDeleteTask);
    this.networkService.deleteTask(deleteTask)
      .subscribe(() => this.refresh.emit());
  }

  public finishingTask(task: Task): void {
    if (!task || !task.startingTime) {
      return;
    }
    const endTime = TaskTableComponent.nextQuarterHour(task);

    const finishingTask = FinishingTaskRB.create(this.weekService.getSelectedDay(), task, endTime);
    this.networkService.finishingTask(finishingTask)
      .subscribe(
        () => {
          this.startTime = endTime;
          this.refresh.emit();
        },
        (error) => {
          if (error.status === STATUS_CODE_NOT_MODIFIED) {
            ErrorModalComponent.show('Invalid data');
          }
        }
      );
  }

  public onSelectTask(task: Task): void {
    this.selectedTask = task;
  }

  public onModifyTask(endTime: string): void {
    this.refresh.emit();
    this.startTime = endTime;
    this.selectedTask = null;
  }
}
