import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-video-background',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="video-background">
    <video #video autoplay muted playsinline preload="auto" poster="assets/hero-poster.png"
      (loadedmetadata)="onLoaded()" (timeupdate)="onTimeUpdate()" (ended)="onEnded()">
      <source src="assets/hero-video.mp4" type="video/mp4" />
    </video>
    <div class="video-overlay"></div>
  </div>
  `,
  styles: [`
    .video-background {
      position: absolute;
      inset: 0;
      overflow: hidden;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      background: url('/assets/image-assert.png') center/cover no-repeat;
      background-size: cover;
    }
    .video-background video {
      position: absolute;
      top: 0;
      left: 50%;
      width: 115%;
      height: 115%;
      object-fit: cover;
      object-position: center center;
      transform: translateX(-50%);
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    .video-overlay {
      position: absolute;
      inset: 0;
      background: rgba(3, 15, 45, 0.45);
      pointer-events: none;
    }
  `]
})
export class VideoBackgroundComponent {
  @ViewChild('video', { static: true }) videoRef!: ElementRef<HTMLVideoElement>;
  opacity = 0;
  private fadeFrame?: number;
  private fadingOut = false;

  onLoaded() {
    this.setOpacity(0);
    this.fadeTo(1, 250);
  }

  onTimeUpdate() {
    const video = this.videoRef.nativeElement;
    if (!video.duration || this.fadingOut) {
      return;
    }
    const remaining = video.duration - video.currentTime;
    if (remaining <= 0.55) {
      this.fadingOut = true;
      this.fadeTo(0, 250);
    }
  }

  onEnded() {
    const video = this.videoRef.nativeElement;
    this.cancelFade();
    this.setOpacity(0);
    setTimeout(() => {
      video.currentTime = 0;
      video.play();
      this.fadingOut = false;
      this.fadeTo(1, 250);
    }, 100);
  }

  private fadeTo(target: number, duration: number) {
    this.cancelFade();
    const start = performance.now();
    const from = this.opacity;
    const delta = target - from;
    const step = (time: number) => {
      const progress = Math.min((time - start) / duration, 1);
      this.setOpacity(from + delta * progress);
      if (progress < 1) {
        this.fadeFrame = requestAnimationFrame(step);
      } else {
        this.fadeFrame = undefined;
        if (target === 0) this.fadingOut = false;
      }
    };
    this.fadeFrame = requestAnimationFrame(step);
  }

  private cancelFade() {
    if (this.fadeFrame !== undefined) {
      cancelAnimationFrame(this.fadeFrame);
      this.fadeFrame = undefined;
    }
  }

  private setOpacity(value: number) {
    this.opacity = value;
    if (this.videoRef?.nativeElement) {
      this.videoRef.nativeElement.style.opacity = `${value}`;
    }
  }
}
