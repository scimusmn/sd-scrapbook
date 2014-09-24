#!/bin/sh

rm -rf final.csv

# Get all the sheets into CSVs
echo "Extracting the CSVs"
in2csv --sheet '1-Anza' latest.xlsx > temp-sheet-01-anza.csv;
in2csv --sheet '2-Cleve' latest.xlsx > temp-sheet-02-cleve.csv;
in2csv --sheet '13-SDCst' latest.xlsx > temp-sheet-13-sd-coast.csv;
in2csv --sheet '19-L.A.' latest.xlsx > temp-sheet-19-la.csv;

# Merge all the CSV files into a single file
# Sort on the "other numbers" field, which is the unique ID category
echo "Merging the files"
csvfix file_merge -f 6 temp-sheet-*.csv > temp-merged.csv

echo "Sorting the rows"
csvfix sort -f 6:D,1 temp-merged.csv > temp-sorted.csv
sed -i -e 1,4d temp-sorted.csv

# Remove whitespace
echo "Trimming whitespace"
csvfix trim -t temp-sorted.csv > temp-trimmed.csv
csvfix remove -f 6 -e '^$' temp-trimmed.csv > temp-stripped.csv
cat header.csv temp-stripped.csv >> final.csv
#mv temp-stripped.csv final.csv
rm -rf temp-*
