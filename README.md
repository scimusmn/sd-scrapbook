# San Diego Scrapbook

Then and Now Digital Scrapbook for the San Diego Natural History Museum

# To run

    cd meteor
    meteor reset
    meteor
    mongoimport -h 127.0.0.1:3001 --db meteor --collection images --type csv --headerline --upsert --file ../data/piction.csv

