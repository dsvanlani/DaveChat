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

    // makes sure container is scrolled all the way down
    var messageBody = document.querySelector('#messages_container');
    messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;

    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
    
    socket.on('connect', () => {
        
        document.querySelector('#new_message').onsubmit = () => {
            
            // gets values for creator, time_stamp, and content
            const creator = localStorage.getItem('username');
            const time = new Date();
            const content = document.querySelector('#message_box').value;
            const chatroom_url = localStorage.getItem('latest_chatroom');
            
            // format the time_stamp nicer
            const time_formatted = '';
            const time_stamp = time_formatted.concat(String(time.getMonth()+1), '/',
                                           String(time.getDay()), '/',
                                           String(time.getFullYear()), ' ',
                                           String(time.getHours()), ':',
                                           String(time.getMinutes()), ":",
                                           String(time.getSeconds())
                                                     );
            
            // emits an event 'new message'
            socket.emit('new message', {
                'creator': creator,
                'time_stamp': time_stamp,
                'content': content,
                'chatroom_url': chatroom_url});
            
            return false
        };
            
    });
            // adds new message to the list
    socket.on('update message list', data => {
        document.querySelector('#message_list').innerHTML += `<span class="message">${ data.creator } ${ data.time_stamp }: ${ data.content }</span><br>`;

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


