import { Component, effect, inject, input, output } from '@angular/core';
import { FilterType, Task } from '../app';
import { TasksService } from '../task.service';

@Component({
  selector: 'app-list-tasks',
  imports: [],
  templateUrl: './ListTasks.html',
  styleUrl: './ListTasks.css',
})
export class ListTasks {
  tasksService = inject(TasksService);

  filter = input<FilterType>('all');

  constructor() {
    effect(() => {
      const current = this.filter();
      if (current === 'all' || current === 'pending' || current === 'completed') {
        this.tasksService.setFilter(current);
      }
    });
  }
}
