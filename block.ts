let targetTime = Date.now() + 5000;
while (targetTime > Date.now()) {}
console.log('block');
targetTime = Date.now() + 20000;
while (targetTime > Date.now()) {}
console.log('end');
