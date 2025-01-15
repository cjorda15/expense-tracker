"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.TableTransactionComponent = void 0;
var core_1 = require("@angular/core");
var table_component_1 = require("@component/table/table.component");
var transaction_1 = require("@store/transaction");
var TableTransactionComponent = /** @class */ (function () {
    function TableTransactionComponent() {
        this.transactionStore = core_1.inject(transaction_1.TransactionStore);
        this.tableHeaders = [
            { key: 'name', label: 'Name', sortable: true },
            { key: 'email', label: 'Email', sortable: true },
            { key: 'age', label: 'Age', sortable: true },
            { key: 'joinedDate', label: 'Joined Date', sortable: true }
        ];
        this.tableRows = [];
    }
    TableTransactionComponent.prototype.ngOnInit = function () {
        this.mapToTableRows();
        //     {
        //   data: null,
        //   columns: {
        //     name: { content: 'Alice', type: 'text' },
        //     age: { content: 25, type: 'number' },
        //     email: { content: 'crobertjordan@hao.c', type: 'text' },
        //     joinedDate: { content: '2025-01-07T14:30:00', type: 'date' }
        //   }
        // }
    };
    TableTransactionComponent.prototype.mapToTableRows = function () {
        this.tableRows = this.transactionStore.transactions().map(function (transaction) {
            return {
                data: transaction,
                columns: {
                    ss: { 'content': 'bam', type: 'text' }
                }
            };
        });
    };
    TableTransactionComponent = __decorate([
        core_1.Component({
            selector: 'app-table-transaction',
            imports: [table_component_1.TableComponent],
            templateUrl: './table-transaction.component.html',
            styleUrl: './table-transaction.component.css'
        })
    ], TableTransactionComponent);
    return TableTransactionComponent;
}());
exports.TableTransactionComponent = TableTransactionComponent;
