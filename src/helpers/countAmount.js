module.exports = function (num, arr) {
  if (num > 4 && num < 20) {
    return num + ' ' + arr[2]
  }

  if (num % 10 > 1 && num % 10 < 5) {
    return num + ' ' + arr[1]
  }

  if (num % 10 > 5 || num % 10 === 0) {
    return num + ' ' + arr[2]
  }

  if (num % 10 === 1) {
    return num + ' ' + arr[0]
  }
}