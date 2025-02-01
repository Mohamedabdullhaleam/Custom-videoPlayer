class VideoPlayer {
  private container: HTMLDivElement;
  private video: HTMLVideoElement;
  private controls: HTMLDivElement;
  private playBtn: HTMLElement;
  private muteBtn: HTMLElement;
  private timeRange: HTMLInputElement;
  private forwardBtn: HTMLElement;
  private backwardBtn: HTMLElement;
  private fullScreenBtn: HTMLElement;
  private volumeSlider: HTMLInputElement;
  private speedSelect: HTMLSelectElement;
  private themeToggleBtn: HTMLElement;
  private style: HTMLStyleElement = document.createElement("style");
  private skipTime: number;
  private controlColor: string;
  private prevVolume: number = 1;
  private initialTheme: string;

  constructor(
    parentId: string,
    videoSrc: string,
    skipTime: number = 5,
    controlColor: string = "#a26f77",
    initialTheme: string = "dark"
  ) {
    this.skipTime = skipTime;
    this.controlColor = controlColor;
    this.initialTheme = initialTheme;

    const parent = document.getElementById(parentId);
    if (!parent) throw new Error("Parent container not found");

    this.container = document.createElement("div");
    this.container.className = "video-player-container";

    this.video = document.createElement("video");
    this.video.className = "video-element";
    this.video.controls = false;

    const source = document.createElement("source");
    source.src = videoSrc;
    source.type = "video/mp4";
    this.video.appendChild(source);

    this.controls = document.createElement("div");
    this.controls.className = "controls-container";

    this.playBtn = this.createIcon("fa-play", "play");
    this.backwardBtn = this.createIcon("fa-backward", "backwardBtn");
    this.forwardBtn = this.createIcon("fa-forward", "forwardBtn");
    this.muteBtn = this.createIcon("fa-volume-high", "muteBtn");
    this.fullScreenBtn = this.createIcon("fa-expand", "fullscreenBtn");
    this.themeToggleBtn = this.createIcon("fa-moon", "themeToggleBtn");

    this.timeRange = document.createElement("input");
    this.timeRange.type = "range";
    this.timeRange.className = "seek-bar";
    this.timeRange.value = "0";

    this.volumeSlider = document.createElement("input");
    this.volumeSlider.type = "range";
    this.volumeSlider.className = "volume-slider";
    this.volumeSlider.min = "0";
    this.volumeSlider.max = "1";
    this.volumeSlider.step = "0.1";
    this.volumeSlider.value = "1";
    this.updateVolume();

    this.speedSelect = document.createElement("select");
    this.speedSelect.className = "speed-select";
    ["1", "0.5", "1.5", "2"].forEach((speed) => {
      const option = document.createElement("option");
      option.value = speed;
      option.textContent = `${speed}x`;
      this.speedSelect.appendChild(option);
    });

    this.controls.append(
      this.playBtn,
      this.backwardBtn,
      this.forwardBtn,
      this.timeRange,
      this.muteBtn,
      this.volumeSlider,
      this.speedSelect,
      this.fullScreenBtn,
      this.themeToggleBtn
    );

    this.container.append(this.video, this.controls);
    parent.appendChild(this.container);

    this.initEvents();
    this.injectStyles(parentId);

    this.container.className = `video-player-container-${parentId}`;
    this.video.className = `video-element-${parentId}`;
    this.controls.className = `controls-container-${parentId}`;
    this.timeRange.className = `seek-bar-${parentId}`;
    this.volumeSlider.className = `volume-slider-${parentId}`;
    this.speedSelect.className = `speed-select-${parentId}`;

    if (this.initialTheme === "light") {
      this.container.classList.add("light-theme");
      this.themeToggleBtn.classList.replace("fa-moon", "fa-sun");
    }
  }

  private injectStyles(parentId: string): void {
    this.style.textContent = `
      :root {
        --primary-color: ${this.controlColor};
        --background-color: #222;
        --text-color: #fff;
        --controls-bg: rgba(0, 0, 0, 0.8);
        --slider-bg: #555;
        --hover-color: rgba(255, 255, 255, 0.1);
      }

      .light-theme {
        --background-color: #f5f5f5;
        --text-color: #000;
        --controls-bg: rgba(255, 255, 255, 0.8);
        --slider-bg: #ddd;
        --hover-color: rgba(0, 0, 0, 0.1);
      }

      .video-player-container-${parentId} {
        width: 800px;
        background: var(--background-color);
        padding: 10px;
        border-radius: 15px;
        display: flex;
        flex-direction: column;
        align-items: center;
        color: var(--text-color);
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
      }

      .video-element-${parentId} {
        width: 100%;
        border-radius: 10px;
      }

      .controls-container-${parentId} {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: var(--controls-bg);
        padding: 10px;
        border-radius: 10px;
        margin-top: 10px;
        gap: 10px;
      }

      .controls-container-${parentId} i {
        color: ${this.controlColor};
        font-size: 24px;
        cursor: pointer;
        transition: color 0.2s, transform 0.2s;
      }

      .controls-container-${parentId} i:hover {
        color: ${this.controlColor}cc;
        transform: scale(1.1);
      }

      .seek-bar-${parentId} {
        flex: 1; /* Make the progress bar longer */
        height: 6px;
        appearance: none;
        background: linear-gradient(to right, ${this.controlColor} 0%, ${this.controlColor} 0%, var(--slider-bg) 0%);
        border-radius: 3px;
        outline: none;
        transition: background 0.2s;
        cursor: pointer;
      }

      .volume-slider-${parentId} {
        width: 80px; /* Make the volume slider shorter */
        height: 6px;
        appearance: none;
        background: linear-gradient(to right, ${this.controlColor} 0%, ${this.controlColor} 0%, var(--slider-bg) 0%);
        border-radius: 3px;
        outline: none;
        transition: background 0.2s;
        cursor: pointer;
      }

      .seek-bar-${parentId}::-webkit-slider-thumb, .volume-slider-${parentId}::-webkit-slider-thumb {
        appearance: none;
        background-color: ${this.controlColor};
        border-radius: 50%;
        height: 18px;
        width: 18px;
        cursor: pointer;
        position: relative;
        z-index: 2;
        transition: transform 0.2s;
      }

      .seek-bar-${parentId}::-webkit-slider-thumb:hover, .volume-slider-${parentId}::-webkit-slider-thumb:hover {
        transform: scale(1.2);
      }

      .seek-bar-${parentId}::-moz-range-thumb {
        background-color: ${this.controlColor};
        border-radius: 50%;
        height: 18px;
        width: 18px;
        cursor: pointer;
      }

      .speed-select-${parentId} {
        background: var(--background-color);
        color: ${this.controlColor};
        padding: 5px 10px;
        border: 1px solid ${this.controlColor};
        border-radius: 5px;
        cursor: pointer;
        font-size: 14px;
        transition: background 0.2s, color 0.2s;
      }

      .speed-select-${parentId}:hover {
        background: ${this.controlColor};
        color: var(--background-color);
      }

      .fullscreen-mode .controls-container-${parentId} {
        position: absolute;
        bottom: 10px;
        width: 100%;
        background: var(--controls-bg);
        padding: 10px;
        border-radius: 10px;
      }

      .fullscreen-mode {
        width: 100vw !important;
        height: 100vh !important;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }

      .fullscreen-mode .video-element {
        width: 100%;
        height: 90vh;
        border-radius: 0;
      }
    `;
    document.head.appendChild(this.style);
  }

  private createIcon(iconClass: string, id: string): HTMLElement {
    const icon = document.createElement("i");
    icon.className = `fa-solid ${iconClass} play-button`;
    icon.id = id;
    return icon;
  }

  private initEvents(): void {
    this.playBtn.addEventListener("click", () => this.togglePlay());
    this.muteBtn.addEventListener("click", () => this.toggleMute());
    this.timeRange.addEventListener("input", () => this.seekVideo());
    this.video.addEventListener("timeupdate", () => this.updateProgress());
    this.video.addEventListener("durationchange", () => this.changeDuration());
    this.forwardBtn.addEventListener("click", () => this.skip(this.skipTime));
    this.backwardBtn.addEventListener("click", () => this.skip(-this.skipTime));
    this.fullScreenBtn.addEventListener("click", () => this.toggleFullScreen());
    this.volumeSlider.addEventListener("input", () => this.adjustVolume());
    this.speedSelect.addEventListener("change", () => this.changeSpeed());
    this.themeToggleBtn.addEventListener("click", () => this.toggleTheme());
  }

  private togglePlay(): void {
    if (this.video.paused) {
      this.video.play();
      this.playBtn.classList.replace("fa-play", "fa-pause");
    } else {
      this.video.pause();
      this.playBtn.classList.replace("fa-pause", "fa-play");
    }
  }

  private toggleMute(): void {
    if (this.video.muted || this.video.volume === 0) {
      this.video.muted = false;
      this.video.volume = this.prevVolume > 0 ? this.prevVolume : 0.5;
      this.volumeSlider.value = String(this.video.volume);
      this.muteBtn.classList.replace("fa-volume-mute", "fa-volume-high");
    } else {
      this.prevVolume = this.video.volume;
      this.video.muted = true;
      this.video.volume = 0;
      this.volumeSlider.value = "0";
      this.muteBtn.classList.replace("fa-volume-high", "fa-volume-mute");
    }
    this.updateVolume();
  }

  private adjustVolume(): void {
    const volume = Number(this.volumeSlider.value);
    this.video.muted = volume === 0 ? true : false;
    this.video.volume = volume;
    this.muteBtn.classList.toggle("fa-volume-mute", volume === 0);
    this.muteBtn.classList.toggle("fa-volume-high", volume > 0);
    if (volume > 0) this.prevVolume = volume;
    this.updateVolume();
  }

  private updateVolume(): void {
    const volumeLevel = Number(this.volumeSlider.value) * 100;
    if (this.video.muted || this.video.volume === 0) {
      this.volumeSlider.style.background = `linear-gradient(to right, #555 0%, #555 100%)`;
    } else {
      this.volumeSlider.style.background = `linear-gradient(to right, ${this.controlColor} ${volumeLevel}%, #555 ${volumeLevel}%)`;
    }
  }

  private updateProgress(): void {
    const progress = (this.video.currentTime / this.video.duration) * 100;
    this.timeRange.value = String(this.video.currentTime);
    this.timeRange.style.background = `linear-gradient(to right, ${this.controlColor} ${progress}%, #555 ${progress}%)`;
  }

  private changeDuration(): void {
    this.timeRange.max = String(this.video.duration);
  }

  private seekVideo(): void {
    this.video.currentTime = Number(this.timeRange.value);
    const progress = (this.video.currentTime / this.video.duration) * 100;
    this.timeRange.style.background = `linear-gradient(to right, ${this.controlColor} ${progress}%, #555 ${progress}%)`;
  }

  private skip(seconds: number): void {
    this.video.currentTime += seconds;
  }

  private changeSpeed(): void {
    this.video.playbackRate = Number(this.speedSelect.value);
  }

  private async toggleFullScreen() {
    try {
      if (!document.fullscreenElement) {
        await this.container.requestFullscreen();
        this.container.classList.add("fullscreen-mode");
      } else {
        await document.exitFullscreen();
        this.container.classList.remove("fullscreen-mode");
      }
    } catch (err) {
      console.error("Error toggling fullscreen:", err);
    }
  }

  private toggleTheme(): void {
    this.container.classList.toggle("light-theme");
    const isLightTheme = this.container.classList.contains("light-theme");
    this.themeToggleBtn.classList.replace(
      isLightTheme ? "fa-moon" : "fa-sun",
      isLightTheme ? "fa-sun" : "fa-moon"
    );
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new VideoPlayer(
    "videoContainer",
    "./A Peek at pico - SNL.mp4",
    10,
    "#FF7F50",
    "light"
  );
  new VideoPlayer("videoContainer2", "./vid1.mp4", 15, "#800080", "dark");
});
