import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  HostListener,
  ChangeDetectionStrategy
} from '@angular/core';
import { ThemeService } from '@service/theme.service';
import { Transaction, TransactionType } from '@store/transaction.model';
import * as d3 from 'd3';
import { Subject, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-line-chart',
  template: '<div id="line-chart"></div>',
  styleUrls: ['./line-chart.component.css'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class LineChartComponent implements OnInit, OnDestroy {
  @Input() transactions: Transaction[] = [];
  private destroy$ = new Subject();
  private margin = { top: 20, right: 50, bottom: 40, left: 50 };
  private width = 800 - this.margin.left - this.margin.right;
  private height = 400 - this.margin.top - this.margin.bottom;
  private processedData: any[] = [];
  private isDarkMode!: boolean;
  private svg!: d3.Selection<SVGGElement, unknown, HTMLElement, any>;

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    this.updateDimensions();

    if (this.transactions.length) {
      this.processedData = this.processData(this.transactions);
    }

    this.themeService.isDarkMode$
      .pipe(
        takeUntil(this.destroy$),
        tap((isDarkMode: boolean) => {
          this.isDarkMode = isDarkMode;
          this.createChart();
        })
      )
      .subscribe();

    // listen to window resize events
    window.addEventListener('resize', this.onResize);
  }

  ngOnDestroy() {
    if (this.svg) {
      d3.select('#line-chart').selectAll('svg').remove();
    }
    this.destroy$.next(null);
    this.destroy$.complete();

    // remove resize event listener
    window.removeEventListener('resize', this.onResize);
  }

  // update dimensions based on the container's width
  private updateDimensions() {
    const container = document.getElementById('line-chart');
    if (container) {
      const containerWidth = container.offsetWidth;
      this.width = containerWidth - this.margin.left - this.margin.right;
    }
  }

  // window resize handler
  private onResize = () => {
    this.updateDimensions();
    this.createChart(); // recreate the chart with the updated width
  };

  private processData(transactions: Transaction[]) {
    const groupedByMonth = d3.rollups(
      transactions,
      (v) => ({
        income: d3.sum(v, (d) =>
          d.type === TransactionType.Income ? d.amount : 0
        ),
        expenses: d3.sum(v, (d) =>
          d.type === TransactionType.Expense ? d.amount : 0
        )
      }),
      (d) => d3.timeFormat('%Y-%m')(new Date(d.date))
    );

    const processedData = groupedByMonth.map(
      ([month, { income, expenses }]) => {
        const parsedDate = d3.timeParse('%Y-%m')(month);
        if (!parsedDate) throw new Error(`Invalid date format: ${month}`);
        return {
          date: parsedDate,
          income,
          expenses
        };
      }
    );

    processedData.sort((a, b) => a.date.getTime() - b.date.getTime());
    return processedData;
  }

  private createChart() {
    d3.select('#line-chart').selectAll('svg').remove(); // Clear existing chart
    const textColor = this.isDarkMode ? '#64ffda' : '#000';
    const strokeColorIncome = this.isDarkMode ? '#64ffda' : '#48bb78';
    const strokeColorExpenses = this.isDarkMode ? '#ff0000' : '#e53e3e';

    const tooltipIncome = d3
      .select('#line-chart')
      .append('div')
      .style('position', 'absolute')
      .style('background', this.isDarkMode ? '#333' : '#fff')
      .style('color', strokeColorIncome)
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
      .style('opacity', 0);

    const tooltipExpense = d3
      .select('#line-chart')
      .append('div')
      .style('position', 'absolute')
      .style('background', this.isDarkMode ? '#333' : '#fff')
      .style('color', strokeColorExpenses)
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
      .style('opacity', 0);

    this.svg = d3
      .select('#line-chart')
      .append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom + 40)
      .append('g')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

    const x = d3
      .scaleTime()
      .domain(d3.extent(this.processedData, (d) => d.date) as [Date, Date])
      .range([0, this.width]);

    const y = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(this.processedData, (d) =>
          Math.max(d.income, d.expenses)
        ) as number
      ])
      .range([this.height, 0]);

    const yAxis = d3.axisLeft(y).tickFormat(d3.format('$.2s'));

    this.svg
      .append('g')
      .attr('transform', `translate(0,${this.height})`)
      .call(d3.axisBottom(x).tickFormat(d3.timeFormat('%b %Y') as any))
      .style('color', textColor)
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .attr('fill', textColor)
      .style('stroke', textColor)
      .style('text-anchor', 'end')
      .attr('color', textColor)
      .style('text-anchor', 'end')
      .style('font-size', '12px')
      .style('font-weight', '100');

    this.svg
      .append('g')
      .call(yAxis)
      .attr('color', textColor)
      .attr('font-size', '12px');

    const lineIncome = d3
      .line<{ date: Date; income: number }>()
      .x((d) => x(d.date))
      .y((d) => y(d.income));

    const lineExpenses = d3
      .line<{ date: Date; expenses: number }>()
      .x((d) => x(d.date))
      .y((d) => y(d.expenses));

    this.svg
      .append('path')
      .datum(this.processedData)
      .attr('fill', 'none')
      .attr('stroke', strokeColorIncome)
      .attr('stroke-width', 1.5)
      .attr('d', lineIncome as any);

    this.svg
      .append('path')
      .datum(this.processedData)
      .attr('fill', 'none')
      .attr('stroke', strokeColorExpenses)
      .attr('stroke-width', 1.5)
      .attr('d', lineExpenses as any);

    // Add nodes for income
    this.svg
      .selectAll('.income-node')
      .data(this.processedData)
      .enter()
      .append('circle')
      .attr('class', 'income-node')
      .attr('font-family', () => 'monospace')
      .style('font-size', '16px')
      .attr('cx', (d) => x(d.date))
      .attr('cy', (d) => y(d.income))
      .attr('r', 5)
      .attr('fill', strokeColorIncome)
      .on('mouseover', (event, d) => {
        tooltipIncome
          .style('opacity', 1)
          .html(`Income: $${d.income.toFixed(2)}`);
      })
      .on('mousemove', (event, d) => {
        const midpoint = Math.floor(this.processedData.length / 2);
        const isLastHalf = this.processedData.indexOf(d) >= midpoint; // Check if the current datum is in the last half
        const tooltipDirection = isLastHalf ? -1 : 1; // -1 for left, 1 for right

        tooltipIncome
          .style('left', `${event.pageX + tooltipDirection * 10}px`)
          .style('top', `${event.pageY - 30}px`);
      })
      .on('mouseout', () => {
        tooltipIncome.style('opacity', 0);
      });

    // Add nodes for expenses
    this.svg
      .selectAll('.expense-node')
      .data(this.processedData)
      .enter()
      .append('circle')
      .attr('class', 'expense-node')
      .style('font-family', 'monospace')
      .style('font-size', '16px')
      .attr('cx', (d) => x(d.date))
      .attr('cy', (d) => y(d.expenses))
      .attr('r', 5)
      .attr('fill', strokeColorExpenses)

      .on('mouseover', (event, d) => {
        tooltipExpense
          .style('opacity', 1)
          .html(`Expenses: $${d.expenses.toFixed(2)}`);
      })
      .on('mousemove', (event) => {
        tooltipExpense
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 20}px`);
      })
      .on('mouseout', () => {
        tooltipExpense.style('opacity', 0);
      });
  }
}
