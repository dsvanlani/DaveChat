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
                  const date_created = new Date()
                  
                  // emits 'new chatroom' event with data
                  socket.emit('new chatroom', {
                  'chatroom_name': chatroom_name,
                  'creator': creator,
                  'date_created':date_created});
                    };

              });
          
                // client recieves 'update chat list' event
          socket.on('update chat list', data => {
              
              // appends onto the <ul id="chat_list">
              document.querySelector('#chatroom_list').innerHTML += `<li> <a href="/chat/${ data.url }"> ${data.chatroom_name} </a></li>`;
              
              // resets the text box and button
              document.querySelector('#chatroom_name').value='';
              document.querySelector('button').disabled=true;

          });
      });
});
