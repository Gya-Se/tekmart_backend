
const allProducts = { x: 0, x: 1, x: 1, x: 1, x: 0, x: 0, x: 0, x: 1, x: 0, x: 1, x: 0, x: 0, x: 1, x: 0, x: 1 }
const products = {}
counter = 0

for (let i = 0; i < allProducts.length; i++) {
    if (allProducts[i].x === 1) {
        products = allProducts[i]
        counter += 1
    }
}


console.log(products)
console.log(products.length)