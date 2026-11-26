import { Component, inject } from '@angular/core';
import { Header } from './Header/Header';
import { InputNewTask } from './InputNewTask/InputNewTask';
import { ListTasks } from './ListTasks/ListTasks';
import { TasksService } from './task.service';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

export interface Task {
  id: number;
  name: string;
  completed: boolean;
}

export type FilterType = 'all' | 'pending' | 'completed';
@Component({
  imports: [Header, InputNewTask, RouterOutlet, RouterLink, RouterLinkActive],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  tasksService = inject(TasksService);
}
