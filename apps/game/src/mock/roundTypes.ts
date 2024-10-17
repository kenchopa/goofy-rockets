/* eslint-disable @typescript-eslint/naming-convention */
export enum RoundStepType {
  Normal = 'normal',
  Crash = 'crash',
}

export interface RoundStep {
  type: RoundStepType;
  multiplierValue: number;
}
