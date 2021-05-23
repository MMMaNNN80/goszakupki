
const DOWNLOADCONTRACT  =  "downLoadContract";
const CLEARLOCALSTORAGE =  "clearLocalStorage";
const COUNTRESULTROWS   =  "countResultRows";
const START = "START";
const WORK  = "WORK";
const END   = "END"
let x = {}
let m=[]
let objlist =[]
let activePage = 0
let endPage = 0
let pages
// -- Инициализация

// проверка на количество карт на странице
if(document.querySelectorAll("div.search-registry-entry-block") && window.location.pathname.includes(`contract/search/results`) )  {
    pages = document.querySelectorAll("a.page__link")
    activePage = 1
    if( document.querySelector("a.page__link.page__link_active")) { activePage = Number(document.querySelector("a.page__link.page__link_active")?.textContent.replaceAll("\n", "").replaceAll(" ", ""))}
    endPage = 1
    if(pages.length>0) { endPage = Number(pages[pages.length - 1].textContent)}
}




const  sendMessages = x => chrome.runtime.sendMessage(x);

function addLocalStorage (list) {
    localStorage.getItem('list') !== null ?  objlist = [...JSON.parse(localStorage.getItem('list')), ...list] : objlist = list // пополнение LOCALSTORAGE и ObjList
    localStorage.setItem('list', JSON.stringify(objlist))
}



chrome.runtime.onMessage.addListener( (action,sender) => {
        if (action.message === START) {


if (document.body.querySelector('.select-record-per-page--number')){
    let cb = document.body.querySelector('.select-record-per-page--number')
    cb.click()
    document.getElementById('_50').click()
}


                x.message = START
                x.activePage =activePage
                x.endPage =endPage
               if (activePage) {x.text = `активна ${activePage} вкладка  из ${endPage}`}
                sendMessages(x)

        } else if (action.message === CLEARLOCALSTORAGE) {
            if (localStorage.getItem('list') !== null) localStorage.removeItem('list');
            if (localStorage.getItem('state') !== null) localStorage.removeItem('state');
        }
        else if (action.message === DOWNLOADCONTRACT)
        {
            addLocalStorage(getList(activePage))
            downLoadContract()
        }
        else if (action.message === COUNTRESULTROWS) {

            const el = document.body.querySelector('div.search-results__total');
            let str = el.textContent.replaceAll("\n", "").replaceAll(' ','').split('')
            let totalCount = 0
            str.forEach((s)=>{
                !isNaN(parseFloat(s)) && isFinite(s) ? m.push(s):''
             })
            totalCount = Number(m.join(''));
            !totalCount ? totalCount = 0: totalCount //количество, указанное на странице
        }

    }
)

const downLoadContract = () => {
        if (activePage !== endPage) {
            pages.forEach((page) => {
                if (Number(page.innerText) === activePage + 1) {
                    x.page = page
                    x.activePage = activePage
                    x.nextPage = activePage + 1
                    x.endPage = endPage
                    x.message = WORK
                    x.text = `Загружается ${x.nextPage} вкладка из ${x.endPage}`
                    sendMessages(x)
                    x.page.click();
                    localStorage.setItem('state',WORK)
                    }
            }) } else {
            x.message = END;
            x.endPage = endPage
            x.activePage =activePage
            x.text = `${activePage} вкладка из ${activePage}`
            localStorage.setItem('state',END)
             sendMessages(x)
             getOutput(objlist) } }


//----ПОДГОТОВКА ГЛАВНОГО ОБЪЕКТА


function getList (activePage) {
    let list = []
    let card = document.querySelectorAll("div.search-registry-entry-block")
    card.forEach(element => {
        let c = {}
        c.Number = element.querySelector("div.registry-entry__header-mid__number").textContent.replaceAll("\n", "").replaceAll(" ", "") ///ИСПРАВЛЕНИЕ ВНЕС
        c.Status = element.querySelector("div.registry-entry__header-mid__title").textContent.replaceAll("\n", "").trim()
        c.NumberContract = element.querySelector("div.registry-entry__body-value")?.textContent.replaceAll("\n", "").replaceAll(" ", "") ?? ""
        c.Customer = element.querySelector("div.registry-entry__body-href").textContent.replaceAll("\n", "").trim()
        c.Price = element.querySelector("div.price-block__value").textContent.replaceAll("\n", "").replaceAll(" ", "").replaceAll("₽", "")
        let d = element.querySelector("div.data-block")
        c.DateContract = d.querySelectorAll("div.data-block__value")[0].textContent.replaceAll("\n", "").replaceAll(" ", "")
        c.DatesContract = d.querySelectorAll("div.data-block__value")[1].textContent.replaceAll("\n", "").replaceAll(" ", "")
        c.DatePublic = d.querySelector("div.row").querySelectorAll("div.data-block__value")[0].textContent.replaceAll("\n", "").replaceAll(" ", "")
        c.DateUpdate = d.querySelector("div.row").querySelectorAll("div.data-block__value")[1].textContent.replaceAll("\n", "").replaceAll(" ", "")
        c.activePage = activePage
        list.push(c)
    });
    return list;
}

// ---ПОДГОТОВКА ФАЙЛА ДЛЯ СКАЧИВАНИЯ
function createPlainTextFile  (list, objlist)  {
    let dataFile = "data:application/txt;charset=utf-8,%EF%BB%BF";
    dataFile += Object.keys(objlist[0]).join(`;`) + '\r\n'
    //"Number;Status;NumberContract;Customer;Price;DateContract;DatesContract;DatePublic;DateUpdate\r\n"
    dataFile += encodeURIComponent(list.join("\r\n"));
    return dataFile;
}

function getOutput (objlist)  {
    if (objlist.length > 0) {
        let download = createPlainTextFile(objlist.map(el => el = Object.values(el).join(`;`)), objlist);
        let a = document.createElement("a")
        a.download = "contracts.csv"  ///возвращаем encodeURIComponent + заголовок
        a.href = download
        //console.log(a)
        x.linkDownload = {download:a.download, href:a.href}
        sendMessages(x)
    }
}


