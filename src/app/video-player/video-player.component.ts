import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { Plugins} from '@capacitor/core';

const {capacitorVideoPlayer} = Plugins
interface Document extends HTMLDocument {
  mozCancelFullScreen: () => void;
  webkitExitFullscreen: () => void;
  mozFullScreenElement: () => void;
  webkitFullscreenElement: () => void;
}
@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss'],
})
export class VideoPlayerComponent {
  isLoading: boolean = false;
  isShowResetBtn: boolean = false;
  url =
    'https://raw.githubusercontent.com/Ahmetaksungur/twitter-video-player-clone/master/92456705_506989316849451_7379405183454806542_n.jpg';
  public displayControllsOpacity = 0;
  public isPlaying = false;
  public isFullVolume = true;
  public isFullScreen = false;
  public watchedProgress = 0;
  public loadPercentage = 0;
  public isLoadingContent = false;
  public controlsTimeout: any;

  @ViewChild('video') video!: ElementRef;
  @ViewChild('videoContainer') videoContainer!: ElementRef;
  @ViewChild('progressBar') progressBar!: ElementRef;
  public videoElement!: HTMLVideoElement;
  isShowPlayBtn: boolean = true;
  inputValue: number = 1;

  constructor(@Inject(DOCUMENT) private document: Document) {}
  ngAfterViewInit(): void {
    this.videoElement = this.video.nativeElement;
    this.videoContainer.nativeElement.addEventListener('mousemove', () => {
      this.displayControls();
    });
    this.document.addEventListener('fullscreenchange', () => {
      if (!document.fullscreenElement) {
        this.isFullScreen = false;
      } else {
        this.isFullScreen = true;
      }
    });

    this.document.addEventListener('keyup', (event) => {
      if (event.code === 'Space') {
        this.playPause();
      }
      if (event.code === 'KeyM') {
        this.toggleMute();
      }
      if (event.code === 'KeyF') {
        this.toggleFullScreen();
      }
      if (event.code === 'ArrowRight') {
        this.skip10Sec();
      }
      if (event.code === 'ArrowLeft') {
        this.reverse10Sec();
      }
      this.displayControls();
    });

    this.videoElement.addEventListener('timeupdate', () => {
      this.watchedProgress =
        (this.videoElement.currentTime / this.videoElement.duration) * 100;
    });

    // this.progressBar.nativeElement.addEventListener(
    //   'click',
    //   (event: { pageX: number }) => {
    //     const progressBarEle = this.progressBar.nativeElement as HTMLElement;
    //     const pos =
    //       (event.pageX -
    //         (progressBarEle.offsetLeft + progressBarEle.offsetLeft)) /
    //       progressBarEle.offsetWidth;
    //     this.videoElement.currentTime = pos * this.videoElement.duration;
    //   }
    // );

    this.videoElement.addEventListener('progress', () => {
      let range = 0;
      let bf = this.videoElement.buffered;
      let time = this.videoElement.currentTime;
      while (!(bf.start(range) <= time && time <= bf.end(range))) {
        range += 1;
      }
      let loadEndPercentage = bf.end(range) / this.videoElement.duration;
      this.loadPercentage = loadEndPercentage * 100;
    });

    this.videoElement.addEventListener('waiting', (data) => {
      this.isLoadingContent = true;
      this.isPlaying = false;
    });
    this.videoElement.addEventListener('playing', (data) => {
      this.isLoadingContent = false;
      this.isPlaying = true;
      this.isShowResetBtn = false;
    });

    this.videoElement.addEventListener('ended', (data) => {
      this.isLoadingContent = false;
      this.isPlaying = false;
      this.isShowResetBtn = true;
    });
  }

  displayControls() {
    this.displayControllsOpacity = 1;
    document.body.style.cursor = 'initial';
    if (this.controlsTimeout) {
      clearTimeout(this.controlsTimeout);
    }
    this.controlsTimeout = setTimeout(() => {
      if (this.isPlaying) {
        this.displayControllsOpacity = 0;
      } else {
        this.displayControllsOpacity = 1;
      }
      document.body.style.cursor = 'none';
    }, 3000);
  }

  playPause() {
    if (this.videoElement.paused) {
      this.isLoading = true;
      this.isShowPlayBtn = false;
      this.videoElement
        .play()
        .then(() => {
          setTimeout(() => {
            this.isLoading = false;
          }, 1000);
        })
        .catch((error) => {
          console.error('Failed to play the video:', error);
        });
    } else {
      this.videoElement.pause();
      this.isPlaying = false;
    }
  }

  toggleMute() {
    this.videoElement.muted = !this.videoElement.muted;
    if (this.videoElement.muted) {
      this.isFullVolume = false;
    } else {
      this.isFullVolume = true;
    }
  }

  toggleFullScreen() {
    if (
      !document.fullscreenElement &&
      !(document as Document).webkitFullscreenElement
    ) {
      this.openFullscreen();
    } else {
      this.closeFullscreen();
    }
  }

  openFullscreen() {
    if (this.videoContainer.nativeElement.requestFullscreen) {
      this.videoContainer.nativeElement.requestFullscreen();
    } else if (this.videoContainer.nativeElement.webkitRequestFullscreen) {
      this.videoContainer.nativeElement.webkitRequestFullscreen();
    }
  }

  closeFullscreen() {
    if ((document as Document).exitFullscreen) {
      (document as Document).exitFullscreen();
    } else if ((document as Document).webkitExitFullscreen) {
      (document as Document).webkitExitFullscreen();
    }
  }

  skip10Sec(seconds: number = 10) {
    this.videoElement.currentTime += seconds;
  }

  reverse10Sec(seconds: number = 10) {
    this.videoElement.currentTime -= seconds;
  }

  formatTime(value: number): string {
    const hours: number = Math.floor(value / 3600);
    const remainingMinutes: number = Math.floor(value % 3600);
    const minutes: number = Math.floor(remainingMinutes / 60);
    const seconds: number = Math.floor(remainingMinutes % 60);

    const formattedHours: string = hours < 10 ? '0' + hours : hours.toString();
    const formattedMinutes: string =
      minutes < 10 ? '0' + minutes : minutes.toString();
    const formattedSeconds: string =
      seconds < 10 ? '0' + seconds : seconds.toString();

    if (hours > 0) {
      return formattedHours + ':' + formattedMinutes + ':' + formattedSeconds;
    } else {
      return formattedMinutes + ':' + formattedSeconds;
    }
  }

  getBackgroundImage(): string {
    return !this.isShowPlayBtn ? 'none' : `url(${this.url})`;
  }

  seekTo(value: any) {
    const video = this.videoElement;
    const newTime = (value.target.value / 100) * video.duration;
    video.currentTime = newTime;
  }
}
