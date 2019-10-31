import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DijkstraGridComponent } from './dijkstra-grid.component';
import { FormControl, FormGroup } from '@angular/forms';
import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Point, Weight } from './dijkstra-point-weight';
import { DijkstraShortestDistance, SptPoint } from './dijkstra-calculate';

describe('DijkstraGridComponent', () => {
  let component: DijkstraGridComponent;
  let fixture: ComponentFixture<DijkstraGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DijkstraGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DijkstraGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  const i = this.pointOrigin.value;
  it ('Checks whether Hello is Hello', () => expect(i).toBe('9'));
});

