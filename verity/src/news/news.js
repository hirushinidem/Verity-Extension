document.addEventListener("DOMContentLoaded", () => {
  const apiKey = "8c9864109e684fca9a793347b16019f2"; // Replace with your News API key
  const newsContainer = document.getElementById("news-container");

  // Get current date in YYYY-MM-DD format
  //   const today = new Date();
  //   const year = today.getFullYear();
  //   const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
  //   const day = String(today.getDate()).padStart(2, "0");
  //   const currentDate = `${year}-${month}-${day}`;

  // Get yesterday's date in YYYY-MM-DD format
  const today = new Date();
  today.setDate(today.getDate() - 1); // Subtract one day
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
  const day = String(today.getDate()).padStart(2, "0");
  const yesterdayDate = `${year}-${month}-${day}`;

  fetch(
    `https://newsapi.org/v2/everything?q=political&from=${yesterdayDate}&sortBy=popularity&apiKey=${apiKey}`
  )
    .then((response) => response.json())
    .then((data) => {
      const articles = data.articles;
      if (articles.length > 0) {
        newsContainer.innerHTML = articles
          .map(
            (article) => `
        <div class="news-item">
          <h3>${article.title}</h3>
          <a href="${article.url}" target="_blank">${article.title}</a>
          <br/>
          <span>${article.publishedAt}</span>
          <img src="${article.urlToImage}" width="100%"/>
          <p>${article.description}</p>
        </div>
      `
          )
          .join("");
      } else {
        newsContainer.innerHTML = "No news articles found.";
      }
    })
    .catch((error) => {
      console.error("Error fetching news:", error);
      newsContainer.innerHTML = "Failed to load news.";
    });
});
