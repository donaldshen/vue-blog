function get(name) {
  const cookieName = `${encodeURIComponent(name)}=`
  const cookieStart = document.cookie.indexOf(cookieName)

  if (cookieStart > -1) {
    let cookieEnd = document.cookie.indexOf(';', cookieStart)
    if (cookieEnd === -1) {
      cookieEnd = document.cookie.length
    }
    return decodeURIComponent(document.cookie.substr(cookieStart + cookieName.length, cookieEnd))
  } else {
    return null
  }
}

function set(name, value, expires, path, domain, secure) {
  let cookieText = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`
  if (expires instanceof Date) { cookieText += `; expires=${expires.toGMTString()}` }
  if (path) cookieText += `; path=${path}`
  if (domain) cookieText += `; domain=${domain}`
  if (secure) cookieText += '; secure'
  document.cookie = cookieText
}

function unset(name, path, domain, secure) {
  set(name, '', new Date(0), path, domain, secure)
}

function clear() {
  document.cookie.split(';').forEach((c) => { document.cookie = c.replace(/^ +/, '').replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`) })
}

export {
  get,
  set,
  unset,
  clear,
}
