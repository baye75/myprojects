# Create a User with a username of MuhammadJamiuAtta with an expiry date of two weeks from the date of creation
Use the useradd command to create the user, by running the command: sudo useradd MuhammadJamiuAtta -e 2023-09-01
Create a password for the user by running the command: sudo passwd MuhammadJmaiuAtta
## Prompt the User to change their password on login
Use the passwd command to prompt the user to change their password on login by forcing the current password to expire; by running the command: sudo passwd -e MuhammadJamiuAtta
### Add the User to a Group called altschool
First we have to create the altschool group with the command: sudo groupadd altschool
Then we set password for the group using the command: sudo gpasswd altschool
Now, we add the user to the altschool group using the command: sudo usermod -a -G altschool MuhammadJamiuAtta
### Allow altschool group to be able to run only cat command on /etc/
To do this, we add the altschool group to the sudoers file and put in the required access. 
To be able to open and edit the sudoers file, we must be logged in as root. To log in as root, we run the command: sudo -s
Now, we open the sudoers file by running the command: visudo
In the sudoers file, we add the following access for the altschool group: %altschool ALL=(ALL:ALL) /etc/cat
#### Create another user. Make sure that this user doesn't have a home directory
To create a user say MuhammadJamiu that doesn't have a home directory, we use the command: sudo useradd --no-create-home MuhammadJamiu
Set a password for this new user with the command: sudo passwd MuhammadJamiu
###### Attached below are the screenshots taken during the 
![Alt text](Screenshot%20(19).png)
![Alt text](Screenshot%20(20).png)
![Alt text](Screenshot%20(21).png)
![Alt text](Screenshot%20(22).png)
![Alt text](Screenshot%20(23).png)
![Alt text](Screenshot%20(24).png)
![Alt text](Screenshot%20(25).png)
![Alt text](Screenshot%20(26).png)
![Alt text](Screenshot%20(27).png)