/* eslint-disable import/prefer-default-export */
interface WindowExt extends Window {
  mozRequestAnimationFrame?: (callback: FrameRequestCallback) => number;
  webkitRequestAnimationFrame?: (callback: FrameRequestCallback) => number;
}

export function requestAnimationFrame(): (
  callback: FrameRequestCallback,
) => number {
  return (
    window.requestAnimationFrame ||
    (window as WindowExt).webkitRequestAnimationFrame ||
    (window as WindowExt).mozRequestAnimationFrame ||
    function fallback(callback: FrameRequestCallback): number {
      window.setTimeout(callback, 1000 / 30);
      return 0;
    }
  );
}
