let result = 0
for(let i = 1; i < 1000; i++){
    result += 1/(Math.sqrt(i) + Math.sqrt(i+1));
}
console.log(result.toFixed(4));