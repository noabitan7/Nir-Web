var filmItems;
var data;
const imageContainer = document.getElementById('images');
let imagesHTML = '';
var imageSrc;
const overlay = document.getElementById('overlay');
const overlayBg = document.getElementById('overlay-bg');
const imageShow = document.getElementById("imageShow");
var movies;
var properties;
let counter;
let firstLoad = true;
var prevData;

filmItems = sessionStorage.getItem('filmProperties');
if(filmItems) {
  data = JSON.parse(filmItems);
}

movies = sessionStorage.getItem('films');
if(movies) {
  properties = JSON.parse(movies);
}

const homePage = () => {
  window.location.href = 'index.html'; 
}

function checkVisibility() {
  const boxes = document.querySelectorAll('.create');
  const triggerBottom = window.innerHeight * 0.8; // 80% of the viewport height
  
  boxes.forEach(box => {
    const boxTop = box.getBoundingClientRect().top;
  
    if(boxTop < triggerBottom) {
      box.classList.add('visible');
    } else {
      box.classList.remove('visible');
    }
  });
}

const showShot = (event) => {
  imageSrc = event.currentTarget.src;
  document.getElementById("imageShow").setAttribute("src", imageSrc);
  overlay.classList.remove('hidden');
  setTimeout(() => {
    overlay.style.opacity = '1';
  }, 10);
}

function mixColors(color1, color2, weight) {
  const d = weight / 115;
  const mixedColor = [
    Math.round(color1[0] * (1 - d) + color2[0] * d),
    Math.round(color1[1] * (1 - d) + color2[1] * d),
    Math.round(color1[2] * (1 - d) + color2[2] * d)
  ];
  return mixedColor;
}

const loadPage = () => {
  if(!firstLoad){
    removeImg();    
  }
  imagesHTML = '';
  document.getElementById("filmName").innerText = data.title;
  document.getElementById("director").innerText = data.directing;
  document.getElementById("editor").innerText = data.editing;
  document.getElementById("photographer").innerText = data.photo;
  document.getElementById("movie").setAttribute("src", data.src);
  console.log(document.getElementById("movie").getAttribute("src"));
  for(var i = 1; i <= Number(data.shoots); i++){
    imagesHTML += `<img id="shot${i}" src="${data.url}shot${i}.jpg" class="create shots" alt="shot${i}">`;    
  }

  imageContainer.innerHTML = imagesHTML;

  for(var i = 1; i <= Number(data.shoots); i++){
    document.getElementById(`shot${i}`).addEventListener("click", showShot);    
  }
}

const anotherVideo = (event) => {
  for(let i = 0; i < properties.length; i++){
    if(properties[i].name == data.name){
      counter = i;
    }
  }
  if(event.currentTarget.id == "next"){
    counter == (properties.length -1) ? counter = 0: counter++; 
  } else {
    counter == 0 ? counter = properties.length -1: counter--; 
  }
  prevData = data;
  data = properties[counter];
  firstLoad = false;
  loadPage();
}

const removeImg = () => {
  for(var i = 1; i <= Number(prevData.shoots); i++){
    document.getElementById(`shot${i}`).remove();  
  }
}

window.addEventListener("load", (event) => { 
  loadPage();   
  const colorThief = new ColorThief();
  
  imageShow.addEventListener('load', function() {
    const dominantColor = colorThief.getColor(imageShow);
    const darkColor = mixColors(dominantColor, [0, 0, 0], 50);
    overlayBg.style.background = `rgba(${darkColor[0]}, ${darkColor[1]}, ${darkColor[2]}, 0.7)`;
  });
  
  window.addEventListener('scroll', checkVisibility);
  checkVisibility();   

  document.getElementById("backHomeImg").addEventListener("click", homePage);
  
  overlay.addEventListener('click', () => {
    overlay.style.opacity = '0';
    setTimeout(() => {
      overlay.classList.add('hidden');
    }, 300);
  });

  document.getElementById("prev").addEventListener("click", anotherVideo);
  document.getElementById("next").addEventListener("click", anotherVideo);
  
})



