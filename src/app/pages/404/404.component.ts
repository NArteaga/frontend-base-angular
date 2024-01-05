import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-404',
  standalone: true,
  imports: [CardModule],
  templateUrl: './404.component.html',
  styleUrl: './404.component.scss'
})
export class NotFoundPage {

}
