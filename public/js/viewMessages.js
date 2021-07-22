let numTry = 0;
const getMessages = () => {
    const messagesRef = firebase.database().ref();
    messagesRef.on('value', (snapshot) => {
        const data = snapshot.val();
        const passcodeAttempt = document.querySelector('#passcode').value;
        for (message in data.messages) {
            const messageData = data.messages[message];
            if (messageData.passcode == hashPasscode(passcodeAttempt)) {
                // Clear input field
                document.querySelector('#passcode').value = "";

                const messageDiv = document.querySelector('#message');
                // Clear card content
                messageDiv.innerHTML = "";
                // Show the message
                messageDiv.style.display = 'block';
                createMsgCard(messageDiv, messageData.message, messageData.author, messageData.timeCreated)
                // messageDiv.querySelector('#cardContent').innerText = messageData.message
                return;
            }
        }
        numTry++;
        if (numTry === 3) {
            alert('You\'ve tried too many attempts. Please try again in 5 seconds')
            document.querySelector('#viewMsg').disabled = true;
            setTimeout(() => {document.querySelector('#viewMsg').disabled = false}, 5000);
            numTry = 0;
        }
        displayAlert("Couldn't find a messsage with given passcode.")
    });
}


const displayAlert = (msg) => {
    const alertDiv = document.createElement('div')
    alertDiv.className = 'notification is-danger is-light'
    const alertBtn = document.createElement('button')
    alertBtn.className = 'delete'
    alertBtn.addEventListener('click', () => {
        alertDiv.parentNode.removeChild(alertDiv)
    })
    const alertText = document.createElement('p')
    alertText.className = 'subtitle'
    alertText.innerText = msg
    alertDiv.appendChild(alertBtn)
    alertDiv.appendChild(alertText)
    document.querySelector('body').prepend(alertDiv)
}

const hashPasscode = (passcode) => {
    return new Hashes.MD5().hex(passcode)
}

const createMsgCard = (parentNode, msg, author, timeCreated) => {
    headerDiv = document.createElement('header')
    headerDiv.innerHTML = ` <p class="card-header-title">
                                ${author}
                            </p>`
    headerDiv.className = 'card-header'
    contentDiv = document.createElement('div')
    contentDiv.innerHTML = `<div class="content">
                                ${msg}
                            </div>`
    contentDiv.className = 'card-content'
    footerDiv = document.createElement('footer')
    footerDiv.innerHTML = `<p class="subtitle card-footer-item">${moment(timeCreated).fromNow()}</p>`
    footerDiv.className = 'card-footer'
    parentNode.appendChild(headerDiv)
    parentNode.appendChild(contentDiv)
    parentNode.appendChild(footerDiv)
}