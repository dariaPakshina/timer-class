import { Component } from '@angular/core';
import { TimerClockComponent } from './timer-clock/timer-clock.component';
import { ScheduleItemComponent } from './schedule-item/schedule-item.component';
import { TimerService } from './timer-clock/timer.service';

@Component({
  selector: 'app-timer',
  standalone: true,
  imports: [TimerClockComponent, ScheduleItemComponent],
  templateUrl: './timer.component.html',
  styleUrl: './timer.component.css',
})
export class TimerComponent {}
