#!/bin/bash  

# Check that we are in the project directory then initialize vagrant else create the directory

if [[ "$PWD" == "~/Documents/altschool/myprojects/master-slave-project" ]]; then
  vagrant init ubuntu/focal64
else
  mkdir -p ~/Documents/altschool/myprojects/master-slave-project
  cd ~/Documents/altschool/myprojects/master-slave-project
  vagrant init ubuntu/focal64
fi

# Saving vagrant file in a variabble
data="Vagrantfile"

# Count the number of lines in the vagrant file and store it in a variable
count=$(wc -l < Vagrantfile)

# Delete the last line of the vagrantfile ("End") so that we will be able to edit and run commands in it.

if [ -f "$data" ]; then
    echo "$data exist"
    sed -i '' -e '$ d' Vagrantfile
else  
    echo "$data does not exist" 
    echo "Trying to retrieve data again.."
    vagrant init ubuntu/focal64
fi

# INPUTING CONFIGURATIONS INTO THE VAGRANTFILE

cat <<EOF > Vagrantfile
Vagrant.configure("2") do |config|

  config.vm.define "slave" do |slave|

    slave.vm.hostname = "slave"
    slave.vm.box = "ubuntu/focal64"
    slave.vm.network "private_network", ip: "192.168.56.11"

    slave.vm.provision "shell", inline: <<-SHELL
    sudo apt-get update && sudo apt-get upgrade -y
    sudo apt install sshpass -y
    sudo sed -i 's/PasswordAuthentication no/PasswordAuthentication yes/' /etc/ssh/sshd_config
    sudo systemctl restart sshd
    sudo apt-get install -y avahi-daemon libnss-mdns
    SHELL
  end

  config.vm.define "master" do |master|

    master.vm.hostname = "master"
    master.vm.box = "ubuntu/focal64"
    master.vm.network "private_network", ip: "192.168.56.10"

    master.vm.provision "shell", inline: <<-SHELL
    sudo apt-get update && sudo apt-get upgrade -y
    sudo apt-get install -y avahi-daemon libnss-mdns
    sudo apt install sshpass -y
    sudo sed -i 's/PasswordAuthentication no/PasswordAuthentication yes/' /etc/ssh/sshd_config
    sudo systemctl restart sshd
    SHELL
  end

    config.vm.provider "virtualbox" do |vb|
      vb.memory = "1024"
      vb.cpus = "2"
    end
end
EOF

vagrant up

source lamp.sh