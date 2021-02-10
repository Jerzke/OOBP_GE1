//variables

const cartBtn = document.querySelector('.cart-btn');
const closeCartBtn = document.querySelector('.close-cart');
const clearCartBtn = document.querySelector('.clear-cart');
const cartDOM = document.querySelector('.cart-');
const cartOverlay = document.querySelector('.cart-overlay');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const cartContent = document.querySelector('.cart-content');
const productsDOM = document.querySelector('.products-center');
// cart
let cart = [] ;
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
        console.log(products)
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
            
    
}
//LS
class Stroage {}

document.addEventListener("DOMContentLoaded",()=>{
    const ui = new UI();
    const products = new Products;
    

    //Get all products
    products.getProducts().then(products => ui.displayProducts(products))
}) ;