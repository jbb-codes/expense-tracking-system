import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `

    <!-- added for style-test.component -->
    <!-- build out further as needed once actual dev starts -->
    <router-outlet></router-outlet>

  `,
  styles: ``
})
export class AppComponent {
  title = 'client';
}
