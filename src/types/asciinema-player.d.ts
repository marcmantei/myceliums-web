declare module "asciinema-player" {
  export function create(
    src: string,
    container: HTMLElement,
    opts?: {
      autoPlay?: boolean;
      speed?: number;
      preload?: boolean;
      loop?: boolean;
      fit?: string;
      terminalFontFamily?: string;
      theme?: string;
      cols?: number;
      rows?: number;
    }
  ): {
    dispose: () => void;
    play: () => void;
    pause: () => void;
    getCurrentTime: () => number;
    getDuration: () => number;
  };
}
