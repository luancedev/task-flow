import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { forkJoin } from 'rxjs';

export interface Task {
  id: string;
  name: string;
  completed: boolean;
}

export type FilterType = 'all' | 'pending' | 'completed';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private http = inject(HttpClient);
  private readonly apiURL = 'http://localhost:3000/tasks';

  private _tasks = signal<Task[]>([]);
  private _filter = signal<FilterType>('all');
  private _isLoading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  readonly filter = this._filter.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  readonly nPending = computed(() => this._tasks().filter((t) => !t.completed).length);
  readonly nCompleted = computed(() => this._tasks().filter((t) => t.completed).length);

  readonly filteredTasks = computed(() => {
    const current = this._filter();
    const all = this._tasks();

    if (current === 'pending') return all.filter((t) => !t.completed);
    if (current === 'completed') return all.filter((t) => t.completed);
    return all;
  });

  constructor() {
    this.loadTasks();
  }

  // GET: Obtener todas las tareas del servidor
  loadTasks() {
    this._isLoading.set(true);
    this._error.set(null);

    this.http.get<Task[]>(this.apiURL).subscribe({
      next: (tasks) => {
        this._tasks.set(tasks);
        this._isLoading.set(false);
      },
      error: () => {
        this._error.set('No se pudo conectar al servidor');
        this._isLoading.set(false);
      },
    });
  }

  setFilter(filter: FilterType) {
    this._filter.set(filter);
  }

  // POS: Crear tareas en el servidor
  addTask(name: string) {
    // Omit<Task, 'id'> significa: envía el objeto sin 'id', el servidor lo genera solo
    const newTask: Omit<Task, 'id'> = { name, completed: false };

    this.http.post<Task>(this.apiURL, newTask).subscribe({
      next: (createTask) => {
        this._tasks.update((list) => [...list, createTask]);
      },
      error: () => this._error.set('Error al guardar la tarea.'),
    });
  }

  // PATCH: Actulizar estado de la tarea
  toggleTask(id: string) {
    const task = this._tasks().find((t) => t.id === id);
    if (!task) return;

    const updateStatus = !task.completed;

    this.http.patch<Task>(`${this.apiURL}/${id}`, { completed: updateStatus }).subscribe({
      next: (updatedTask) => {
        this._tasks.update((list) => list.map((t) => (t.id === id ? updatedTask : t)));
      },
      error: () => this._error.set('Error al actualizar la tarea.'),
    });
  }

  // DELETE: Eliminar tarea del servidor
  deleteTask(id: string) {
    this.http.delete(`${this.apiURL}/${id}`).subscribe({
      next: () => {
        this._tasks.update((list) => list.filter((t) => t.id !== id));
      },
      error: () => this._error.set('Error al eliminar la tarea.'),
    });
  }

  clearTasksComplete() {
    const completedTasks = this._tasks().filter((t) => t.completed);
    const deleteRequests = completedTasks.map((t) => this.http.delete(`${this.apiURL}/${t.id}`));

    forkJoin(deleteRequests).subscribe({
      next: () => {
        this._tasks.update((list) => list.filter((t) => !t.completed));
      },
      error: () => this._error.set('Error al limpiar las tareas completadas.'),
    });
  }
}
