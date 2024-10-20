import { Component } from '@angular/core';
import { ScheduleComponent } from './schedule/schedule.component';
import { TimerComponent } from './timer/timer.component';
import { ScheduleItemComponent } from './timer/schedule-item/schedule-item.component';
import { TimerClockComponent } from './timer/timer-clock/timer-clock.component';
import { EditScheduleComponent } from './schedule/edit-schedule/edit-schedule.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    ScheduleComponent,
    TimerComponent,
    ScheduleItemComponent,
    TimerClockComponent,
    EditScheduleComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {}
