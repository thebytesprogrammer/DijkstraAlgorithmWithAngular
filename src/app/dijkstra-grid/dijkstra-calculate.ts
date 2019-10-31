
import { Point, Weight } from './dijkstra-point-weight';

export class SptPoint {

  public name = '';
  public cost = Number.POSITIVE_INFINITY;
  public accessThrough = '';

  constructor(n: string, c: number, at: string) {

    this.name = n;
    this.cost = c;
    this.accessThrough = at;
  }
}

export class DijkstraShortestDistance {

  public points: Point[] = [];
  public weights: Weight[] = [];
  public pointOrigin = '';
  public sptSet: SptPoint[][] = [];

  constructor(pts: Point[], wts: Weight[], po: string)  {

     this.points = pts;
     this.weights = wts;
     this.pointOrigin = po;
  }

  public Calculate() {

    let currentSourceVertex = this.pointOrigin;

    let i = 0;
    let j = 0;
    const visitedVertices: string[] = [];

    for (i = 0; i < this.points.length - 1; i++) {

      const currentRow: SptPoint[] = [];
      visitedVertices.push(currentSourceVertex);

      for (j = 0; j < this.points.length; j++) {

        if (i === 0) {
          if (visitedVertices.findIndex(x => x === this.points[j].name) === -1) {

            currentRow.push(new SptPoint(this.points[j].name, this.GetLowestCostToVertex(0, currentSourceVertex, this.points[j].name,
                                Number.POSITIVE_INFINITY), currentSourceVertex));
          }
        } else {

          if (visitedVertices.findIndex(x => x === this.points[j].name) === -1) {

            const lowestCost = this.GetLowestCostToVertex(
              this.sptSet[i - 1][this.sptSet[i - 1].findIndex(x => x.name === currentSourceVertex)].cost,
              currentSourceVertex, this.points[j].name,
              this.sptSet[i - 1][this.sptSet[i - 1].findIndex(x => x.name === this.points[j].name)].cost);

            if (lowestCost < this.sptSet[i - 1][this.sptSet[i - 1].findIndex(x => x.name === this.points[j].name)].cost) {

              currentRow.push(new SptPoint(this.points[j].name, lowestCost, currentSourceVertex));
            } else {

            const index: number = this.sptSet[i - 1].findIndex(x => x.name === this.points[j].name);

            currentRow.push(new SptPoint(this.points[j].name,
              this.sptSet[i - 1][index].cost,
              this.sptSet[i - 1][index].accessThrough));
            }
          }
        }
      }

      this.sptSet.push(currentRow);
      currentSourceVertex = this.GetMinimumCostInRow(currentRow);
    }

    return this.sptSet;
  }


  private GetLowestCostToVertex(currentAccumulatedCost: number, currentSourceVertexName: string, destinationVertexName: string,
                                previousCost: number) {

    let i = 0;
    let lowestCostToNextVertex = previousCost;

    while (i < this.weights.length) {

      if (((this.weights[i].oPoint.name === currentSourceVertexName && this.weights[i].dPoint.name === destinationVertexName) ||
      (this.weights[i].oPoint.name === destinationVertexName && this.weights[i].dPoint.name === currentSourceVertexName))) {

        if (currentAccumulatedCost + this.weights[i].weight < previousCost) {

          lowestCostToNextVertex = currentAccumulatedCost + this.weights[i].weight;
        } else {

          lowestCostToNextVertex = previousCost;
        }

        break;
      }

      i++;
    }

    return lowestCostToNextVertex;
  }

  private GetMinimumCostInRow(aRow: SptPoint[]) {

    let compareTo = Number.POSITIVE_INFINITY;
    let currentLowest = 0;

    let i: number;

    for (i = 0; i < aRow.length; i++) {

      if (aRow[i].cost < compareTo) {

        currentLowest = i;
        compareTo = aRow[i].cost;
      }
    }

    return aRow[currentLowest].name;
  }
}
