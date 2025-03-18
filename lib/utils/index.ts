export function extractRequestFromChat(chat: string) {
  const requestRegex = /```request([\s\S]*)```/
  const requestMatch = chat.match(requestRegex)
  return requestMatch ? requestMatch[1] : null
}

export function removeRequestFromChat(chat: string) {
  const requestRegex = /(```request[\s\S]*```)/
  return chat.replace(requestRegex, "")
}
