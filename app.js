//variables

const cartBtn = document.querySelector('.cart-btn');
const closeCartBtn = document.querySelector('.closed-cart');
const clearCartBtn = document.querySelector('.clear-cart');
const cartDOM = document.querySelector('.cart');
const cartOverlay = document.querySelector('.cart-overlay');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const cartContent = document.querySelector('.cart-content');
const productsDOM = document.querySelector('.products-center');
// cart
let cart = [] ;
//buttons
let buttonsDOM = [];
//getting products
class Products{
 async getProducts(){
     try { 
         let result = await fetch('products.json');
         let data = await result.json() ;
let products = data.items;
products = products.map(item => {
    const {title,price} = item.fields ;
    const {id} = item.sys;
    const image = item.fields.image.fields.file.url;
    return {title,price,id,image}
})
    return products
    } 
    catch (error) {
console.log(error) ;
     }
  
    }

}
//UI
class UI {
    displayProducts(products){
        /*console.log(products)*/
        let result = '';
        products.forEach(product => {
            result += `
            <!--Single product-->
<article class="product">
<div class="img-container">
    <img src=${product.image}>
    <button class="bag-btn" data-id=${product.id}>
        <i class="fa fa-shopping-cart"></i>
        add to cart
    </button>
</div>
<h3>${product.title}</h3> <!--Product name-->
<h4>€${product.price}</h4> <!--Product price -->
</article>
<!--End of Single product-->`
        });
        productsDOM.innerHTML = result;

    }
    getBagButtons(){
        const buttons = [...document.querySelectorAll(".bag-btn")];
        buttonsDOM = buttons;
        /*console.log(buttons);*/
        buttons.forEach(button => {
        let id = button.dataset.id;
       /* console.log(id); */
       let inCart = cart.find(item => item.id === id) ;
         if(inCart){
             button.innerText = "In cart";
             button.disable = true ;
         }
         else{
             button.addEventListener('click', event => {
             event.target.innerText = "in Cart";
             event.target.disabled = true;
             /*console.log(event)*/
             // get product from products via ID
             let cartItem = {...Storage.getProduct(id), amount: 1 };
             /*console.log(cartItem);*/

             //add product to cart
             cart = [...cart,cartItem];
             /*console.log(cart)*/
             //save cart in local
             Storage.saveCart(cart)
             //set cart values
             this.setCartValues(cart)
             //display cart item
             this.addCartItem(cartItem)
             //show cart overlay
             this.showCart()
             });
         }
        }) ;
    }
    setCartValues(cart){
        let tempTotal = 0;
        let itemsTotal = 0;
        cart.map(item =>{
            tempTotal += item.price * item.amount;
            itemsTotal += item.amount;
        })
        cartTotal.innerText = parseFloat(tempTotal.toFixed(2))
        cartItems.innerText = itemsTotal;
        /*console.log(cartTotal,cartItems);*/
    }
    addCartItem(item){
    const div = document.createElement('div');
    div.classList.add('cart-item');
    div.innerHTML = `<img src=${item.image} alt="product"/>
    <div>
        <h4>${item.title}</h4>
        <h5>€${item.price}</h5>
        <span class="remove-item" data-id=${item.id}>Remove</span>
    </div>
    <div>
        <i class="fa fa-chevron-up" data-id=${item.id}></i>
        <p class="item-amount">${item.amount}</p>
        <i class="fa fa-chevron-down" data-id=${item.id}></i>
    </div>`;
cartContent.appendChild(div);
    }
    showCart(){
    cartOverlay.classList.add('transparentBcg');
    cartDOM.classList.add('showCart');
    }
    setupAPP(){
        cart = Storage.getCart();
        this.setCartValues(cart);
        this.populateCart(cart);
        cartBtn.addEventListener('click',this.showCart);
        closeCartBtn.addEventListener('click',this.hideCart);
        }
        populateCart(cart){
            cart.forEach(item => this.addCartItem(item))
        }
        hideCart(){
            cartOverlay.classList.remove('transparentBcg');
            cartDOM.classList.remove('showCart');
        }
        cartLogic(){
            //clear cart button
            clearCartBtn.addEventListener('click',() =>{
                this.clearCart();
            });
            //cart functionality
            cartContent.addEventListener('click',event=>{
               if(event.target.classList.contains('remove-item'))
               {
                   let removeItem = event.target;
                   let id = removeItem.dataset.id;
                   cartContent.removeChild(removeItem.parentElement.parentElement);
                   this.removeItem(id);

               }
            })
        }
        clearCart(){
            let cartItems = cart.map(item => item.id);
            cartItems.forEach(id => this.removeItem(id));
            while(cartContent.children.length>0){
            cartContent.removeChild(cartContent.children[0])
        }
        this.hideCart();
        }
        removeItem(id){
          cart = cart.filter(item => item.id !==id);
          this.setCartValues(cart);
          Storage.saveCart(cart);
          let button = this.getSingleButton(id)
          button.disabled = false ;
          button.innerHTML = `<i class="fa fa-shopping-cart"></i>add to cart`
        
        }
          getSingleButton(id){
              return buttonsDOM.find(button => button.dataset.id === id);
          }
    }
//LS
class Storage {
    static saveProducts(products){
        localStorage.setItem("products", JSON.stringify(products)
        );
    }
    static getProduct(id){
        let products = JSON.parse(localStorage.getItem("products"));
        return products.find(product => product.id === id)
    }
    static saveCart(cart){
        localStorage.setItem('cart',JSON.stringify(cart));
    }
    static getCart(){
        return localStorage.getItem('cart')?JSON.parse(localStorage.getItem('cart')):[]
    }
    
}

document.addEventListener("DOMContentLoaded", () => {
    const ui = new UI();
    const products = new Products;
    
    //setup app
    ui.setupAPP();
    //Get all products
   products.getProducts().then(products => {
       ui.displayProducts(products) ;
       Storage.saveProducts(products);
   }).then(()=>{
       ui.getBagButtons();
       ui.cartLogic();
   });
    });