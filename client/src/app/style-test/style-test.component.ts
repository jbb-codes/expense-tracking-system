import { Component } from '@angular/core';

@Component({
  selector: 'app-style-test',
  standalone: true,
  template: `

<main>
  <h1>H1 Heading</h1>
  <h2>H2 Heading</h2>
  <h3>H3 Heading</h3>

  <p>
    This is a paragraph used to test global typography, spacing, and colors.
  </p>

  <p class="error-msg">This is styling for an error message with class "error-msg"</p>

  <table>
    <thead>
      <tr>
        <th>Table Column A</th>
        <th>Table Column B</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Row 1, A</td>
        <td>Row 1, B</td>
      </tr>
      <tr>
        <td>Row 2, A</td>
        <td>Row 2, B</td>
      </tr>
    </tbody>
  </table>

  <button type="submit">Submit Button with "type='submit'"</button>
  <button type="button">Other Button with "type='button'"</button>
</main>
`,
  styles: ``
})


export class StyleTestComponent {}
