const randomNumber = Math.random(); // produces random number between 0 (including) and 1 (excluding)
const randomNumber2 = Math.random();

if (randomNumber >= 0.7) {
  console.log('Any Message');
} else {
  console.log('Nope');
}

const array = [1, 2, 3, 4, 5];

for (let i = array.length-1; i >=0 ; i--) {
	console.log(array[i]);
}

const array2= [1, 2, 3, 4, 5];

for (items of array2) {
  console.log(items);
}


if (randomNumber > 0.7 && randomNumber2 > 0.7) {
  console.log('Greater than 0.7');
}