/* eslint-disable class-methods-use-this */
/* eslint-disable import/prefer-default-export */
export class DocumentHandler {
  public canvas!: HTMLCanvasElement;

  public canvasContext!: WebGL2RenderingContext;

  public element!: HTMLElement | null;

  public init() {
    const canvasData = this.createCanvas();
    this.canvasContext = canvasData.ctx as WebGL2RenderingContext;
    this.canvas = canvasData.canvas;
    this.element = this.getElement('gameArea');
    this.element.appendChild(this.canvas);

    this.canvas.style.margin = 'auto';
    this.canvas.style.display = 'block';
    this.canvas.style.height = '100%';
    this.canvas.style.width = '100%';
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
    ctx: unknown;
    canvas: HTMLCanvasElement;
  } {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('webgpu', {
      stencil: true,
    });
    if (ctx === null) {
      throw new Error('App, unable to create canvas context');
    }
    return { canvas, ctx };
  }
}
