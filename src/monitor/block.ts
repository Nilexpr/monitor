console.log('start');
let targetTime = Date.now() + 3000;
while (targetTime > Date.now()) {}
console.log('block');
targetTime = Date.now() + 3000;
while (targetTime > Date.now()) {}
console.log('end');
