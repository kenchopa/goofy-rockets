/* eslint-disable class-methods-use-this */
/* eslint-disable import/prefer-default-export */
export class DocumentHandler {
  public canvas!: HTMLCanvasElement;

  public canvasContext!: WebGL2RenderingContext;

  public element!: HTMLElement | null;

  public init() {
    const canvasData = this.createCanvas();
    this.canvasContext = canvasData.ctx;
    this.canvas = canvasData.canvas;
    this.element = this.getElement('gameArea');
  }

  private getElement(id: string): HTMLElement {
    const element = document.getElementById(id);
    if (!element) {
      throw new Error(
        `App, DOC element with id: ${id} could not be found on the page`,
      );
    }
    return element;
  }

  private createCanvas(): {
    ctx: WebGL2RenderingContext;
    canvas: HTMLCanvasElement;
  } {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('webgl2', {
      stencil: true,
    });
    if (ctx === null) {
      throw new Error('App, unable to create canvas context');
    }
    return { canvas, ctx };
  }
}
