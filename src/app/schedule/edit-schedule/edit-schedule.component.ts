import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TimerService } from '../../timer/timer-clock/timer.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-edit-schedule',
  standalone: true,
  imports: [FormsModule, NgFor],
  templateUrl: './edit-schedule.component.html',
  styleUrl: './edit-schedule.component.css',
})
export class EditScheduleComponent implements OnInit {
  @ViewChild('appEditingScreen') editingScreen!: ElementRef; // Reference the element
  schedule: any[] = []; // Holds the schedule from the TimerService
  defaultSchedule: any[] = []; // Holds the default schedule for reference
  tempSchedule: any[] = []; // Temporary schedule for editing

  constructor(private timerService: TimerService) {}

  ngOnInit(): void {
    this.timerService.getScheduleObservable().subscribe((schedule) => {
      this.schedule = schedule;
      this.tempSchedule = JSON.parse(JSON.stringify(schedule)); // Create a deep copy for editing
    });
    this.defaultSchedule = this.timerService.defaultSchedule; // Assuming you expose this in the TimerService
  }

  ngAfterViewInit(): void {}

  onEdit(): void {
    this.timerService.playAudio();
    if (this.editingScreen) {
      const element = this.editingScreen.nativeElement as HTMLElement;
      element.style.display = 'block'; // Set display to block to make it visible
    }
  }

  onHide(): void {
    if (this.editingScreen) {
      const element = this.editingScreen.nativeElement as HTMLElement;
      element.style.display = 'none'; // Hide the element by setting display to none
    }
  }

  onSubmit() {
    // Update the schedule in the service
    this.timerService.updateSchedule(this.tempSchedule);
    localStorage.setItem('savedSchedule', JSON.stringify(this.tempSchedule));
    this.onHide(); // Hide the form after saving
  }

  onCancel() {
    this.tempSchedule = JSON.parse(JSON.stringify(this.schedule)); // Reset tempSchedule to the original schedule
    this.onHide(); // Hide the form after canceling
  }
}
