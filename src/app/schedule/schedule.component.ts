import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { TimerService } from '../timer/timer-clock/timer.service';
import { EditScheduleComponent } from './edit-schedule/edit-schedule.component';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [EditScheduleComponent, NgFor],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.css',
})
export class ScheduleComponent implements OnInit, AfterViewInit {
  @ViewChildren('scheduleNum') scheduleNums!: QueryList<ElementRef>;

  classNum: number | null = null;
  schedule: any[] = [];

  constructor(private timerService: TimerService) {}

  ngOnInit(): void {
    // Load the initial schedule from local storage if it exists
    const savedSchedule = localStorage.getItem('savedSchedule');

    if (savedSchedule) {
      this.schedule = JSON.parse(savedSchedule).map((item: any) => ({
        hour: Number(item.hour),
        minute: Number(item.minute),
        breakDuration: Number(item.breakDuration),
      }));
      this.timerService.updateSchedule(this.schedule); // Update the service with the loaded schedule
    } else {
      this.schedule = this.timerService.defaultSchedule; // Use default schedule
    }

    // Subscribe to schedule updates from TimerService
    this.timerService.getScheduleObservable().subscribe((newSchedule) => {
      this.schedule = newSchedule;
    });

    // Update the schedule in the service if it was loaded from local storage
    this.timerService.updateSchedule(this.schedule);
  }

  // Helper function to format time
  formatTime(hour: number, minute: number): string {
    return `${hour}:${minute < 10 ? '0' + minute : minute}`; // Simple formatting function
  }

  ngAfterViewInit(): void {
    this.updateBackgroundColors();
  }
  updateBackgroundColors(): void {
    if (!this.scheduleNums || this.classNum === null) return;

    // Reset the background color for all schedule elements
    this.scheduleNums.forEach((scheduleNum: ElementRef, index: number) => {
      const element = scheduleNum.nativeElement as HTMLElement;
      element.style.backgroundColor = ''; // Reset to default
    });

    // Find the element corresponding to classNum and apply the background color
    const matchingElement = this.scheduleNums.find(
      (_, index) => index + 1 === this.classNum
    );
    if (matchingElement) {
      const element = matchingElement.nativeElement as HTMLElement;
      element.style.backgroundColor = '#b7a6d7';
    }
  }
}
