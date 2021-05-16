
let action ={}

const sendMessages = (action) => {
    chrome.tabs.query({ active: true, currentWindow: true }
        ,(tabs) => chrome.tabs.sendMessage(tabs[0].id, action))
}
const clearLocalStorage = ()=>{
    action={}
    action.message = `clearLocalStorage`
    sendMessages(action);
}
const countResultRows = () =>{
    action={}
    action.message = `countResultRows`
    sendMessages(action);
}
const start = () =>{
    action={}
    action.message = `START`
    sendMessages(action);
}

const initialState =   () => {
    clearLocalStorage()
    countResultRows() 
    start()
}
document.body.onload = initialState

const download = () =>
{   action={}
    action.message  =  `downLoadContract`
    sendMessages(action);
}



const beforeUnloadListener = (event) =>{
    event.preventDefault();
    alert ("АХТУНГ АХТУНГ")
}

window.addEventListener("beforeunload", beforeUnloadListener, {capture: true});



    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
        if (changeInfo.status == 'complete') {
            download()
        }
    })
//document.body.addEventListener("load",initialState,false)


//document.body.onload = countResultRows
document.querySelector("button").onclick = download



chrome.runtime.onMessage.addListener((request,sender,response) => {
                    if (request.message && (request.message === "START" || "WORK")) {
                        const el = document.getElementsByTagName('h4')
                        if (!document.getElementById('page')) {
                            let el2 = document.createElement('p')
                            el2.id = 'page'
                            el2.textContent = request.text
                            el[0].insertAdjacentElement('afterend', el2)
                        }
                        document.getElementById('page').textContent = request.text
                    } else if (request.message && request.message === 'END') {
                        document.getElementById('page').textContent = request.text
                    } }

        );





