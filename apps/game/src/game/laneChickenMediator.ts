/* eslint-disable import/prefer-default-export */
import * as Pixi from 'pixi.js';

import { EndChickenAsset } from './assets/endChickenAsset';
import { BackgroundLane } from './backgroundLane';
import { Chicken, ChickenState } from './chicken';
import { type Game } from './game';
import { LaneElement } from './laneElement';

export class LaneChickenMediator {
  private laneElements: LaneElement[] = [];

  public readonly view = new Pixi.Container();

  public readonly chicken: Chicken;

  public readonly lane: BackgroundLane;

  public readonly endChicken: Pixi.Sprite;

  constructor(game: Game, public readonly laneId: number) {
    this.lane = new BackgroundLane();
    this.view.addChild(this.lane);

    let xPos = this.lane.startSize + this.lane.laneWidth * 0.5;
    for (let i = 0; i < this.lane.lanes; i++) {
      const laneElement = new LaneElement(i === this.lane.lanes - 1);

      laneElement.position.set(xPos, this.lane.height / 2);
      xPos += this.lane.laneWidth;
      this.lane.addChild(laneElement);
      this.laneElements.push(laneElement);
    }

    this.endChicken = game.loader.sprites[EndChickenAsset.id];
    this.view.addChild(this.endChicken);
    this.endChicken.anchor.set(0.5, 0.5);
    this.endChicken.scale.set(0.07, 0.07);
    this.endChicken.position.set(
      this.lane.startSize +
      this.lane.lanes * this.lane.laneWidth +
      this.lane.endSize / 2,
      this.lane.laneHeight / 2,
    );

    this.chicken = new Chicken(game);
    this.view.addChild(this.chicken);

    this.reset();
  }

  public reset(): void {
    this.chicken.chickenState = ChickenState.Default;
    this.chicken.position.set(
      this.lane.startSize * 0.5,
      this.lane.laneHeight * 0.5,
    );

    this.laneElements.forEach((laneElement) => {
      laneElement.reset();
    });
  }

  public setChickenOnLaneStep(laneStep: number): void {
    this.chicken.position.set(
      this.lane.startSize + this.lane.laneWidth * laneStep,
      this.lane.height / 2,
    );
  }

  public get playerLane(): boolean {
    return this.laneId === 0;
  }
}
