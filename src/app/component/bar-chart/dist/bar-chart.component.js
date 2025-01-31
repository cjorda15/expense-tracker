"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.BarChartComponent = void 0;
var core_1 = require("@angular/core");
var d3 = require("d3");
var rxjs_1 = require("rxjs");
var BarChartComponent = /** @class */ (function () {
    function BarChartComponent(themeService) {
        var _this = this;
        this.themeService = themeService;
        this.transactions = [];
        this.period = 'total';
        this.destroy$ = new rxjs_1.Subject();
        this.margin = { top: 20, right: 30, bottom: 40, left: 50 };
        this.width = 800 - this.margin.left - this.margin.right;
        this.height = 400 - this.margin.top - this.margin.bottom;
        // window resize handler
        this.onResize = function () {
            _this.updateDimensions();
            _this.createChart(); // recreate the chart with the updated width
        };
    }
    BarChartComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.updateDimensions();
        this.createChart();
        this.themeService.isDarkMode$
            .pipe(rxjs_1.takeUntil(this.destroy$), rxjs_1.tap(function (isDarkMode) {
            _this.isDarkMode = isDarkMode;
            _this.createChart();
        }))
            .subscribe();
        window.addEventListener('resize', this.onResize);
    };
    BarChartComponent.prototype.ngOnChanges = function () {
        if (this.transactions.length > 0) {
            this.createChart();
        }
    };
    BarChartComponent.prototype.ngOnDestroy = function () {
        if (this.svg) {
            d3.select('#bar-chart').selectAll('svg').remove();
        }
        this.destroy$.next(null);
        this.destroy$.complete();
        // remove resize event listener
        window.removeEventListener('resize', this.onResize);
    };
    // update dimensions based on the container's width
    BarChartComponent.prototype.updateDimensions = function () {
        var container = document.getElementById('line-chart');
        if (container) {
            var containerWidth = container.offsetWidth;
            this.width = containerWidth - this.margin.left - this.margin.right;
        }
    };
    BarChartComponent.prototype.createChart = function () {
        var _this = this;
        d3.select('#bar-chart').selectAll('*').remove(); // Clear previous chart
        this.svg = d3
            .select('#bar-chart')
            .append('svg')
            .attr('width', this.width + this.margin.left + this.margin.right)
            .attr('height', this.height + this.margin.top + this.margin.bottom + 50) // Increase height
            .attr('viewBox', "0 0 " + (this.width + this.margin.left + this.margin.right) + " " + (this.height + this.margin.top + this.margin.bottom + 50)) // Set viewBox
            .append('g')
            .attr('transform', "translate(" + this.margin.left + "," + this.margin.top + ")");
        // const filteredData = this.filterDataByPeriod();
        var filteredData = this.transactions;
        var incomeData = this.groupByCategory(filteredData.filter(function (t) { return t.type === 'income'; }));
        var expenseData = this.groupByCategory(filteredData.filter(function (t) { return t.type === 'expense'; }));
        var categories = __spreadArrays(new Set(__spreadArrays(incomeData.map(function (d) { return d.category; }), expenseData.map(function (d) { return d.category; }))));
        var x = d3.scaleBand()
            .domain(categories)
            .range([0, this.width])
            .padding(0.2);
        var y = d3.scaleLinear()
            .domain([
            0,
            Math.max(d3.max(incomeData, function (d) { return d.total; }) || 0, d3.max(expenseData, function (d) { return d.total; }) || 0),
        ])
            .nice()
            .range([this.height, 0]);
        var color = d3
            .scaleOrdinal()
            .domain(categories)
            .range(d3.schemeCategory10);
        var textColor = this.isDarkMode ? '#64ffda' : '#000';
        // X-axis with formatting
        this.svg
            .append('g')
            .attr('transform', "translate(0," + this.height + ")")
            .call(d3.axisBottom(x))
            .attr('color', textColor)
            .selectAll('text')
            .attr('transform', 'rotate(-45)')
            .attr('fill', textColor) // Use textColor variable
            .style('stroke', textColor) // Use textColor variable
            .style('stroke-width', 1.5)
            .style('text-anchor', 'end')
            .style('font-size', '14px')
            .style('font-weight', '100');
        // Y-axis with formatting
        this.svg
            .append('g')
            .call(d3.axisLeft(y))
            .attr('color', textColor)
            .selectAll('text')
            .attr('fill', textColor); // Use textColor variable
        this.svg
            .selectAll('.income-bar')
            .data(incomeData)
            .enter()
            .append('rect')
            .attr('class', 'income-bar')
            .attr('x', function (d) { return x(d.category); })
            .attr('y', function (d) { return y(d.total); })
            .attr('width', x.bandwidth() / 2)
            .attr('height', function (d) { return _this.height - y(d.total); })
            .attr('fill', function (d) { return color(d.category); })
            .attr('transform', "translate(" + x.bandwidth() / 4 + ", 0)");
        this.svg
            .selectAll('.expense-bar')
            .data(expenseData)
            .enter()
            .append('rect')
            .attr('class', 'expense-bar')
            .attr('x', function (d) { return x(d.category); })
            .attr('y', function (d) { return y(d.total); })
            .attr('width', x.bandwidth() / 2)
            .attr('height', function (d) { return _this.height - y(d.total); })
            .attr('fill', function (d) { return color(d.category); })
            .attr('transform', "translate(" + -x.bandwidth() / 4 + ", 0)");
    };
    // private filterDataByPeriod(): Transaction[] {
    //   const now = new Date();
    //   return this.transactions.filter((t) => {
    //     const transactionDate = new Date(t.date);
    //     if (this.period === 'month') {
    //       return (
    //         transactionDate.getFullYear() === now.getFullYear() &&
    //         transactionDate.getMonth() === now.getMonth()
    //       );
    //     } else if (this.period === 'year') {
    //       return transactionDate.getFullYear() === now.getFullYear();
    //     }
    //     return true;
    //   });
    // }
    BarChartComponent.prototype.groupByCategory = function (data) {
        return Object.entries(data.reduce(function (acc, curr) {
            acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
            return acc;
        }, {})).map(function (_a) {
            var category = _a[0], total = _a[1];
            return ({ category: category, total: total });
        });
    };
    __decorate([
        core_1.Input()
    ], BarChartComponent.prototype, "transactions");
    __decorate([
        core_1.Input()
    ], BarChartComponent.prototype, "period");
    BarChartComponent = __decorate([
        core_1.Component({
            selector: 'app-bar-chart',
            templateUrl: './bar-chart.component.html',
            styleUrls: ['./bar-chart.component.css'],
            standalone: true
        })
    ], BarChartComponent);
    return BarChartComponent;
}());
exports.BarChartComponent = BarChartComponent;
