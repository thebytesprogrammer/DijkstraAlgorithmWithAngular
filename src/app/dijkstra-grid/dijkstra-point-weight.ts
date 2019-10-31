export class Point {

  public name: string;
  public X: number;
  public Y: number;

  constructor(Name: string, x: number, y: number) {

    this.name = Name;
    this.X = x;
    this.Y = y;
  }
}

export class Weight {

  public oPoint: Point; // Origin Point
  public dPoint: Point; // Desgination Point
  public weight: number;

  constructor(oP: Point, dP: Point, w: number) {

    this.oPoint = oP;
    this.dPoint = dP;
    this.weight = w;
  }
}
