// N = -500;

// function solution(N) {
//   let stringN = N.toString();
//   let arrayN = [...stringN];
//   let indexArray = [];
//   let resultArray = [];
//   arrayN.forEach((el, index) => {
//     if (el == '5') {
//       indexArray.push(index);
//       let num = arrayN.slice(0, index).concat(arrayN.slice(index + 1));
//       console.log(num);
//       resultArray.push(parseInt(num.join('')));
//     }
//   });

//   return Math.max(...resultArray);
// }
// console.log('The Answer is');
// console.log(solution(N));
