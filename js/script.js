// Pegando os inputs
const inputs = document.getElementsByTagName('input');

Array.from(inputs).forEach((i) => {
    i.addEventListener('click', (e) => {
      
        if (e.target.classList.contains('get')) {
            showCaseGet();
        } else if (e.target.classList.contains('head')) {
            showCaseHead();
        } else if (e.target.classList.contains('patch')) {
            showCasePatch();
        } else if (e.target.classList.contains('put')) {
            showCasePut();
        } else if (e.target.classList.contains('post')) {
            showCasePost();
        } else if (e.target.classList.contains('delete')) {
            showCaseDelete();
        } else if (e.target.classList.contains('options')) {
            showCaseOptions();
        } else if (e.target.classList.contains('trace')) {
            showCaseTrace();
        } else if (e.target.classList.contains('connect')) {
            showCaseConnect();
        }
    });
});


const showCaseGet = () => {
    alert('GET');
};
const showCaseHead = () => {
    alert('HEAD');
};
const showCasePatch = () => {
    alert('PATCH');
};
const showCasePut = () => {
    alert('PUT');
};
const showCasePost = () => {
    alert('POST');
};
const showCaseDelete = () => {
    alert('DELETE');
};
const showCaseOptions = () => {
    alert('OPTIONS');
};
const showCaseTrace = () => {
    alert('TRACE');
};
const showCaseConnect = () => {
    alert('CONNECT');
};
