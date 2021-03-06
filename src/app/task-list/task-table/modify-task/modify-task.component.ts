import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModifyTaskRB } from '../../../shared/classes/backend/modifyTaskRB';
import { Task } from '../../../shared/classes/backend/task';
import { ErrorModalComponent } from '../../../modals/error-modal/error-modal.component';
import { NetworkService, STATUS_CODE_NOT_MODIFIED } from '../../../shared/services/network.service';
import { WeekService } from '../../../shared/services/week.service';
import { TaskTableComponent } from '../task-table.component';

@Component({
  selector: 'app-modify-task',
  templateUrl: 'modify-task.component.html',
  styleUrls: ['modify-task.component.scss'],
})

export class ModifyTaskComponent {
  @Input() public selectedTask: Task;
  @Input() public newTaskId = '';
  @Input() public newComment = '';
  @Input() public newStartTime = '';
  @Input() public newEndTime = '';

  @Output() public modify = new EventEmitter();

  constructor(
    private weekService: WeekService,
    private networkService: NetworkService,
  ) {}

  public modifyTask(): void {
    if (!this.selectedTask.startingTime) {
      return;
    }

    const modifyTask = new ModifyTaskRB(this.weekService.getSelectedDay(), this);
    this.networkService.modifyTask(modifyTask)
      .subscribe(
        () => this.modify.emit(modifyTask.newEndTime),
        (error) => {
          if (error.status === STATUS_CODE_NOT_MODIFIED) {
            ErrorModalComponent.show('Invalid data');
          }
        }
      );
  }

  public setEndTime(): void {
    this.newEndTime = TaskTableComponent.nextQuarterHour(this.selectedTask);
  }
}
