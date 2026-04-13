let links = [];
let imageData = null;


const imageInput = document.getElementById('image');

imageInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
      imageData = e.target.result;
    };
    reader.readAsDataURL(file);
  });


const storedLinks = localStorage.getItem("links");
if (storedLinks) {
  const Linkdata = JSON.parse(storedLinks);
  links = Linkdata;
  console.log(links);
} else {
  console.log("User data not found in local storage");
}

links.forEach(function (linkObj) {
  createLinkelement(linkObj);
});

function createLinkelement(linkObj) {
  //obtiene elemento lista
  let view = document.getElementById("list_links");
  //crea elemento dentro de las listas
  let newLink = document.createElement("li");
  newLink.id = 'links';

  //almacena dentro de variable, la url del objeto
  let fixedUrl = linkObj.url;

  //verifica que empiece con protocolo https o http
  if (fixedUrl.includes(".")) {
    if (!fixedUrl.startsWith("https://") && !fixedUrl.startsWith("http://")) {
      fixedUrl = "https://" + fixedUrl;
    }
  }

  let url = new URL(fixedUrl);
  //crea elemento para agregar link
  var a = document.createElement("a");
  a.id = "link" 
  a.target = "_blank";
  a.href = url.href;
  //crea el link
  link_url = url.hostname + url.pathname;
  //texto del link puede ser el nombre de el objecto o la direccion
  a.textContent = linkObj.name || link_url;

  //crea div para agregar los botones
  var actions = document.createElement("div");
  actions.id = "actions"

  //crea la imagen
  var image_link = document.createElement("img")
  image_link.className = "image_link";
  if(linkObj.image === null){
    image_link.src = "./img/250x300.svg"
  }
  else{
    image_link.src = linkObj.image;
  }
  
  


  //crea boton de eliminar
  var delete_link = document.createElement("button");
  delete_link.textContent = "Delete";
  delete_link.id = "delete"
  delete_link.onclick = function () {
    this.closest("li").remove();
    links = links.filter((item) => item !== linkObj);
    localStorage.setItem("links", JSON.stringify(links));
    console.log(linkObj);
  };

  //crea boton de editar
  var edit_link = document.createElement("button");
  edit_link.textContent = "Edit";
  edit_link.id = "edit";

  //apenda los botones al div previamente creado
  actions.append(edit_link, delete_link)
  //apenda la imagen, el texto del link, y los botones a la lista
  newLink.append(image_link, a, actions);
  //apenda la lista a la vista de la pagina
  view.appendChild(newLink);
}

//lee el texto introducido por el usuario
function pushlinks() {
  //lee el link 
  var inputText = document.getElementById("link_input").value;
  //lee el nombre
  var nameText = document.getElementById("Name_input").value;
  //lee image
  
  //recorta el link y el para que no haya espacios
  inputText = inputText.trim();
  nameText = nameText.trim();

  //verifica por protocolo http
  try {
    if (inputText.includes(".")) {
      if (
        !inputText.startsWith("https://") &&
        !inputText.startsWith("http://")
      ) {
        inputText = "https://" + inputText;
      }
    }
    

    //verifica que el link si sea un link
    let url = new URL(inputText);
    let hostname = url.hostname;
    let pathname = url.pathname;

    let new_url = hostname + pathname;

    //verifica que el link no este duplicado
    let duplicate = links.some((item) => {
      let storeURl = new URL(item.url);
      let storeHostname = storeURl.hostname;
      let storePathname = storeURl.pathname;

      let new_storeURL = storeHostname + storePathname;

      return new_storeURL === new_url;
    });

    //si no esta duplicado es empuja el objeto
    if (!duplicate) {
      links.push({
        url: url.href,
        name: nameText,
        image: imageData});

      //se almacena en el local storage
      localStorage.setItem("links", JSON.stringify(links));
      console.log(links);
      createLinkelement(links[links.length-1]);
    } else {
      console.log("duplicate link");
    }

    
    document.getElementById("error").textContent = "";
  } catch (err) {
    document.getElementById("error").textContent = "Invalid Link";
  }
}

//crea el modal
const modalTest = document.getElementById('modalTest');
const modal_container = document.getElementById('modal_container');
const Close = document.getElementById('Close');

modalTest.addEventListener('click', () => {
  modal_container.classList.add('show');
});

function cerrar_modal(){
  modal_container.classList.remove('show');
  document.getElementById("link_input").value = "";
  document.getElementById("Name_input").value = "";
  document.getElementById('image').value = "";
  imageDisplay.src = "";
  imageData = null;
}

//cerrar con boton
Close.addEventListener('click', () => {
  cerrar_modal();
});
//cerrar al hacer click en el fondo
modal_container.addEventListener('click', (event) => {
  if(event.target === modal_container){
     cerrar_modal();
}
})
//cerrar al presionar esc
document.addEventListener('keydown', (event) => {
  if(event.key === 'Escape' && modal_container.classList.contains('show')){
    cerrar_modal();
  }
});



