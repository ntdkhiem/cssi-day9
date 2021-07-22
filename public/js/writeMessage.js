const LIMIT_CHAR = 79
const submitMessage = () => {
    const passcode = document.querySelector('#passcode').value
    const message = document.querySelector('#message').value
    const author = document.querySelector('#author').value || 'Anonymous'
    if (message.length > LIMIT_CHAR) {
        displayNotification(`Your message is too long! Please reduce to <b>${LIMIT_CHAR}</b> characters.`, 'danger')
    }
    else if (!validatePasscode(passcode)) {
        displayNotification(`Your passcode must contain at least <b>one number and one uppercase and one lower letter</b>.`, 'danger')
    }
    else {
        firebase.database().ref("/messages").push({
            passcode: hashPasscode(passcode),
            message: message,
            timeCreated: moment(Date.now()).format(),
            author: author,
        })
        displayNotification('Your message has been successfully saved to our database.', 'success')
    }
}

const displayNotification = (msg, type) => {
    const alertDiv = document.createElement('div')
    alertDiv.className = `notification is-${type} is-light`
    const alertBtn = document.createElement('button')
    alertBtn.className = 'delete'
    alertBtn.addEventListener('click', () => {
        alertDiv.parentNode.removeChild(alertDiv)
    })
    const alertText = document.createElement('p')
    alertText.className = 'subtitle'
    alertText.innerHTML = msg
    alertDiv.appendChild(alertBtn)
    alertDiv.appendChild(alertText)
    document.querySelector('body').prepend(alertDiv)
}

// From https://www.codegrepper.com/code-examples/javascript/how+to+check+if+a+letter+is+uppercase+in+js
// and https://stackoverflow.com/questions/5778020/check-whether-an-input-string-contains-a-number-in-javascript
const validatePasscode = (passcode) => {
    return /[a-z]/.test(passcode) && /[A-Z]/.test(passcode) && /\d/.test(passcode);
}

const hashPasscode = (passcode) => {
    return new Hashes.MD5().hex(passcode)
}