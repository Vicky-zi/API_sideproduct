//變數
const select = document.getElementById('select'); 
const list = document.getElementById('list');
const pageid = document.getElementById('pageid');
const btn = document.getElementById('btn');


const url = 'https://newsapi.org/v2/';
const apikey = '&apiKey=a83a5ffffbf045d08a279132f5eea344';


//監聽事件
pageid.addEventListener('click', switchPage);
btn.addEventListener('click', searchKey);



//資料API
var xhr = new XMLHttpRequest(); 
let data = {};
xhr.open('get',url+'top-headlines?country=us'+apikey,true); 
xhr.send(null); 
xhr.onload = function() { 
  // console.log(xhr.responseText); 
  if(xhr.status === 200) {
    let str = JSON.parse(xhr.responseText);
    data = str.articles;
  
    pagination(data, 1);

  }else {
    console.log(err);

  }
   
};



function pagination(data, nowPage) {

    // 取得全部資料長度
  const dataTotal = data.length;

  // 預設要顯示在畫面上的資料數量
  const perpage = 3;
  
  // page 按鈕總數量公式 總資料數量 / 每一頁要顯示的資料
  // 這邊要注意，因為有可能會出現餘數，所以要無條件進位。
  const pageTotal = Math.ceil(dataTotal / perpage);

  // 當前頁數，對應現在當前頁數
  let currentPage = nowPage;

    // 因為要避免當前頁數筆總頁數還要多，假設今天總頁數是 3 筆，就不可能是 4 或 5
  // 所以要在寫入一個判斷避免這種狀況。
  // 當"當前頁數"比"總頁數"大的時候，"當前頁數"就等於"總頁數"
  // 注意這一行在最前面並不是透過 nowPage 傳入賦予與 currentPage，所以才會寫這一個判斷式，但主要是預防一些無法預期的狀況，例如：nowPage 突然發神經？！
  if (currentPage > pageTotal) {
    currentPage = pageTotal;
  }

   // 由前面可知 最小數字為 6 ，所以用答案來回推公式。
   const minData = (currentPage * perpage) - perpage + 1 ;
   const maxData = (currentPage * perpage) ;


  // 先建立新陣列
  const newData = [];
  // 這邊將會使用 ES6 forEach 做資料處理
  // 首先必須使用索引來判斷資料位子，所以要使用 index
  data.forEach((item, index) => {
    // 獲取陣列索引，但因為索引是從 0 開始所以要 +1。
    const num = index + 1;


    if ( num >= minData && num <= maxData) {
      newData.push(item);
    }
    
  })


  // 用物件方式來傳遞資料
  const page = {
    pageTotal,
    currentPage,
    hasPage: currentPage > 1,
    hasNext: currentPage < pageTotal,
  }
  show(newData);
  pageBtn(page);
}


function show(newData) {

  let txt = '';
  newData.forEach((item) => {

    txt += `<li class="col mb-2 card-hover" id="active"><a href="${item.url}" class="text-decoration-none">
    <div class="card h-100">
    <div class="card-body d-flex flex-column justify-content-end bg-img text-white" style="background-image: url('${item.urlToImage}');">
        <h5 class="fw-bold">${item.title}</h5>
        <p class="text-break lh-sm text-start text-style">${item.description}</p>
        <p class="text-break lh-sm text-start text-style">${item.content}</p>
        <p class="text-end text-style">作者：${item.author}</p>
        <p class="text-end text-style">${item.publishedAt.slice(0,10)}</p>
        </div>
        </div>
        </a></li>`
    
  });
    
    list.innerHTML = txt;
    
    
  }


  function pageBtn (page){
    let str = '';
    const total = page.pageTotal;
    
    if(page.hasPage) {
      str += `<li class="page-item page-style"><a class="page-link" href="#" data-page="${Number(page.currentPage) - 1}"><span aria-hidden="true">&laquo;</span></a></li>`;
    } else {
      str += `<li class="page-item page-style disabled"><span class="page-link"><span aria-hidden="true">&laquo;</span></span></li>`;
    }
    
  
    for(let i = 1; i <= total; i++){
      if(Number(page.currentPage) === i) {
        str +=`<li class="page-item page-style active"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`;
      } else {
        str +=`<li class="page-item page-style"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`;
      }
    };
  
    if(page.hasNext) {
      str += `<li class="page-item page-style"><a class="page-link" href="#" data-page="${Number(page.currentPage) + 1}"><span aria-hidden="true">&raquo;</span></a></li>`;
    } else {
      str += `<li class="page-item page-style disabled"><span class="page-link">Next</span></li>`;
    }
  
    pageid.innerHTML = str;
  }
  
  function switchPage(e){
    e.preventDefault();
    if(e.target.nodeName !== 'A') return;
    const page = e.target.dataset.page;
    pagination(data, page);
  }

  
  
  // 搜尋
  function searchKey() {
    event.preventDefault();
    let searchValue = document.getElementById('search').value;
    
    //搜尋資料API
    var xhrKey = new XMLHttpRequest(); 
    let keywordData = {};
    xhrKey.open('get',url + 'everything?q='+ searchValue + apikey,true); 
    xhrKey.send(null); 

    console.log(xhrKey);
    xhrKey.onload = function() { 
      let strKey = JSON.parse(xhrKey.responseText);
      keywordData = strKey.articles;

      pagination(keywordData, 1);
      pageBtn(page);
      
    }; 
      
    }


