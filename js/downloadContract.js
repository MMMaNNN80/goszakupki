
const DOWNLOADCONTRACT  =  "downLoadContract";
const CLEARLOCALSTORAGE =  "clearLocalStorage";
const COUNTRESULTROWS   =  "countResultRows";
const START = "START";
const WORK  = "WORK";
const END   = "END"
let x = {}
let m=[]
let objlist = [];
const activePage = Number(document.querySelector("a.page__link.page__link_active")?.textContent.replaceAll("\n", "").replaceAll(" ", "")) ?? 0
const pages = document.querySelectorAll("a.page__link") ?? ''

const  sendMessages = (x) => chrome.runtime.sendMessage(x);

chrome.runtime.onMessage.addListener( (action,sender) => {

        if (action.message === START) {
            x.message = START
            x.text = `  активна ${activePage? activePage : 1} вкладка.`
            sendMessages(x)
        } else if (action.message === CLEARLOCALSTORAGE) {
            if (localStorage.getItem('list') !== null) localStorage.removeItem('list');
            if (localStorage.getItem('state') !== null) localStorage.removeItem('state');
        }
        else if (action.message === DOWNLOADCONTRACT)  {
            downLoadContract()
        }
        else if (action.message === COUNTRESULTROWS) {
            console.log('COUNTRESULTROWS')

            const el = document.body.querySelector('div.search-results__total');
            let str = el.textContent.replaceAll("\n", "").replaceAll(' ','').split('')
            let totalCount = 0
            str.forEach((s)=>{
                !isNaN(parseFloat(s)) && isFinite(s) ? m.push(s):''
             })
            totalCount = Number(m.join(''));
            !totalCount ? totalCount = 0: totalCount
            // totalCount > 1000 ? totalCount = 1000 : ''
         

        }

    }
)

 const createPlainTextFile =  (list, objlist) => {
        let dataFile = "data:application/txt;charset=utf-8,%EF%BB%BF";
        dataFile += Object.keys(objlist[0]).join(`;`) + '\r\n'
        //"Number;Status;NumberContract;Customer;Price;DateContract;DatesContract;DatePublic;DateUpdate\r\n"
        dataFile += encodeURIComponent(list.join("\r\n"));
        return dataFile;
    }
    const getOutput =  (objlist) => {
        if (objlist.length > 0) {
            let download = createPlainTextFile(objlist.map(el => el = Object.values(el).join(`;`)), objlist);
            let a = document.createElement("a")
            a.download = "contracts.csv"
            a.href = download
            a.click()
        }
    }
const downLoadContract = () => {

    const endPage = Number(pages[pages.length - 1].innerText) ?? 0
    let list = []
    let card = document.querySelectorAll("div.search-registry-entry-block")
    card.forEach(element => {
        let c = {}
        c.Number = "'" + element.querySelector("div.registry-entry__header-mid__number").textContent.replaceAll("\n", "").replaceAll(" ", "").replaceAll("№", "") ///ИСПРАВЛЕНИЕ ВНЕС
        c.Status = element.querySelector("div.registry-entry__header-mid__title").textContent.replaceAll("\n", "").trim()
        c.NumberContract = element.querySelector("div.registry-entry__body-value")?.textContent.replaceAll("\n", "").replaceAll(" ", "") ?? ""
        c.Customer = element.querySelector("div.registry-entry__body-href").textContent.replaceAll("\n", "").trim()
        c.Price = element.querySelector("div.price-block__value").textContent.replaceAll("\n", "").replaceAll(" ", "").replaceAll("₽", "")
        let d = element.querySelector("div.data-block")
        c.DateContract = d.querySelectorAll("div.data-block__value")[0].textContent.replaceAll("\n", "").replaceAll(" ", "")
        c.DatesContract = d.querySelectorAll("div.data-block__value")[1].textContent.replaceAll("\n", "").replaceAll(" ", "")
        c.DatePublic = d.querySelector("div.row").querySelectorAll("div.data-block__value")[0].textContent.replaceAll("\n", "").replaceAll(" ", "")
        c.DateUpdate = d.querySelector("div.row").querySelectorAll("div.data-block__value")[1].textContent.replaceAll("\n", "").replaceAll(" ", "")
        list.push(c)
    });

    localStorage.getItem('list') !== null ? objlist = [...JSON.parse(localStorage.getItem('list')), ...list] : objlist = list
    const countRecords = (objlist.length >= 1000 ? 1000 : objlist.length)
    localStorage.setItem('list', JSON.stringify(objlist))

    actualWorkMethod();

    function  actualWorkMethod ()  {
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
            })
        } else {
           
            x.message = END;
            x.text = `${activePage} вкладка из ${activePage}`
            localStorage.setItem('state',END)
            sendMessages(x)
             getOutput(objlist)
        }
    }
  
}

