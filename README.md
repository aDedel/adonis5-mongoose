# Install Mongoose Provider in Adonis

## Install dependency

```bash
npm i @dedel.alex/adonis5-mongoose
```

## RUN COMMAND

```bash
node ace configure @dedel.alex/adonis5-mongoose
```

## Generate model

```bash
node ace mongoose:model Test
```

### Configure MongoDb

```bash
# MongoDb URI
MONGODB_URI=mongodb://127.0.0.1:27017/mydb

# Mongoose connection options
MONGODB_OPTIONS="{}"

# Use mongoose default connection?
MONGODB_CREATE_NEW_CONNECT=false
```

# Github project

https://github.com/aDedel/adonis-mongoose
