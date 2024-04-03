async function fetchData(url) {
    try {
        let response = await fetch(url);
        let data = await response.json();

        return data;
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}
// easy  medium    hard
fetchData("https://api.unsplash.com/search/photos?query=computers&client_id=zj8ISMmd3gz5xJRIin98bhscoGqn1iFsO21vvTF4Zlg&width=400&height=400")
    .then(data => console.log(data.results[0].urls.full))
    .catch(error => console.error(error));

