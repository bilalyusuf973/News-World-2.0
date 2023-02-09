const searchBtn = document.querySelector('#searchBtn');
const links = document.querySelectorAll('.navLinks');
const keyword = document.getElementById('keyword');
const hiddenKeyword = document.getElementById('hiddenKeyword');
const pageNo = document.getElementById('pageNo');
const exactPages = document.querySelectorAll('.exactPage');
const prevNextPages = document.querySelectorAll('.prevNext');
const pagination = document.querySelector('.pagination');

let totalPages = 0;

if(hiddenKeyword.value === ""){
  pagination.classList.add('hide');
}

links.forEach(link => {
  link.addEventListener('click', e => {
    keyword.value = e.currentTarget.innerText;
    pageNo.value = "1";
    fetchNews(e);
  })
});

exactPages.forEach(page => {
  page.addEventListener('click', e => {
    keyword.value = hiddenKeyword.value;
    pageNo.value = e.currentTarget.lastElementChild.innerText;
    fetchNews(e);
  })
});

prevNextPages.forEach(page => {
  page.addEventListener('click', e => {
    keyword.value = hiddenKeyword.value;
    pageNo.value = `${parseInt(pageNo.value) + e.currentTarget.value}`;
    if(pageNo.value === "0"){
      pageNo.value = "1";
      return;
    }
    if(parseInt(pageNo.value) > totalPages){
      pageNo.value = `${totalPages}`;
      return;
    }
    fetchNews(e);
  })
});


const fetchNews = async (e) => {
  e.preventDefault();
  try {
      if(keyword.value === "") return;

      hiddenKeyword.value = keyword.value;
      keyword.value = "";

      const response = await fetch(`https://newsapi.org/v2/everything?q=${hiddenKeyword.value}&language=en&pageSize=12&page=${pageNo.value}&apiKey=1cd54373d5ba4c0b944c396958fceedf`, { method: 'GET' });

      const {articles, totalResults} = await response.json();
      totalPages = Math.ceil(totalResults/12);
      
      let news = "";

      news += articles.map(article => `<div class="card mx-2 text-light bg-dark" style="width: 18rem;">
      <img class="card-img-top" src=${article.urlToImage} alt="image">
      <div class="card-body">
        <h5 class="card-title">${article.title}</h5>
        <p class="card-text">${article.description}</p>
        <a href=${article.url} class="btn btn-primary">Read more...</a>
      </div>
    </div>`);

    document.querySelector('.showCategory').innerText = `${hiddenKeyword.value}`;

    document.querySelector('.cards').innerHTML = news;
    pagination.classList.remove('hide');

  } catch (error) {
    console.log(error);
  }

}

window.onload = fetchNews;

searchBtn.addEventListener('click', fetchNews);
