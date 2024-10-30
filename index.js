document.addEventListener("DOMContentLoaded", () => fetchData);

function fetchData() {
    fetch('url')
    .then((resp) => resp.json())
    .then((data) => console.log(data));
}