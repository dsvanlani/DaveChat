document.addEventListener('DOMContentLoaded', () => {
        // initially set button to disabled
        document.querySelector('button').disabled=true;
        
        // activates button after key up and if length is > 0
        document.querySelector('#chatroom_name').onkeyup = () => {
        if (document.querySelector('#chatroom_name').value.length > 0) {
            document.querySelector('button').disabled=false;
            }
        else {
            document.querySelector('button').disabled=true;
            }
        }
    
      // Connect to websocket
      var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

      // When connected, configure button
      socket.on('connect', () => {

          // button click emits a 'new chatroom' event
          document.querySelectorAll('button').forEach(button => {
              button.onclick = () => {
                  
                  // gets values for chatroom_name, creator, and date_created
                  const chatroom_name = document.querySelector('#chatroom_name').value;
                  const creator = localStorage.getItem('username')
                  const time = new Date()
                  
                  const time_formatted = '';
                  const date_created = time_formatted.concat(String(time.getMonth()+1), '/',
                                                             String(time.getDay()), '/',
                                                             String(time.getFullYear()), ' ',
                                                             String(time.getHours()).padStart(2,'0'), ':',
                                                             String(time.getMinutes()).padStart(2,'0'), ":",
                                                             String(time.getSeconds()).padStart(2,'0')
                                                             );
                  
                  
                  // makes array chat_list containing names of all the chatrooms
                  let chat_list = []
                  document.querySelectorAll('.chatroom').forEach(chatroom => {
                      chat_list.push(chatroom.innerText)
                  });
                  
                  // checks that new_chatroom is not already a chatroom name
                  if (!chat_list.includes(chatroom_name)) {
                      // emits 'new chatroom' event with data
                      socket.emit('new chatroom', {
                      'chatroom_name': chatroom_name,
                      'creator': creator,
                      'date_created':date_created
                            });
                  }
                  else {
                      alert("Chatroom name is already taken.");
                      document.querySelector('#chatroom_name').value='';
                      document.querySelector('button').disabled=true;
                      
                  };
                  
                };

              });
          
                // client recieves 'update chat list' event
          socket.on('update chat list', data => {
              
              // appends onto the <ul id="chat_list">
              document.querySelector('#chatroom_list').innerHTML += `<a href="/chat/${ data.url }" class="chatroom list-group-item"> ${data.chatroom_name}</a>`;
              
              // resets the text box and button
              document.querySelector('#chatroom_name').value='';
              document.querySelector('button').disabled=true;

          });
      });
});

// Redirects the page to /chat if localStorage['username'] is set
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('username') && localStorage.getItem('latest_chatroom')) {
        window.location.href=`/chat/${ localStorage.getItem('latest_chatroom') }`;
    };
    
});

