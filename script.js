
const ticketmaster_api_key='5nzXRp1ON7Vono4IZ2aQpPHmbcJuBe8y';
const ticketmaster_endpoint='https://app.ticketmaster.com/discovery/v2/events'

function onResponse(response){
    console.log('Risposta ricevuta da Ticketmaster');
    return response.json();
}

function onJsonTicket(json){
    const eventi=json._embedded;
    const vista_ticket=document.querySelector('#ticket-view');
    vista_ticket.innerHTML="";

    if(eventi==undefined){
        console.log("non ci sono ticket per questo artista!");
        const errore=document.createElement('h1');
        errore.textContent="Non ci sono ticket per questo artista in Italia :(";
        vista_ticket.appendChild(errore);
    }else{
      const lista_ticket=json._embedded;
      for (ticket of lista_ticket.events){
        console.log(ticket);
        const div_content =document.createElement('div');
        div_content.classList.add('content');
    
        const div_left =document.createElement('div');
        div_left.classList.add('left');
        const div_right =document.createElement('div');
        div_right.classList.add('right');
    
        const immagine =document.createElement('img');
        immagine.src=ticket.images[0].url;
        div_left.appendChild(immagine);
        
        const nome_evento=document.createElement('h1');
        nome_evento.textContent=ticket.name;
        
        const data_evento=document.createElement('em');
        data_evento.textContent="Data: " + ticket.dates.start.localDate;
    
        const luogo=document.createElement('em');
        luogo.textContent ="Luogo: "+ticket._embedded.venues[0].name;
    
        div_right.appendChild(nome_evento);
        div_right.appendChild(data_evento);
        div_right.appendChild(luogo);
    
        div_content.appendChild(div_left);
        div_content.appendChild(div_right);
        vista_ticket.appendChild(div_content);
      }
    }
}
function onResponseSpotify(response){
    console.log('Risposta ricevuta da Spotify');
    return response.json();
}

function onJsonSpotify(json){
  const artista=json.artists.items[0];
  console.log(artista);

  const immagine_artista=artista.images[0].url;
  console.log(immagine_artista);

  const panelArtista=document.querySelector('#Artista');
panelArtista.innerHTML="";
  const titolo_elem=document.createElement('h2');
  const enfasi_elem=document.createElement('em');
  const immagine=document.createElement('img');

  titolo_elem.textContent=artista.name;
  const followers= artista.followers.total;
  enfasi_elem.textContent="Followers: " + followers;
  immagine.src=immagine_artista;

  panelArtista.appendChild(titolo_elem);
  panelArtista.appendChild(enfasi_elem);
  panelArtista.appendChild(immagine);

  artista_id=artista.id;
  fetch("https://api.spotify.com/v1/artists/" + artista_id+"/albums",
    {
      headers:
      {
        'Authorization': 'Bearer ' + token
      }
    }
  ).then(onResponseSpotify).then(onJsonSpotifyAlbum);
}
function onJsonSpotifyAlbum(json){
  const lista_album=json.items;
  console.log(lista_album);

  const vista_album =document.querySelector('#album-view');
  vista_album.innerHTML="";

  
  for(album of lista_album){

    if(album.album_type==="album"){

      const div_content =document.createElement('div');
      div_content.classList.add('content');
  
      const div_left =document.createElement('div');
      div_left.classList.add('left');
      const div_right =document.createElement('div');
      div_right.classList.add('right');
  
      const immagine =document.createElement('img');
      immagine.src=album.images[0].url;
      div_left.appendChild(immagine);
      
      const nome_album=document.createElement('h1');
      nome_album.textContent=album.name;
      
      const data_rilascio=document.createElement('em');
      data_rilascio.textContent="Data di rilascio: " + album.release_date;
  
      const num_tracks=document.createElement('em');
      num_tracks.textContent ="Numero di tracce: "+album.total_tracks;
  
      div_right.appendChild(nome_album);
      div_right.appendChild(data_rilascio);
      div_right.appendChild(num_tracks);
  
      div_content.appendChild(div_left);
      div_content.appendChild(div_right);
      vista_album.appendChild(div_content);

    }
    
  }
  
  

}

function onSearch(event){
    event.preventDefault();
    const testo =document.querySelector('#content');
    const testoURI =encodeURI(testo.value)
    console.log(testo.value);
    const url_ticketmaster=ticketmaster_endpoint+'?apikey='+ticketmaster_api_key+'&keyword='+testoURI+'&locale=*&countryCode=IT';
    fetch(url_ticketmaster).then(onResponse).then(onJsonTicket);

    fetch("https://api.spotify.com/v1/search?type=artist&q=" + testo.value,
    {
      headers:
      {
        'Authorization': 'Bearer ' + token
      }
    }
  ).then(onResponseSpotify).then(onJsonSpotify);
}

function onTokenJson(json)
{
  token = json.access_token;
}

function onTokenResponse(response)
{
  return response.json();
}

const client_id = 'ff68fcb0db63440ba648808b5b8a39cd';
const client_secret = '3e68a3ba553940da89ed6f5d5dd941b3';
let token;

fetch("https://accounts.spotify.com/api/token",
	{
   method: "post",
   body: 'grant_type=client_credentials',
   headers:
   {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret)
   }
  }
).then(onTokenResponse).then(onTokenJson);

const form=document.querySelector('form');
form.addEventListener('submit',onSearch);

let artista_id;
