import { Component, OnInit } from '@angular/core';
import { TimerClockComponent } from '../timer-clock/timer-clock.component';
import { TimerService } from '../timer-clock/timer.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-schedule-item',
  standalone: true,
  imports: [TimerClockComponent, NgIf],
  templateUrl: './schedule-item.component.html',
  styleUrl: './schedule-item.component.css',
})
export class ScheduleItemComponent implements OnInit {
  classNum: number | null = null;
  isBreakTime: boolean = false;

  constructor(private timerService: TimerService) {}

  ngOnInit(): void {
    // Subscribe to the timer observable to get classNum
    this.timerService.getTimeObservable().subscribe(() => {
      this.classNum = this.timerService.classNum;
    });

    // Subscribe to the break time observable to update the status
    this.timerService.getBreakTimeObservable().subscribe((isBreak) => {
      this.isBreakTime = isBreak; // Update break time status dynamically
    });
  }
}
