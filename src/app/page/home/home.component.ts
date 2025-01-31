import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject
} from '@angular/core';
import { BarChartComponent } from '@component/bar-chart/bar-chart.component';
import { LineChartComponent } from '@component/line-chart/line-chart.component';
import { NavbarComponent } from '@component/navbar/navbar.component';
import { TableTransactionComponent } from '@component/table-transaction/table-transaction.component';
import { TransactionStore } from '@store/transaction';

@Component({
  selector: 'app-home',
  imports: [
    TableTransactionComponent,
    NavbarComponent,
    BarChartComponent,

    LineChartComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  private transactionStore = inject(TransactionStore);

  barChartData = [
    { name: 'A', value: 30 },
    { name: 'B', value: 80 },
    { name: 'C', value: 45 },
    { name: 'D', value: 60 },
    { name: 'E', value: 20 },
    { name: 'F', value: 90 },
    { name: 'G', value: 55 }
  ];

  get transactions() {
    return computed(() => this.transactionStore.transactions());
  }
}
