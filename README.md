# Project 2
This is a Python Flask app that allows users to pick a username - create a Chatroom, and then chat with other user using a Web Socket, specifically flask_socketio.

# Contents

|- application.py
|- requirements.txt
|- static
|----- index.js
|----- chat.js
|----- room.js
|----- style_sheet.scss
|----- style_sheet.css
|----- style_sheet.css.map
|----- favicon.png
|----- logo_transparent.png
|- templates
|----- index.html
|----- layout.html
|----- room-v2.html
|----- chat.html


# Personal Touch

For my personal touch I added two features that I believe improve ease of use and design.  

First is a "Toggle Timestamps" button in the bottom right corner, allowing the user to choose to view the timestamp for each chat or not.  In addition it sets a variable in localStorage['timestamps'] to either 'yes' or 'no' so the browser will remember the setting.

Second I added a dropdown menu for the user to choose their font color in the chat.  It updates their localStorage['color'] setting as well so they will stay that color unless they choose otherwise. 
Each message sent has a .color attribute that allows all users to see the proper color.  It does not however retroactively update the colors of the previous messages - since only the last 100 messages are stored anyway I thought this to not be a huge concern.

# application.py

This is the main python application of the web app.  To run in debug mode, use the bash command:

        python3 application.py
        
as this activates the if statement at the bottom of the code:

        if __name__ == 'main':
            app.run(debug=True)
            
# requirements.txt

A text file containing the required libraries.


# static/index.js

The javascript file for the index page of the website, only really used when localStorage['username'] is not already set.

# static/chat.js

The javascript file for the chat page that allows users to make a new chatroom and view existing chats.  Only really seen when localStorage['latest_chatroom'] is not set.

# static/room-v2.js

The bulk javascript file for the application, for the room-v2.html page. 

# static/style_sheet.scss

A sass file used to generate style_sheet.css

# static/style_sheet.css

The main .css style sheet for the whole applicaton.

# static/style_sheet.css.map

Meta data for the .scss file.

# static/favicon.png + static/logo_transparent.png

Images used in the website.

# templates/index.html

The html file for the index page of the website, only really seen when localStorage['username'] is not already set.

# templates/chat.html

The html file for the chat page that allows users to make a new chatroom and view existing chats.  Only really seen when localStorage['latest_chatroom'] is not set.

# templates/room-v2.html

HTML for the 'room()' function.

# templates/layout.html

Layout page that extends the other html pages.  Contains links to bootstrap styling and JS.
