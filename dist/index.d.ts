declare class VideoPlayer {
    private container;
    private video;
    private controls;
    private playBtn;
    private muteBtn;
    private timeRange;
    private forwardBtn;
    private backwardBtn;
    private fullScreenBtn;
    private volumeSlider;
    private speedSelect;
    private themeToggleBtn;
    private style;
    private skipTime;
    private controlColor;
    private prevVolume;
    private initialTheme;
    constructor(parentId: string, videoSrc: string, skipTime?: number, controlColor?: string, initialTheme?: string);
    private injectStyles;
    private createIcon;
    private initEvents;
    private togglePlay;
    private toggleMute;
    private adjustVolume;
    private updateVolume;
    private updateProgress;
    private changeDuration;
    private seekVideo;
    private skip;
    private changeSpeed;
    private toggleFullScreen;
    private toggleTheme;
}
