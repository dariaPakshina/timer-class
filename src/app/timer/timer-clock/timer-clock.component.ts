import { Component, OnInit } from '@angular/core';
import { ScheduleItemComponent } from '../schedule-item/schedule-item.component';
import { TimerService } from './timer.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-timer-clock',
  standalone: true,
  imports: [ScheduleItemComponent, NgIf],
  templateUrl: './timer-clock.component.html',
  styleUrl: './timer-clock.component.css',
})
export class TimerClockComponent implements OnInit {
  timerText: string = '';

  constructor(private timerService: TimerService) {}

  ngOnInit(): void {
    this.timerService.getTimeObservable().subscribe((time) => {
      this.timerText = time;
    });
  }
}
