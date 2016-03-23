# San Diego Scrapbook

Then and Now Touchscreen photo scrapbook for the San Diego Natural History Museum's [Coast to
Cactus exhibit](http://www.sdnhm.org/exhibitions/current-exhibitions/coast-to-cactus-in-southern-california/).

## Disclaimer
This code is offered here for example and reference. The compiled application is not intended for public consumption outside of the exhibit. This repository is lacking the media files that make up the full application.

## Technical highlights
The scrapbook is a [Meteor](https://www.meteor.com/) application using [D3](http://d3js.org/) for some presentation elements.

## Installation and setup

    cd meteor
    meteor reset
    meteor

### TODO
Update this old import script, it is no longer valid

    mongoimport -h 127.0.0.1:3001 --db meteor --collection images --type csv --headerline --upsert --file ../data/piction.csv
