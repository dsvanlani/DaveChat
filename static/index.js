document.addEventListener('DOMContentLoaded', () => {

                  document.querySelector('#pick_username').onsubmit = () => {

                                // sets username variable to the value in the box
                               let username = document.querySelector('#username').value;
                               localStorage.setItem('username', username);
                               };

                  });

// Redirects the page to /chat if localStorage['username'] is set
document.addEventListener('DOMContentLoaded', () => {
                  if (localStorage.getItem('username')) {
                  window.location.href='/chat';
                          }
                  });

