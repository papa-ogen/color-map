declare interface window {
  figma: any;
}

export interface ParameterInputEvent {
  query: string;
  result: any;
}

export interface RunEvent {
  parameters: any;
}

export interface ParameterValues {
  [key: string]: any;
}
