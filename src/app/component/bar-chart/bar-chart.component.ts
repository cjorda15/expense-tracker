import { Component, OnInit, OnChanges, Input, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { ThemeService } from '@service/theme.service';
import { Transaction } from '@store/transaction.model';
import * as d3 from 'd3';
import { Subject, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css'],
  standalone: true,
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class BarChartComponent implements OnInit, OnChanges {
  @Input() transactions: Transaction[] = [];
  @Input() period: 'month' | 'year' | 'total' = 'total';
  private destroy$ = new Subject();
  private svg: any;
  private margin = { top: 20, right: 50, bottom: 40, left: 50 };
  private width = 800 - this.margin.left - this.margin.right;
  private height = 400 - this.margin.top - this.margin.bottom;
  private isDarkMode!: boolean;
  constructor(private themeService: ThemeService) {}
  ngOnInit(): void {

  }

  ngAfterViewInit(){
    this.updateDimensions();
    this.themeService.isDarkMode$
      .pipe(
        takeUntil(this.destroy$),
        tap((isDarkMode: boolean) => {
          this.isDarkMode = isDarkMode;
          this.createChart();
        })
      )
      .subscribe();
    window.addEventListener('resize', this.onResize);
  }
  ngOnChanges(changes:any): void {
    if (changes?.transactions&&!changes?.transactions?.firstChange) {
      this.createChart();
    }
  }

  ngOnDestroy() {
    if (this.svg) {
      d3.select('#bar-chart').selectAll('svg').remove();
    }
    this.destroy$.next(null);
    this.destroy$.complete();

    // remove resize event listener
    window.removeEventListener('resize', this.onResize);
  }

  // window resize handler
  private onResize = () => {
    this.updateDimensions();
    this.createChart(); // recreate the chart with the updated width
  };

  // update dimensions based on the container's width
  private updateDimensions() {
    const container = document.getElementById('line-chart');
    if (container) {
      const containerWidth = container.offsetWidth;
      this.width = containerWidth - this.margin.left - this.margin.right;
    }
  }

  private createChart(): void {
    const textColor = this.isDarkMode ? '#64ffda' : '#000';
    const tooltipColorIncome = this.isDarkMode ? '#64ffda' : '#48bb78';
    const tooltipColorExpenses = this.isDarkMode ? '#ff0000' : '#e53e3e';
    debugger
    d3.select('#bar-chart').selectAll('*').remove(); // Clear previous chart

    this.svg = d3
      .select('#bar-chart')
      .append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom + 50)
      .attr(
        'viewBox',
        `0 0 ${this.width + this.margin.left + this.margin.right} ${this.height + this.margin.top + this.margin.bottom + 50}`
      ) 
      .append('g')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

    const filteredData = this.transactions;
    const incomeData = this.groupByCategory(
      filteredData.filter((t) => t.type === 'income')
    ).sort((a, b) => (a.total > b.total ? -1 : 1));
    const expenseData = this.groupByCategory(
      filteredData.filter((t) => t.type === 'expense')
    ).sort((a, b) => (a.total > b.total ? -1 : 1));

    const incomeColor = d3
      .scaleOrdinal(d3.schemeGreens[9])
      .domain(incomeData.map((d) => d.category));

    const expenseColor = d3
      .scaleOrdinal(d3.schemeReds[9])
      .domain(expenseData.map((d) => d.category));

    const categories = [
      ...new Set([
        ...incomeData.map((d) => d.category),
        ...expenseData.map((d) => d.category)
      ])
    ];

    const incomeTooltip = d3
      .select('#line-chart')
      .append('div')
      .style('position', 'absolute')
      .style('background', this.isDarkMode ? '#333' : '#fff')
      .style('padding', '5px 10px')
      .attr(
        'transform',
        `translate(${this.margin.left}, ${this.margin.top - 300})`
      )
      .style('font-family', 'monospace')
      .style('font-size', '16px')
      .style('border-radius', '5px')
      .style('box-shadow', '0px 2px 4px rgba(0,0,0,0.3)')
      .style('pointer-events', 'none')
      .style('opacity', 0)
      .style('color', tooltipColorIncome);

    const expenseTooltip = d3
      .select('#line-chart')
      .append('div')
      .style('position', 'absolute')
      .style('background', this.isDarkMode ? '#333' : '#fff')
      .style('padding', '5px 10px')
      .attr(
        'transform',
        `translate(${this.margin.left}, ${this.margin.top - 300})`
      )
      .style('font-family', 'monospace')
      .style('font-size', '16px')
      .style('border-radius', '5px')
      .style('box-shadow', '0px 2px 4px rgba(0,0,0,0.3)')
      .style('pointer-events', 'none')
      .style('opacity', 0)
      .style('color', tooltipColorExpenses);

    const x = d3
      .scaleBand()
      .domain(categories)
      .range([0, this.width])
      .padding(0.2);

    const y = d3
      .scaleLinear()
      .domain([
        0,
        Math.max(
          d3.max(incomeData, (d) => d.total) || 0,
          d3.max(expenseData, (d) => d.total) || 0
        )
      ])
      .nice()
      .range([this.height, 0]);

    // X-axis with formatting
    this.svg
      .append('g')
      .attr('transform', `translate(0,${this.height})`)
      .call(d3.axisBottom(x))
      .attr('color', textColor)
      .selectAll('text')
      .style('text-transform', 'capitalize')
      .attr('transform', 'rotate(-45)')
      .attr('fill', textColor)
      .style('stroke', textColor)
      .style('text-anchor', 'end')
      .style('font-size', '10px')
      .style('font-weight', '100');

    // Y-axis with formatting

    const yAxis = d3.axisLeft(y).tickFormat(d3.format('$.2s'));
    this.svg
      .append('g')
      .call(yAxis)
      .attr('color', textColor)
      .selectAll('text')
      .style('font-size', '10px')
      .attr('fill', textColor);

    this.svg
      .selectAll('.income-bar')
      .data(incomeData)
      .enter()
      .append('rect')
      .attr('class', 'income-bar')
      .attr('x', (d: any) => x(d.category))
      .attr('y', (d: any) => y(d.total))
      .attr('width', x.bandwidth() / 2)
      .attr('height', (d: any) => this.height - y(d.total))
      .attr('fill', (d: any) => incomeColor(d.category))
      .on('mouseover', (event: any, d: any) => {
        incomeTooltip.style('opacity', 1).html(`$${d.total.toFixed(2)}`);
      })
      .on('mousemove', (event: any, d: any) => {
        incomeTooltip
          .style('left', `${event.pageX + -1 * 10}px`)
          .style('top', `${event.pageY - 30}px`);
      })
      .on('mouseout', () => {
        incomeTooltip.style('opacity', 0);
      })

      .attr('transform', `translate(${x.bandwidth() / 4}, 0)`);

    this.svg
      .selectAll('.expense-bar')
      .data(expenseData)
      .enter()
      .append('rect')
      .attr('class', 'expense-bar')
      .attr('x', (d: any) => x(d.category)! + x.bandwidth() / 4)
      .attr('y', (d: any) => y(d.total))
      .attr('width', x.bandwidth() / 2)
      .attr('height', (d: any) => this.height - y(d.total))
      .attr('fill', (d: any) => expenseColor(d.category))
      .on('mouseover', (event: any, d: any) => {
        expenseTooltip.style('opacity', 1).html(`$${d.total.toFixed(2)}`);
      })
      .on('mousemove', (event: any, d: any) => {
        expenseTooltip
          .style('left', `${event.pageX + -1 * 10}px`)
          .style('top', `${event.pageY - 30}px`);
      })
      .on('mouseout', () => {
        expenseTooltip.style('opacity', 0);
      });
  }

  private groupByCategory(
    data: Transaction[]
  ): { category: string; total: number }[] {
    return Object.entries(
      data.reduce(
        (acc, curr) => {
          acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
          return acc;
        },
        {} as Record<string, number>
      )
    ).map(([category, total]) => ({ category, total }));
  }
}
