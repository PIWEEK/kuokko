import {
  Component,
  Prop
} from '@stencil/core';

@Component({
  tag: 'kuo-recipes',
  styleUrl: 'kuo-recipes.css',
  shadow: true
})

export class MyComponent {

  @Prop() recipes: any;

  private renderReceipt(receipt, index) {
    if (index === 0) {
      return (
        <div>
          <h1>{receipt.title}</h1>
          <p>{receipt.cookTime}</p>
        </div>
      )
    } else {
      return (
        <div>
          <h2>{receipt.title}</h2>
          <p>{receipt.cookTime}</p>
        </div>
      )
    }
  }
  
  render() {
    return (
      <div>
        {this.recipes.map((receipt, index) =>
          <div>
            { this.renderReceipt(receipt, index) }
          </div>
        )}
      </div>
    );
  }
}