function latestAction(text, keyword) {
  const latestActions = localStorage.getItem('latestActions')
  const action = {
    action: `${text}: ${keyword}`
  }

  if (!latestActions) {
    const latestActions = []

    latestActions.push(action)
    localStorage.setItem('latestActions', JSON.stringify(latestActions))
  } else {
    const data = JSON.parse(latestActions)

    data.push(action)
    localStorage.setItem('latestActions', JSON.stringify(data))
  }
}

export default latestAction
