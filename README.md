# resultdata

## start mqtt

docker run -d -p 1883:1883 -p 9001:9001 eclipse-mosquitto

# WITH LOCAL CONFIG
docker run --name mosquitto -p 1883:1883 --rm -v `pwd`/mosquitto.conf:/mosquitto/config/mosquitto.conf eclipse-mosquitto
# OR
docker run -it -p 1883:1883 --rm -v `pwd`/mosquitto.conf:/mosquitto/config/mosquitto.conf eclipse-mosquitto