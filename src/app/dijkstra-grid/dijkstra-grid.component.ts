import { FormControl, FormGroup } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Point, Weight } from './dijkstra-point-weight';
import { DijkstraShortestDistance, SptPoint } from './dijkstra-calculate';
import { last } from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-dijkstra-grid',
  templateUrl: './dijkstra-grid.component.html',
  styleUrls: ['./dijkstra-grid.component.css']
})

export class DijkstraGridComponent implements AfterViewInit {

  @ViewChild('canvasEl') canvasEl: ElementRef;

  public points: Point[] = [];
  public weights: Weight[] = [];
  public pointsNamesArray: string[] = [];
  public sptSetM: SptPoint[][] = [];
  public weightsForm: FormGroup;
  public PointOrigin = '';
  public origin = '';
  public destination = '';
  public shortestPath = '';
  public lowestCost = '';
  public context: CanvasRenderingContext2D;
  public fillColor = 'red';

  constructor() {  }

  ngAfterViewInit() {

    this.context = (this.canvasEl.nativeElement as HTMLCanvasElement).getContext('2d');

    this.context.font = '18px Arial';
    this.context.textBaseline = 'middle';
    this.context.textAlign = 'center';
    this.context.strokeStyle = '#d5e0f2';
    this.context.lineWidth = 2;

    const x = (this.canvasEl.nativeElement as HTMLCanvasElement).width;
    const y = (this.canvasEl.nativeElement as HTMLCanvasElement).height;

    this.DefaultGraph();
  }

  ClearGrid() {

    this.context.clearRect(0, 0,  (this.canvasEl.nativeElement as HTMLCanvasElement).width,
    (this.canvasEl.nativeElement as HTMLCanvasElement).height);
  }

  AddPoint(pointName, xValue, yValue) {

    this.shortestPath = '';

    const aNewPoint: Point = new Point(pointName.value, Number(xValue.value), Number(yValue.value));

    let i = 0;

    while (i < this.points.length) {

      this.weights.push(new Weight(aNewPoint, this.points[i], Number.POSITIVE_INFINITY));

      i++;
    }

    this.points.push(aNewPoint);

    this.ClearGrid();
    this.drawWeights();
    this.draw();

    this.sptSetM.length = 0;
    this.sptSetM = [];
    let dijkstraCalculations: DijkstraShortestDistance;
    dijkstraCalculations = new DijkstraShortestDistance(this.points, this.weights, this.origin);
    this.sptSetM = dijkstraCalculations.Calculate();
    this.GetShortestDistance();
  }

  DeletePoint(pointName) {

    this.shortestPath = '';

    let index: number;

    index = this.points.findIndex(x => x.name === pointName.value);

    if (index !== -1) {
      this.points.splice(index, 1);
    }

    let i = 0;

    for (i = 0; i < this.weights.length; i++) {

      index = this.weights.findIndex(x => x.oPoint.name === pointName.value || x.dPoint.name === pointName.value);

      if (index !== -1) {

        this.weights.splice(index, 1);
      }
    }

    this.ClearGrid();
    this.drawWeights();
    this.draw();

    this.sptSetM.length = 0;
    this.sptSetM = [];
    let dijkstraCalculations: DijkstraShortestDistance;
    dijkstraCalculations = new DijkstraShortestDistance(this.points, this.weights, this.origin);
    this.sptSetM = dijkstraCalculations.Calculate();
    this.GetShortestDistance();
}

  private draw() {

    const x = (this.canvasEl.nativeElement as HTMLCanvasElement).width;
    const y = (this.canvasEl.nativeElement as HTMLCanvasElement).height;

    let i: number;

    for (i = 0; i < this.points.length; i++) {

      this.context.fillStyle = '#d5e0f2';
      this.context.fillRect(this.points[i].X, this.points[i].Y, 3, 3);

      this.context.fillStyle = this.fillColor;
      this.context.fillText(this.points[i].name, this.points[i].X, this.points[i].Y + 10);
    }
  }

  private drawWeights() {

    let i: number;

    this.context.fillStyle = 'yellow';

    for (i = 0; i < this.weights.length; i++) {

      if (this.weights[i].weight !== 0 && this.weights[i].weight !== Number.POSITIVE_INFINITY) {

        this.context.beginPath();

        this.context.moveTo(this.weights[i].oPoint.X, this.weights[i].oPoint.Y);
        this.context.lineTo(this.weights[i].dPoint.X, this.weights[i].dPoint.Y);

        this.context.fillText(this.weights[i].weight.toString(),
          (this.weights[i].oPoint.X + this.weights[i].dPoint.X) / 2,
          ((this.weights[i].oPoint.Y + this.weights[i].dPoint.Y) / 2) + 10);

        this.context.stroke();
        this.context.closePath();
      }
    }
  }

  public CalculateShortestDistance(pointOrigin, pointDestination) {

    this.origin = pointOrigin.value;
    this.destination = pointDestination.value;

    if (this.origin !== '' && this.destination !== '') {

      if (this.sptSetM.length === 0 || this.PointOrigin === '' || this.PointOrigin !== this.origin) {

        this.PointOrigin = this.origin;

        let dijkstraCalculations: DijkstraShortestDistance;
        dijkstraCalculations = new DijkstraShortestDistance(this.points, this.weights, this.origin);

        this.sptSetM = dijkstraCalculations.Calculate();
      }

      this.GetShortestDistance();
    }
  }

  public GetShortestDistance() {

    if (this.sptSetM.length === 0 || this.PointOrigin === '' || this.PointOrigin !== this.origin) {

      this.PointOrigin = this.origin;

      let dijkstraCalculations: DijkstraShortestDistance;
      dijkstraCalculations = new DijkstraShortestDistance(this.points, this.weights, this.origin);

      this.sptSetM = dijkstraCalculations.Calculate();
    }

    let highestRow = this.sptSetM.length - 1;

    const shortestPathArray: string[] = [];

    let firstFind = false;

    let lastRecorded: SptPoint = new SptPoint('', 0, '');
    let currentWanted = this.destination;

    while (highestRow >= 0) {

      const index = this.sptSetM[highestRow].findIndex(z => z.name === currentWanted);

      if (index !== -1) {

        if (firstFind === false) {

          this.lowestCost = 'Cost = ' + this.sptSetM[highestRow][this.sptSetM[highestRow].findIndex(z => z.name === this.destination)].cost;
          firstFind = true;
        }

        if (this.sptSetM[highestRow][index] !== lastRecorded) {

          shortestPathArray.push(this.sptSetM[highestRow][index].name);
          lastRecorded = this.sptSetM[highestRow][index];
          currentWanted = this.sptSetM[highestRow][index].accessThrough;
        }
      }

      highestRow--;
    }

    this.shortestPath = '';

    shortestPathArray.push(this.origin);

    let k: number;
    for (k = shortestPathArray.length - 1; k >= 0; k--) {

      this.shortestPath += shortestPathArray[k] + '   ';
    }

    if (shortestPathArray.length === 1 && this.origin === this.destination) {

      this.lowestCost = 'Cost = ' + 0;
    } else if (shortestPathArray.length === 1 && this.origin !== this.destination) {

      this.lowestCost = 'Cost = ' + Number.POSITIVE_INFINITY;
    }
  }

  public AdjustWeight(event) {

    let linePointsArray: string[] = [];
    linePointsArray = event.target.id.split('___');

    const index = this.weights.findIndex(z => (z.oPoint.name === linePointsArray[0] && z.dPoint.name === linePointsArray[1])
                   || z.oPoint.name === linePointsArray[1] && z.dPoint.name === linePointsArray[0]);

    this.weights[index].weight = Number(event.target.value);

    this.ClearGrid();
    this.drawWeights();
    this.draw();

    this.sptSetM.length = 0;
    this.sptSetM = [];
    let dijkstraCalculations: DijkstraShortestDistance;
    dijkstraCalculations = new DijkstraShortestDistance(this.points, this.weights, this.origin);
    this.sptSetM = dijkstraCalculations.Calculate();
    this.GetShortestDistance();
  }

  public ClearGraph() {

    this.points.length = 0;
    this.weights.length = 0;

    this.ClearGrid();
    this.drawWeights();
    this.draw();

    this.sptSetM.length = 0;
    this.sptSetM = [];
    let dijkstraCalculations: DijkstraShortestDistance;
    dijkstraCalculations = new DijkstraShortestDistance(this.points, this.weights, this.origin);
    this.sptSetM = dijkstraCalculations.Calculate();
    this.GetShortestDistance();
  }

  public DefaultGraph() {

    this.ClearGraph();

    let i = 0;

    let aNewPoint = new Point('A', 10, 65);
    i = 0;
    while (i < this.points.length) {

      this.weights.push(new Weight(aNewPoint, this.points[i], Number.POSITIVE_INFINITY));

      i++;
    }
    this.points.push(aNewPoint);


    aNewPoint = new Point('B', 75,  10);
    i = 0;
    while (i < this.points.length) {

      this.weights.push(new Weight(aNewPoint, this.points[i], Number.POSITIVE_INFINITY));

      i++;
    }
    this.points.push(aNewPoint);


    aNewPoint = new Point('C', 140, 10);
    i = 0;
    while (i < this.points.length) {

      this.weights.push(new Weight(aNewPoint, this.points[i], Number.POSITIVE_INFINITY));

      i++;
    }
    this.points.push(aNewPoint);

    aNewPoint = new Point('D', 205, 10);
    i = 0;
    while (i < this.points.length) {

      this.weights.push(new Weight(aNewPoint, this.points[i], Number.POSITIVE_INFINITY));

      i++;
    }
    this.points.push(aNewPoint);

    aNewPoint = new Point('E', 270, 65);
    i = 0;
    while (i < this.points.length) {

      this.weights.push(new Weight(aNewPoint, this.points[i], Number.POSITIVE_INFINITY));

      i++;
    }
    this.points.push(aNewPoint);

    aNewPoint = new Point('F', 205, 130);
    i = 0;
    while (i < this.points.length) {

      this.weights.push(new Weight(aNewPoint, this.points[i], Number.POSITIVE_INFINITY));

      i++;
    }
    this.points.push(aNewPoint);

    aNewPoint = new Point('G', 140, 130);
    i = 0;
    while (i < this.points.length) {

      this.weights.push(new Weight(aNewPoint, this.points[i], Number.POSITIVE_INFINITY));

      i++;
    }
    this.points.push(aNewPoint);

    aNewPoint = new Point('H', 75, 130);
    i = 0;
    while (i < this.points.length) {

      this.weights.push(new Weight(aNewPoint, this.points[i], Number.POSITIVE_INFINITY));

      i++;
    }
    this.points.push(aNewPoint);

    aNewPoint = new Point('X', 140, 65);
    i = 0;
    while (i < this.points.length) {

      this.weights.push(new Weight(aNewPoint, this.points[i], Number.POSITIVE_INFINITY));

      i++;
    }
    this.points.push(aNewPoint);

    let index = this.weights.findIndex(z => (z.oPoint.name === this.points[0].name && z.dPoint.name === this.points[1].name)
                   || (z.oPoint.name === this.points[1].name && z.dPoint.name === this.points[0].name));
    this.weights[index].weight = 4;

    index = this.weights.findIndex(z => (z.oPoint.name === this.points[1].name && z.dPoint.name === this.points[2].name)
                   || (z.oPoint.name === this.points[2].name && z.dPoint.name === this.points[1].name));
    this.weights[index].weight = 8;

    index = this.weights.findIndex(z => (z.oPoint.name === this.points[2].name && z.dPoint.name === this.points[3].name)
                   || (z.oPoint.name === this.points[3].name && z.dPoint.name === this.points[2].name));
    this.weights[index].weight = 7;

    index = this.weights.findIndex(z => (z.oPoint.name === this.points[3].name && z.dPoint.name === this.points[4].name)
                   || (z.oPoint.name === this.points[4].name && z.dPoint.name === this.points[3].name));
    this.weights[index].weight = 9;

    index = this.weights.findIndex(z => (z.oPoint.name === this.points[4].name && z.dPoint.name === this.points[5].name)
                   || (z.oPoint.name === this.points[5].name && z.dPoint.name === this.points[4].name));
    this.weights[index].weight = 10;

    index = this.weights.findIndex(z => (z.oPoint.name === this.points[5].name && z.dPoint.name === this.points[6].name)
                   || (z.oPoint.name === this.points[6].name && z.dPoint.name === this.points[5].name));
    this.weights[index].weight = 2;

    index = this.weights.findIndex(z => (z.oPoint.name === this.points[6].name && z.dPoint.name === this.points[7].name)
                   || (z.oPoint.name === this.points[7].name && z.dPoint.name === this.points[6].name));
    this.weights[index].weight = 1;

    index = this.weights.findIndex(z => (z.oPoint.name === this.points[7].name && z.dPoint.name === this.points[0].name)
                   || (z.oPoint.name === this.points[0].name && z.dPoint.name === this.points[7].name));
    this.weights[index].weight = 8;

    index = this.weights.findIndex(z => (z.oPoint.name === this.points[1].name && z.dPoint.name === this.points[7].name)
                   || (z.oPoint.name === this.points[7].name && z.dPoint.name === this.points[1].name));
    this.weights[index].weight = 11;

    index = this.weights.findIndex(z => (z.oPoint.name === this.points[2].name && z.dPoint.name === this.points[8].name)
                   || (z.oPoint.name === this.points[8].name && z.dPoint.name === this.points[2].name));
    this.weights[index].weight = 2;

    index = this.weights.findIndex(z => (z.oPoint.name === this.points[8].name && z.dPoint.name === this.points[6].name)
                   || (z.oPoint.name === this.points[6].name && z.dPoint.name === this.points[8].name));
    this.weights[index].weight = 6;

    index = this.weights.findIndex(z => (z.oPoint.name === this.points[3].name && z.dPoint.name === this.points[5].name)
                   || (z.oPoint.name === this.points[5].name && z.dPoint.name === this.points[3].name));
    this.weights[index].weight = 14;

    index = this.weights.findIndex(z => (z.oPoint.name === this.points[7].name && z.dPoint.name === this.points[8].name)
                   || (z.oPoint.name === this.points[8].name && z.dPoint.name === this.points[7].name));
    this.weights[index].weight = 7;

    index = this.weights.findIndex(z => (z.oPoint.name === this.points[2].name && z.dPoint.name === this.points[5].name)
                   || (z.oPoint.name === this.points[5].name && z.dPoint.name === this.points[2].name));
    this.weights[index].weight = 4;

    for (i = 0; i < this.points.length; i++) {

      this.pointsNamesArray.push(this.points[i].name);
    }

    this.ClearGrid();
    this.drawWeights();
    this.draw();

    this.sptSetM.length = 0;
    this.sptSetM = [];
    let dijkstraCalculations: DijkstraShortestDistance;
    dijkstraCalculations = new DijkstraShortestDistance(this.points, this.weights, this.origin);
    this.sptSetM = dijkstraCalculations.Calculate();
    this.GetShortestDistance();
  }
}
