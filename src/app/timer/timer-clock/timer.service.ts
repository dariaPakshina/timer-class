import { Injectable } from '@angular/core';
import { BehaviorSubject, interval } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TimerService {
  private classDuration = 40; // Fixed duration for each class in minutes
  public classNum: number | null = null; // Stores the current class number
  private isBreakTimeSubject = new BehaviorSubject<boolean>(false); // Track break time status
  private timer$ = new BehaviorSubject<string>(''); // For sharing timer value across components

  // Schedule of class start times and corresponding break durations
  defaultSchedule = [
    { hour: 8, minute: 30, breakDuration: 5 },
    { hour: 9, minute: 15, breakDuration: 20 },
    { hour: 10, minute: 15, breakDuration: 20 },
    { hour: 11, minute: 15, breakDuration: 15 },
    { hour: 12, minute: 10, breakDuration: 10 },
    { hour: 13, minute: 0, breakDuration: 10 },
    { hour: 13, minute: 50, breakDuration: 10 },
    { hour: 14, minute: 40, breakDuration: 0 }, // No break after the last class
  ];

  // Store the schedule in a BehaviorSubject
  private scheduleSubject = new BehaviorSubject<any[]>([
    { hour: 8, minute: 30, breakDuration: 5 },
    { hour: 9, minute: 15, breakDuration: 20 },
    { hour: 10, minute: 15, breakDuration: 20 },
    { hour: 11, minute: 15, breakDuration: 15 },
    { hour: 12, minute: 10, breakDuration: 10 },
    { hour: 13, minute: 0, breakDuration: 10 },
    { hour: 13, minute: 50, breakDuration: 10 },
    { hour: 14, minute: 40, breakDuration: 0 },
  ]);

  constructor() {
    this.startTimer();
  }

  getScheduleObservable() {
    return this.scheduleSubject.asObservable();
  }

  updateSchedule(newSchedule: any[]) {
    this.scheduleSubject.next(newSchedule); // Emit updated schedule
    localStorage.setItem('savedSchedule', JSON.stringify(newSchedule)); // Save to local storage
  }

  private getInitialSchedule(): any[] {
    const savedSchedule = localStorage.getItem('savedSchedule');
    if (savedSchedule) {
      return JSON.parse(savedSchedule).map((item: any) => ({
        hour: Number(item.hour),
        minute: Number(item.minute),
        breakDuration: Number(item.breakDuration),
      }));
    } else {
      return this.defaultSchedule; // Return the default schedule if nothing is saved
    }
  }

  getTimeObservable() {
    return this.timer$.asObservable();
  }

  playAudio() {
    let audio = new Audio();
    audio.src = 'assets/school-bell.mp3'; // Correct path to the file in 'assets'
    audio.load();
    audio.play().catch((error) => console.error('Audio play error:', error));
  }

  private startTimer() {
    // Update every minute
    interval(1000).subscribe(() => {
      const now = new Date();
      const firstClassTime = this.getClassTime(
        this.scheduleSubject.getValue()[0]
      );
      if (now === firstClassTime) {
        this.timer$.next('Звонок');
        this.playAudio();
      }
      const lastClassEndTime = this.addMinutes(
        this.getClassTime(
          this.scheduleSubject.getValue()[
            this.scheduleSubject.getValue().length - 1
          ]
        ),
        this.classDuration
      );

      // If current time is earlier than first class or later than last class
      if (now < firstClassTime || now > lastClassEndTime) {
        this.classNum = 0;
        this.isBreakTimeSubject.next(false); // Not break time, as it's outside schedule
        this.timer$.next('0'); // Set timerText to "0"
        return;
      }

      const nextClassOrBreak = this.getNextClassOrBreak(now);

      if (nextClassOrBreak) {
        const timeLeft = this.getTimeLeft(nextClassOrBreak.time, now);
        const timeLeftForDisplay = Math.ceil(timeLeft / 60); // Display only minutes

        // Set classNum based on the current class index (incremented by 1)
        if (nextClassOrBreak.index !== undefined) {
          this.classNum = nextClassOrBreak.index + 1;
        }

        // If the timer hits zero, display "Звонок"
        if (timeLeftForDisplay === 0) {
          this.timer$.next('Звонок');
          this.playAudio();
        } else {
          this.timer$.next(`${timeLeftForDisplay}`);
        }

        // Emit whether it's break time or class time
        if (nextClassOrBreak.type === 'break') {
          this.isBreakTimeSubject.next(true);
        } else {
          this.isBreakTimeSubject.next(false);
        }
      }
    });
  }

  private getClassTime(scheduleTime: { hour: number; minute: number }): Date {
    const classTime = new Date();
    classTime.setHours(scheduleTime.hour, scheduleTime.minute, 0, 0);
    return classTime;
  }

  private addMinutes(date: Date, minutes: number): Date {
    return new Date(date.getTime() + minutes * 60000);
  }

  private getNextClassOrBreak(
    now: Date
  ): { time: Date; type: string; index?: number } | null {
    const schedule = this.scheduleSubject.getValue(); // Get current schedule value
    for (let i = 0; i < schedule.length; i++) {
      const classStartTime = this.getClassTime(schedule[i]);
      const classEndTime = this.addMinutes(classStartTime, this.classDuration);

      // Check if the current time is during a class
      if (now >= classStartTime && now < classEndTime) {
        return { time: classEndTime, type: 'class', index: i };
      }

      // Check if the current time is during a break (after class end but before the next class starts)
      if (i < schedule.length - 1) {
        const nextClassStartTime = this.getClassTime(schedule[i + 1]);
        const breakEndTime = this.addMinutes(
          classEndTime,
          schedule[i].breakDuration
        );
        if (now >= classEndTime && now < breakEndTime) {
          return { time: breakEndTime, type: 'break', index: i };
        }
      }
    }

    return null; // If no more classes or breaks
  }

  private getTimeLeft(nextPeriodTime: Date, now: Date): number {
    const diffMs = nextPeriodTime.getTime() - now.getTime();
    return Math.floor(diffMs / 1000); // Time left in seconds
  }

  getBreakTimeObservable() {
    return this.isBreakTimeSubject.asObservable();
  }
}
