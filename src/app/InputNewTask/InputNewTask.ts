import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { TasksService } from '../task.service';

function notOnlySpaces(control: AbstractControl): ValidationErrors | null {
  const value = control.value as string;
  if (value && value.trim().length === 0) {
    return { onlySpaces: true };
  }
  return null;
}

@Component({
  selector: 'app-input-new-task',
  imports: [ReactiveFormsModule],
  templateUrl: './InputNewTask.html',
  styleUrl: './InputNewTask.css',
})
export class InputNewTask {
  private tasksService = inject(TasksService);

  // Control de validaciones
  taskForm = new FormGroup({
    taskName: new FormControl('', {
      nonNullable: true, // asegura que .reset() vuelva a ''
      validators: [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(300),
        notOnlySpaces,
      ],
    }),
  });

  get taskControl() {
    return this.taskForm.controls.taskName;
  }

  addTasks() {
    if (this.taskControl.invalid) return;

    const text = this.taskControl.value.trim();
    this.tasksService.addTask(text);

    this.taskControl.reset();
  }
}
