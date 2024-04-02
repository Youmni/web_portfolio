async function fetchData(url) {
    try {
        let response = await fetch(url);
        let data = await response.json();

        let questions = {};
        for(let i = 0; i < data.results.length; i++) {
            questions[`question${i + 1}`] = {
                type: data.results[i].type,
                difficulty: data.results[i].difficulty,
                question: data.results[i].question,
                correct_answer: data.results[i].correct_answer,
                incorrect_answers: data.results[i].incorrect_answers
            };
        }
        
        return questions;
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}
// easy  medium    hard
fetchData("https://opentdb.com/api.php?amount=10&category=32&difficulty=hard&type=multiple")
    .then(data => console.log(data))
    .catch(error => console.error(error));

