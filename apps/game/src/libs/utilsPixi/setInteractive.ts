/* eslint-disable @typescript-eslint/naming-convention */
import * as Pixi from 'pixi.js';

/**
 * @remarks
 * PixiEventModes.None: Ignores all interaction events, even on its children.
 * PixiEventModes.Passive: Does not emit events and ignores all hit testing on itself and non-interactive children. Interactive children will still emit events.
 * PixiEventModes.Auto: Does not emit events but is hit tested if parent is interactive. Same as interactive = false in v7
 * PixiEventModes.Static: Emit events and is hit tested. Same as interaction = true in v7
 * PixiEventModes.Dynamic: Emits events and is hit tested but will also receive mock interaction events fired from a ticker to allow for interaction when the mouse isn't moving
 *
 * * @see {@link https://pixijs.download/dev/docs/PIXI.DisplayObject.html#eventMode}
 */
export enum PixiEventModes {
  None = 'none',
  Passive = 'passive',
  Auto = 'auto',
  Static = 'static',
  Dynamic = 'dynamic',
}

export function setInteractive(
  view: Pixi.Container,
  interactive: boolean,
): void {
  view.eventMode = interactive ? PixiEventModes.Static : PixiEventModes.Auto;
}

export function getInteractive(view: Pixi.Container): boolean {
  return view.eventMode === PixiEventModes.Static;
}
