import { Component, inject, input } from '@angular/core';
import { TasksService } from '../task.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './Header.html',
  styleUrl: './Header.css',
})
export class Header {
  tasksService = inject(TasksService);
}
