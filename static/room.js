document.addEventListener('DOMContentLoaded', () => {
    
    // sets localStorage['latest_chatroom'] to the chat ID
    const url = document.querySelector('#chat_id').innerText;
    localStorage.setItem('latest_chatroom', url);
    
    // initially set button to disabled
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

    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
    
    socket.on('connect', () => {
        
        document.querySelector('#new_message').onsubmit = () => {
            
            // gets values for creator, time_stamp, and content
            const creator = localStorage.getItem('username');
            const time_stamp = new Date();
            const content = document.querySelector('#message_box').value;
            const chatroom_url = localStorage.getItem('latest_chatroom');
            
            // emits an event 'new message'
            socket.emit('new message', {
                'creator': creator,
                'time_stamp': time_stamp,
                'content': content,
                'chatroom_url': chatroom_url});
            
            return false
        };
            
    });
    
    socket.on('update message list', data => {
        document.querySelector('#message_list').innerHTML += `<li>${ data.creator } ${ data.time_stamp }:${ data.content }</li>`;
        
        document.querySelector('#message_box').value='';
                   document.querySelector('#enter').disabled=true;
    });
            
});


