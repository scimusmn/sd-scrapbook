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

# Remove any rows where the primary ID is not present.
# This cleans up some note rows.
echo "Removing extra rows"
csvfix remove -f 6 -e '^$' temp-trimmed.csv > temp-stripped.csv

# Make our primary ID lower with no dash or underscore
echo "Removing chracters from the ID"
csvfix lower -f 6 temp-stripped.csv > temp-lower.csv
csvfix edit -f 6 -e 's/[-,_]//g' temp-lower.csv > temp-dashless.csv

# Change empty cells to a dash '-'
# This makes it a bit easier to SEE in Excel.
# I might remove this in production.
# This should work but is producing an error.
#
#    ERROR: Character value 194 too big
#
# So I'm leaving it out for now.
#csvfix edit -e 's/^$/ /g' temp-stripped.csv > temp-dashed.csv

# Split the lat,long column into two columns
# We want to store this as separate fields in the data base.
echo "Splitting out latitude and longitude"
csvfix split_char -f 12 -c ',' temp-dashless.csv > temp-latlong.csv

# Add the header
echo "Adding a header row"
cat header.csv temp-latlong.csv >> temp-header.csv

# Remove any columns outside our header scope
echo "Removing extra columns"
csvfix order -f 1:41 temp-header.csv > final.csv

rm -rf temp-*
