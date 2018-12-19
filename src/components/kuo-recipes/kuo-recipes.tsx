import { Component } from '@stencil/core';
// import * as rxOp from 'rxjs/operators';
// import bus from '../../js/events';

@Component({
  tag: 'kuo-recipes',
  styleUrl: 'kuo-recipes.css',
  shadow: true
})

export class MyComponent {

  // private componentWillLoad() {
  //   bus.pipe(
  //     rxOp.filter((message) => {
  //       return message.type = "search";
  //     })
  //   ).subscribe((event) => {
  //     // this.recipes = event.payload;
  //   });
  // }

  private getReceipts(): any[] {
    return [
      {
        title: "Paella valenciana",
        cookTime: "40m",
        dificulty: "easy",
        author: "El comidista",
        ingredients: [
          {
            id: "05060a54-dfa2-4abd-9c8d-b3ec27a8a3ed",
            name: "Azafran",
            quantity: "unas hebras"
          },
          {
            id: "19a33bc1-c114-4dee-81aa-13fcc28f58b8",
            name: "Garrofó fresco",
            quantity: "100gr"
          },
          {
            id: "4cbbff36-a583-46c3-b922-0ab5c182dff3",
            name: "Pimenton",
            quantity: "1 pellizco",
            preparation: "molido"
          }
        ],
      },
      {
        title: "Paella de marisco",
        cookTime: "40m",
        dificulty: "easy",
        author: "El paellador",
        ingredients: [
          {
            id: "05060a54-dfa2-4abd-9c8d-b3ec27a8a3ed",
            name: "Azafran",
            quantity: "unas hebras"
          },
          {
            id: "19a33bc1-c114-4dee-81aa-13fcc28f58b8",
            name: "Garrofó fresco",
            quantity: "100gr"
          },
          {
            id: "4cbbff36-a583-46c3-b922-0ab5c182dff3",
            name: "Pimenton",
            quantity: "1 pellizco",
            preparation: "molido"
          }
        ],
      }
    ];
  }

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
        {this.getReceipts().map((receipt, index) =>
          <div>
            { this.renderReceipt(receipt, index) }
          </div>
        )}
      </div>
    );
  }
}