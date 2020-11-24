function change_text_color(color) {
    localStorage.setItem('text_color',color);
    };

function toggle_timestamp() {
    if (localStorage.getItem('timestamps') == 'on') {
        localStorage.setItem('timestamps','off');
        document.querySelectorAll('.timestamp').forEach( text => {
            text.style.display = "none";
        });
    }
    else {
            localStorage.setItem('timestamps','on');
            document.querySelectorAll('.timestamp').forEach( text => {
                text.style.display = '';
                });
        };
};

document.addEventListener('DOMContentLoaded', () => {
    
    // sets localStorage['latest_chatroom'] to the chat ID
    const url = document.querySelector('#chat_id').innerText;
    localStorage.setItem('latest_chatroom', url);
    
    // if localStorage['timestamps'] does not exist it initializes it on 'on'
    if (!localStorage.getItem('timestamps')) {
        localStorage.setItem('timestamps','on');
    };
    
    // turns timestamps off if neccesary
    if (localStorage.getItem('timestamps') == 'off') {
        document.querySelectorAll('.timestamp').forEach( text => {
            text.style.display = "none";
        });
    };
    
    // initially sets enter button to disabled
    document.querySelector('#enter').disabled=true;
    
    // activates button after key up and if length is > 0
    document.querySelector('#message_box').onkeyup = () => {
    if (document.querySelector('#message_box').value.length > 0) {
        document.querySelector('#enter').disabled=false;
        }
    else {
        document.querySelector('#enter').disabled=true;
        }
    }

    // makes sure container is scrolled all the way down
    var messageBody = document.querySelector('#messages_container');
    messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;

    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
    
    socket.on('connect', () => {
        
        var input = document.getElementById("message_box")
        
        input.addEventListener("keyup", function(event) {
          // Number 13 is the "Enter" key on the keyboard
          if (KeyboardEvent === 13) {
            // Cancel the default action, if needed
            event.preventDefault();
            // Trigger the button element with a click
            document.getElementById("enter").click();
          }
        });
        
        document.querySelector('#enter').onclick = () => {
            
            // gets values for creator, time_stamp, and content
            const creator = localStorage.getItem('username');
            const time = new Date();
            const content = document.querySelector('#message_box').value;
            const chatroom_url = localStorage.getItem('latest_chatroom');
            const color = localStorage.getItem('text_color') || 'black'
            
            // format the time_stamp nicer
            const time_formatted = '';
            const time_stamp = time_formatted.concat(String(time.getMonth()+1), '/',
                                           String(time.getDay()), '/',
                                           String(time.getFullYear()), ' ',
                                           String(time.getHours()).padStart(2,'0'), ':',
                                           String(time.getMinutes()).padStart(2,'0'), ":",
                                           String(time.getSeconds()).padStart(2,'0')
                                                     );
            
            // emits an event 'new message'
            socket.emit('new message', {
                'creator': creator,
                'time_stamp': time_stamp,
                'content': content,
                'chatroom_url': chatroom_url,
                'color': color
            });
            
            return false
        };
            
    });
        
    socket.on('update message list', data => {
        
            // checks to see if message was for current chatroom
        if (data.url == localStorage.getItem('latest_chatroom')) {
            
            // add in the html
            document.querySelector('#message_list').innerHTML +=
                `<span class="creator-${ data.creator }"><span class="message" style="color: ${ data.color };">${ data.creator }<span class="timestamp"> ${ data.time_stamp }</span>: ${ data.content }</span></span><br>`;
        };
        
        // turns timestamps off if neccesary
        if (localStorage.getItem('timestamps') == 'off') {
            document.querySelectorAll('.timestamp').forEach( text => {
                text.style.display = "none";
            });
        };

            // makes sure container is scrolled all the way down
        var messageBody = document.querySelector('#messages_container');
        messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;

            // checks to see if the length of messages is more than 100
        const x = []
        document.querySelectorAll('.message').forEach(element => {
        x.push(element.innerText);
        });
        
        if (x.length > 100) {
            document.querySelector('.message').remove();
        };
        
        document.querySelector('#message_box').value='';
                   document.querySelector('#enter').disabled=true;
    });
            
});

document.addEventListener('DOMContentLoaded', () => {
        // initially set button to disabled
        document.querySelector('#new_chat').disabled=true;

        // activates button after key up and if length is > 0
        document.querySelector('#chatroom_name').onkeyup = () => {
        if (document.querySelector('#chatroom_name').value.length > 0) {
            document.querySelector('#new_chat').disabled=false;
            }
        else {
            document.querySelector('#new_chat').disabled=true;
            }
        }

      // Connect to websocket
      var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

      // When connected, configure button
      socket.on('connect', () => {

          // button click emits a 'new chatroom' event
          document.querySelectorAll('#new_chat').forEach(button => {
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
              document.querySelector('#chatroom_list').innerHTML += `<span class="chatroom"><a href="/chat/${ data.url }" class="dropdown-item"> ${data.chatroom_name} </a></span>`;

              // resets the text box and button
              document.querySelector('#chatroom_name').value='';
              document.querySelector('#new_chat').disabled=true;

          });
      });
});

