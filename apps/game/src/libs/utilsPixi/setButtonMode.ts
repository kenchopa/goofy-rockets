/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/naming-convention */
import * as Pixi from 'pixi.js';

export enum PixiCursor {
  Auto = 'auto',
  Default = 'default',
  None = 'none',
  ContextMenu = 'context-menu',
  Help = 'help',
  Pointer = 'pointer',
  Progress = 'progress',
  Wait = 'wait',
  Cell = 'cell',
  Crosshair = 'crosshair',
  Text = 'text',
  VerticalText = 'vertical-text',
  Alias = 'alias',
  Copy = 'copy',
  Move = 'move',
  NoDrop = 'no-drop',
  NotAllowed = 'not-allowed',
  EResize = 'e-resize',
  NResize = 'n-resize',
  NEResize = 'ne-resize',
  NWResize = 'nw-resize',
  SResize = 's-resize',
  SEResize = 'se-resize',
  SWResize = 'sw-resize',
  WResize = 'w-resize',
  NSResize = 'ns-resize',
  EWResize = 'ew-resize',
  NESWResize = 'nesw-resize',
  ColResize = 'col-resize',
  NWSEResize = 'nwse-resize',
  RowResize = 'row-resize',
  AllScroll = 'all-scroll',
  ZoomIn = 'zoom-in',
  ZoomOut = 'zoom-out',
  Grab = 'grab',
  Grabbing = 'grabbing',
}

export function setButtonMode(view: Pixi.Container, buttonMode: boolean): void {
  view.cursor = buttonMode ? PixiCursor.Pointer : PixiCursor.Default;
}

export function getButtonMode(view: Pixi.Container): boolean {
  return view.cursor === PixiCursor.Pointer;
}
