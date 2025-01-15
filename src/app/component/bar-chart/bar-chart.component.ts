import { Component, OnInit, OnChanges, Input, ElementRef } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit, OnChanges {
  @Input() data: { name: string; value: number }[] = []; // Input data
  @Input() width: number = 500;
  @Input() height: number = 300;

  private svg: any;

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    this.createChart();
  }

  ngOnChanges(): void {
    if (this.svg) {
      this.updateChart();
    }
  }

  private createChart(): void {
    const element = this.el.nativeElement;
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const chartWidth = this.width - margin.left - margin.right;

    const chartHeight = this.height - margin.top - margin.bottom;

    this.svg = d3
      .select(element)
      .select('.chart-container')
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Create scales
    const x = d3
      .scaleBand()
      .domain(this.data.map((d) => d.name))
      .range([0, chartWidth])
      .padding(0.1);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(this.data, (d) => d.value) || 0])
      .range([chartHeight, 0]);

    // Add X axis
    this.svg
      .append('g')
      .attr('transform', `translate(0, ${chartHeight})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .classed('text-black dark:text-green', true);

    // Add Y axis
    this.svg
      .append('g')
      .call(d3.axisLeft(y))
      .classed('text-black dark:text-green', true);

    // Draw bars
    this.svg
      .selectAll('.bar')
      .data(this.data)
      .enter()
      .append('rect')
      .attr('class', 'bar, ')
      .attr('x', (d: any) => x(d.name))
      .attr('y', (d: any) => y(d.value))
      .attr('width', x.bandwidth())
      .attr('height', (d: any) => chartHeight - y(d.value))
      .classed('dark:fill-green fill-steelblue', true);

    // .attr('fill', 'green');
  }

  private updateChart(): void {
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const chartWidth = this.width - margin.left - margin.right;
    const chartHeight = this.height - margin.top - margin.bottom;

    const x = d3
      .scaleBand()
      .domain(this.data.map((d) => d.name))
      .range([0, chartWidth])
      .padding(0.1);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(this.data, (d) => d.value) || 0])
      .range([chartHeight, 0]);

    // Update axes
    this.svg.selectAll('g').remove();

    this.svg
      .append('g')
      .attr('transform', `translate(0, ${chartHeight})`)
      .call(d3.axisBottom(x));

    this.svg.append('g').call(d3.axisLeft(y));

    // Update bars
    const bars = this.svg.selectAll('.bar').data(this.data);

    bars
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .merge(bars)
      .attr('x', (d: any) => x(d.name))
      .attr('y', (d: any) => y(d.value))
      .attr('width', x.bandwidth())
      .attr('height', (d: any) => chartHeight - y(d.value))
      .classed('text-green', true);
    // .attr('fill', 'steelblue');

    bars.exit().remove();
  }
}
