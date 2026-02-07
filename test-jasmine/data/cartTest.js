import { addToCart,cart } from "../../data/cart.js";

describe('test suite : addToCart', () => {
  it("adds an existing product to the cart ", () => {
    spyOn(localStorage, 'getItem').and.callFake(()=> {
        return JSON.stringify([ ]);

    });
    console.log(localStorage.getItem('cart'))
  });

  it('adds a new product to the cart' , ( ) => {
     addToCart("new-product-id-1");
      expect(cart.length).toEqual(3)
  })
});
