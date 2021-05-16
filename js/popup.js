
let action ={}
localStorage.getItem('state') === null ||  localStorage.getItem('state') !== 'END'? localStorage.removeItem('state') : ''


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


const download = () =>
{   
    
    action={}
    action.message  =  `downLoadContract`
    sendMessages(action);
    
}

document.body.onload = initialState

chrome.runtime.onMessage.addListener((request,sender,response) => {
    const el = document.getElementsByTagName('h5')  
    if (document.querySelector('.progress')) document.querySelector('.progress').remove()
    if (request.message && (request.message !== "END")) {       
   
    el[0].insertAdjacentHTML('afterend', (request.endPage>0) && request.activePage >0 ?
    getProgressBar(request) : `` ) 
     localStorage.setItem('state','WORK') 
        if (document.getElementById('page') === null) {
            let el2 = document.createElement('p')
            el2.id = 'page'
            el2.textContent = request.text
            el[0].insertAdjacentElement('afterend',el2)
           
        }   
        document.getElementById('page').textContent = request.text ?? ''                     
    } 
    else  {
        
        localStorage.setItem('state','END') 
        document.getElementById('page').textContent = request.text
        
        el[0].insertAdjacentHTML('afterend', getProgressBar({activePage:100, endPage:100}))
        
    } 
}

);

    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
        if (changeInfo.status == 'complete' && localStorage.getItem('state') !== null) {
              download()
        }
    })
//document.body.addEventListener("load",initialState,false)


//document.body.onload = countResultRows
document.querySelector("button").onclick = download




        function getProgressBar (request) {
            return  `<div class="progress"> 
            <div class="progress-bar bg-success" 
            role="progressbar" 
            style="width: ${(request.activePage /request.endPage * 100).toFixed(0)}%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
            ${(request.activePage/request.endPage * 100).toFixed(0)}%
            </div>
            </div>`

        }





