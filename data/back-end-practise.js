const xhr = new XMLHttpRequest();

xhr.addEventListener("load", ()=> {
    // console.log(xhr.response)
} )
xhr.open('GET',"https://supersimplebackend.dev")//supersimplebackend.dev")

xhr.send();
xhr.response