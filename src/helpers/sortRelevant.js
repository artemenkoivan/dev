export default function sortRelevant(data) {
  const output = []
  let globalKey = ''

  if (data.length) {
    for (const item of data) {
      for (let key in item) {
        if (Array.isArray(item[key])) {
          globalKey = key
          output.push(item[key])
        }
      }
    }

    output.sort((a, b) => a.length - b.length).reverse()

    for (let i = 0; i < output.length; i++) {
      let current = output[i]

      data.forEach(item => {
        if (item[globalKey] === current) {
          output.splice(i, 1, item)
        }
      })
    }

    return output
  }

  return []
}
