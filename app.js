// We append to the UI the already existing saved links
if(localStorage.getItem('links')) {
    const saved = JSON.parse(localStorage.getItem('links'));
    saved.forEach( (entry) => {
        const newEntry = document.createElement('div');
            newEntry.innerHTML =   `<div id='id${entry}' class='saved-link'>
                                    <a href="http://rel.ink/${entry}">http://rel.ink/${entry}</a> <img src="img/remove.png" alt="">
                                    </div>`
            
            document.querySelector('.saved-links').appendChild(newEntry);
    })
}


//We initialize the array for the local storage
let local = [];

// Button event listener and constant
const button = document.querySelector('button');
button.addEventListener('click', (e) => {
    e.preventDefault();

    if(document.querySelector('input').value === "") {
        document.querySelector('.output').innerHTML = `<p style='color: red;font-size: 1.7rem';>Please enter a valid link</p>`;
    } else {
        shortUrl(document.querySelector('input').value);
    }
})

//The function which returns the short version of the link, saves it to the UI and to localStorage
const shortUrl = async (link) => { 
        await axios.post('https://rel.ink/api/links/', {
        "url": `${link}`
    })
    .then((res) => {
        // If the call succeded we put the output on the page
        let wtf = res.data.hashid;
        document.querySelector('.output').innerHTML = `<p class='output-text--important'>Your link: <span id='output-link'><a href='http://rel.ink/${res.data.hashid}'>http://rel.ink/${res.data.hashid}</a></span></p>
        <p class='output-text'>We used rel.ink API in order to short the link, don''t forget to check their own website!
            Thank you for using this web application!</p>
        <p class='output-data'>${res.data.created_at}</p>`

        
        // If there's no link with the same ID it will save it to the UI (saved links)
        if(!document.querySelector(`#id${res.data.hashid}`)) {
            //We create the element
            const newEntry = document.createElement('div');
            newEntry.innerHTML = `<div id='id${res.data.hashid}' class='saved-link'>
                                    <a href="http://rel.ink/${res.data.hashid}">http://rel.ink/${res.data.hashid}</a> <img src="img/remove.png" alt="">
                                </div>`
            
            //We append the element
            document.querySelector('.saved-links').appendChild(newEntry);

            //We check the localStorage
            if(!localStorage.getItem('links')){
                //If there's nothing saved we make a array in the local storage and push first object
                localStorage.setItem('links', local);
                local.push(res.data.hashid);
                localStorage.setItem('links', JSON.stringify(local));
            } else {
                //If localStorage tasks exists, we get the data, append new object and save it
                local = JSON.parse(localStorage.getItem('links'));
                local.push(res.data.hashid);
                localStorage.setItem('links', JSON.stringify(local));
            }
        }
    })
    .catch((err) => {
        document.querySelector('.output').innerHTML = `<p style='color: red;font-size: 1.7rem';>Please enter a valid link</p>`;
    })
}

// Removing specific link from the list
const remove = document.querySelector('body');
remove.addEventListener('click', (e) => {
    //We check if the clickable item contains the classList
    if(e.target.parentElement.classList.contains('saved-link')) {
        //If it contains then we get the localStorage data
        local = JSON.parse(localStorage.getItem('links'));
        //We remove the link from the localStorage
        if(local.indexOf(e.target.parentElement.id.substr(2)) === 0) {
            local.shift();
        } else {
            local.splice(local.indexOf(e.target.parentElement.id.substr(2)));
        };

        // We save the new array of links
        localStorage.setItem('links', JSON.stringify(local));
        // We delete the link from the UI
        e.target.parentElement.remove();
    }
    
})