#!/bin/bash

# INSTALLATION OF LAMP STACK IN THE MASTER MACHINE AND ADDING FIREWALL RULES AND PERMISSIONS

sudo apt update -y

sudo apt install apache2 -y

sudo ufw allow in "Apache"

sudo ufw status

sudo apt install mysql-server -y

sudo chown -R www-data:www-data /var/www

sudo add-apt-repository -y ppa:ondrej/php
sudo apt-get update
sudo apt-get install libapache2-mod-php php php-common php-xml php-mysql php-gd php-mbstring php-tokenizer php-json php-bcmath php-curl php-zip unzip -y

sudo systemctl restart apache2

# INSTALLING COMPOSER THAT MANAGES THE DEPENDENCIES AND LIBRARIES THAT PHP APPLICATIONS REQUIRE

sudo curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer

# CONFIGURING APACHE TO HOST OUR LARAVEL APPLICATION

sudo touch /etc/apache2/sites-available/laravel.conf

sudo bash -c "cat > /etc/apache2/sites-available/laravel.conf" <<EOT 
<VirtualHost *:80>
    ServerAdmin muhammadbaye@gmail.com
    ServerName laravel.example.com
    DocumentRoot /var/www/html/laravel/laravel/public

    <Directory /var/www/html/laravel/laravel>
    Options Indexes MultiViews FollowSymLinks
    AllowOverride All
    Require all granted
    </Directory>

    ErrorLog ${APACHE_LOG_DIR}/error.log
    CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
EOT

# ENABLING MODULES

sudo a2dissite 000-default.conf
sudo a2enmod rewrite
sudo a2ensite laravel.conf
sudo systemctl restart apache2

# CLONING/INSTALLING LARAVEL APPLICATION AND DEPENDENCIES

sudo mkdir /var/www/html/laravel && cd /var/www/html/laravel
sudo git clone https://github.com/laravel/laravel.git

cd /var/www/html/laravel/laravel && sudo composer install --no-dev --no-interaction

# SETTING LARAVEL PERMISSIONS DOING SOME CONFIGURATIONS

sudo chown -R www-data:www-data /var/www/html/laravel/laravel

sudo chmod -R 775 /var/www/html/laravel/laravel

sudo chmod -R 775 /var/www/html/laravel/laravel/storage

sudo chmod -R 775 /var/www/html/laravel/laravel/bootstrap/cache

cd /var/www/html/laravel/laravel && sudo cp .env.example .env

cd /var/www/html/laravel/laravel && php artisan key:generate --no-interaction

# CREATING MYSQL USER AND DATABASE FOR LARAVEL APPLICATION

password=$2
if [[ -z "$2" ]]; then
  password=`openssl rand -base64 8`
fi

sudo mysql -u root <<CDE
CREATE DATABASE $1;
CREATE USER '$1'@'127.0.0.1' IDENTIFIED WITH mysql_native_password BY '$password';
GRANT ALL PRIVILEGES ON $1.* TO '$1'@'127.0.0.1';
FLUSH PRIVILEGES;
exit
CDE

# RESTARTING APACHE2 AND MYSQL

sudo systemctl restart mysql
sudo systemctl restart apache2

# EDITING THE APPLICATION'S ENVIRONMENT VARIABLES

sudo bash -c "cat > .env" <<FGH
APP_NAME=Laravel
APP_ENV=production
APP_KEY=base64:kGKg6DnMqMGBJrLGDh4Jg+bTIXqcVXZKqJdqueTlkCk=
APP_DEBUG=false
APP_URL=http://192.168.56.21

LOG_CHANNEL=stack
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=debug

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE="$1"
DB_USERNAME="$1"
DB_PASSWORD="$2"

BROADCAST_DRIVER=log
CACHE_DRIVER=file
FILESYSTEM_DISK=local
QUEUE_CONNECTION=sync
SESSION_DRIVER=file
SESSION_LIFETIME=120

MEMCACHED_HOST=127.0.0.1

REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_MAILER=smtp
MAIL_HOST=mailpit
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="hello@example.com"
MAIL_FROM_NAME="${APP_NAME}"

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=
AWS_USE_PATH_STYLE_ENDPOINT=false

PUSHER_APP_ID=
PUSHER_APP_KEY=
PUSHER_APP_SECRET=
PUSHER_HOST=
PUSHER_PORT=443
PUSHER_SCHEME=https
PUSHER_APP_CLUSTER=mt1

VITE_APP_NAME="${APP_NAME}"
VITE_PUSHER_APP_KEY="${PUSHER_APP_KEY}"
VITE_PUSHER_HOST="${PUSHER_HOST}"
VITE_PUSHER_PORT="${PUSHER_PORT}"
VITE_PUSHER_SCHEME="${PUSHER_SCHEME}"
VITE_PUSHER_APP_CLUSTER="${PUSHER_APP_CLUSTER}"
FGH

# ADDING THE VIRTUAL HOST TO THE HOSTS CONFIGURATION FILE

sudo bash -c "cat >> /etc/hosts" <<ABC 
192.168.56.21 laravel.example.com
ABC