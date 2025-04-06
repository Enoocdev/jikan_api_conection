let dentroTipo = "anime";
let tipo = "top";
let pagina = 0;
let paginaSiguente;
let controladorModal = 0
var jikan = `https://api.jikan.moe/v4`
var urlActual;
let mostrados = []

function cambiarUrl(){
                pagina ++
                mostrados = []
                const tipo = "/" + (document.querySelector(".animeManga").value == "" ? "anime" : document.querySelector(".animeManga").value)
                const order =  document.querySelector("#orderBy").value
                const generes = document.querySelector("#generes").value
                let np = `?page=${pagina}`;
                let news = document.querySelector("#news").checked == true ?  `&status=upcoming` : "";
                let gener = generes != "" ? "&genres=" + generes : ""
                let orderBy = order != "" ? `&order_by=` +  order + "&sort=desc": ""

            return (jikan + tipo + np + news + orderBy   + gener);
        }

window.onload = async function (dentroTipo) {
    const selects = document.querySelectorAll(".options")

    const contenedor = document.querySelector(".card-container");
    let filtro = document.querySelector(".fitro");
    const generes = document.querySelector("#generes")
    urlActual = cambiarUrl()

    console.log(urlActual)

    fetch("https://api.jikan.moe/v4/genres/anime").then((Response) => Response.json()).then((data) => {

        console.log(data)

        data.data.map( genero => {
            
            let option = document.createElement("option")
            option.setAttribute("value", genero.mal_id )
            option.innerText = genero.name

            generes.appendChild(option)
        });
    })
    
    fetch(urlActual)
        .then((Response) => Response.json())
        .then((data) => obtenerTodosLosElementos(data))
        .catch((error) => {
        console.error("Error:", error);
        });
        


        console.log(selects)
        selects.forEach(element => {
            element.addEventListener("change", (event) =>{
                
                pagina = 0
                urlActual = cambiarUrl()

                console

                contenedor.innerHTML = "";
                dentroTipo = filtro.value;
                
                fetch(urlActual)
                    .then((Response) => Response.json())
                    .then((data) => obtenerTodosLosElementos(data))
                    .catch((error) => {
                    console.error("Error:", error);
                    });
                
                
            })
        });
    
        window.addEventListener("scroll",(event) =>{
        let filtro = document.querySelector(".fitro");

        const {
            scrollTop,
            scrollHeight,
            clientHeight
        } = document.documentElement;

        if (scrollTop + clientHeight + 500 >= scrollHeight - 5 && paginaSiguente){

            paginaSiguente = false
            
            urlActual = cambiarUrl()
            if(filtro.value != ""){
                fetch(urlActual).then((Response)=>Response.json()).then((data) => obtenerTodosLosElementos(data))
            }else{
                fetch(urlActual).then((Response)=>Response.json()).then((data) => obtenerTodosLosElementos(data))
            }
            
            console.log(pagina)
            console.log(urlActual)
            
        }
})

    // filtro.addEventListener("change", (event) => {
    // contenedor.innerHTML = "";
    // dentroTipo = filtro.value;
    // pagina = 1;
    // fetch(`https://api.jikan.moe/v4/${tipo}/${dentroTipo}`)
    //     .then((Response) => Response.json())
    //     .then((data) => obtenerTodosLosElementos(data))
    //     .catch((error) => {
    //     console.error("Error:", error);
    //     });
    // });

};



async function obtenerTodosLosElementos(data) {
    console.log(urlActual)
    todosLosDatos = data.data;


    if (todosLosDatos[0] == undefined){
        const contenedor = document.querySelector(".card-container");
        let p = document.createElement("h5")
        p.innerText = "No hay datos"
        contenedor.appendChild(p)
    }else{
        if(!data.paginacion) paginaSiguente = data.pagination.has_next_page
        
        generarCarrousel(todosLosDatos)
        generarHtml(todosLosDatos)
    }
}

function generarHtml(todosLosDatos) {
    const contenedor = document.querySelector(".card-container");
    
    for (let i = 0; i < todosLosDatos.length; i++) {
    let plantilla = `<img src="..." class="card-img-top" alt="...">
                                <div class="card-body">
                                    <div class="datos">
                                        <h5 class="card-title" >Card title</h5>
                                        <p class="card-text"><span class="fecha"></span><hr><span class="duration"></span></p>
                                        <!-- Button trigger modal -->
                                            <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal-${controladorModal}">
                                                synopsis...
                                            </button>

                                            <!-- Modal -->
                                            <div class="modal fade" id="exampleModal-${controladorModal}" tabindex="-1" aria-labelledby="exampleModalLabel-${controladorModal}" aria-hidden="true">
                                            <div class="modal-dialog">
                                                <div class="modal-content">
                                                <div class="modal-header">
                                                    <h1 class="modal-title fs-5" id="exampleModalLabel-${controladorModal}">Modal title</h1>
                                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                </div>
                                                <div class="contenedor-img-body-modal">
                                                    <img src="..." class="card-img-modal" alt="...">
                                                    <div class="modal-body">
                                                        ...
                                                    </div>
                                                </div>
                                                <div class="modal-footer">
                                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                </div>
                                                </div>
                                            </div>
                                            </div>


                                    </div>
                            </div>
                            `;
    controladorModal++
    const newCard = document.createElement("div");
    newCard.classList = ["card"];
    newCard.style = "width: 18rem;";
    newCard.innerHTML = plantilla;

    try{
        newCard.querySelector(".fecha").innerHTML = todosLosDatos[i].aired.string;
        newCard.querySelector(".duration").innerHTML =  todosLosDatos[i].episodes ? "Nº episodes :" + todosLosDatos[i].episodes : "Proximamente ...";
    }catch(error){
        newCard.querySelector(".fecha").innerHTML = todosLosDatos[i].published.string
        newCard.querySelector(".duration").innerHTML = todosLosDatos[i].chapters
    }
    
    // if (filtro.value == "manga") {
    //     newCard.querySelector(".fecha").innerHTML =
    //     todosLosDatos[i].published.string;
    //     newCard.querySelector(".duration").innerHTML =
    //     todosLosDatos[i].scored;
    // } else {
    //     newCard.querySelector(".fecha").innerHTML =
    //     todosLosDatos[i].aired.string;
    //     newCard.querySelector(".duration").innerHTML =
    //     todosLosDatos[i].duration;
    // }
    if(mostrados.includes(todosLosDatos[i].mal_id)) continue

        mostrados.push(todosLosDatos[i].mal_id)
        newCard.querySelector(".modal-body").innerHTML =
            todosLosDatos[i].synopsis;
        newCard.querySelector(".card-img-top").src =
            todosLosDatos[i].images.jpg.large_image_url;
        newCard.querySelector(".card-img-modal").src =
            todosLosDatos[i].images.jpg.large_image_url;
        newCard.querySelector(".card-title").innerHTML =
            todosLosDatos[i].title;
        newCard.querySelector(".modal-title").innerHTML =
            todosLosDatos[i].title;

        contenedor.appendChild(newCard);
    
    }
}

function generarCarrousel(todosLosDatos){
    let imagenesCarrusel = document.querySelectorAll(".carousel-item")
    let animeManga = document.querySelector(".animeManga").value
    console.log(animeManga)
    let filtro =   animeManga = "" ?  "anime" : animeManga 
    
    for (let i = 0; i < 3; i++) {
        
        fetch(`https://api.jikan.moe/v4/${animeManga}/${todosLosDatos[i].mal_id}/pictures`)
        .then(res => res.json()).then(data => {
            
            imagenesCarrusel[i].querySelector("img").src = data.data[0].jpg.large_image_url;
            
        }).catch((error) => {
            imagenesCarrusel[i].querySelector("img").src = todosLosDatos[i].images.jpg.large_image_url
        });
        imagenesCarrusel[i].querySelector("h5").innerHTML = todosLosDatos[i].title
        
        
    }
}
