#!/usr/bin/env python

from plumbum import local
from plumbum.cmd import cat, csvfix, in2csv, ls, sed, rm
from blessings import Terminal
import os
import glob

# Setup the terminal object for blessings
term = Terminal()

# Get setup
database_file_name = 'piction'
print term.bold('Processing data for the Digital Scrapbook')

# Cleanup from last time
print rm('-rf', database_file_name + '.csv')

# Get all the sheets into CSVs
print term.yellow('Extracting the CSVs')

sheets = [ '1-Anza', '2-Cleve', '13-SDCst', '19-L.A.']

# Write a CSV for each sheet in the Excel files and save the filepaths
# in an array for merging
# We have to save these to files since it appears that csvfix only takes
# file input.
sheet_csvs = []
for sheet in sheets:
    sheet_csv = str.lower(sheet).replace('.', '') + '.csv'
    temp_sheet = 'temp-sheet-' + sheet_csv
    (in2csv['--sheet', sheet, database_file_name + '.xlsx'] > temp_sheet)()
    sheet_csvs.append(os.path.abspath(temp_sheet))

# Merge all the CSV files into a single file
# Sort on the "other numbers" field, which is the unique ID category
print term.yellow('Merging the files')
merge_arguments = ['file_merge', '-f', '6']
merge_arguments.extend(sheet_csvs)
temp_merged = os.path.abspath('temp-merged.csv')
(csvfix[merge_arguments] > temp_merged)()

print term.yellow('Sorting the rows')
sort_arguments = ['sort', '-f', '6:D,1', temp_merged]
temp_sorted = os.path.abspath('temp-sorted.csv')
(csvfix[sort_arguments] > temp_sorted)()
print term.red('Removing the header lines')
temp_sorted_no_header = os.path.abspath('temp-sorted-no-header.csv')
(sed['-e', "1,4d", temp_sorted] > temp_sorted_no_header)()

print term.yellow('Remove whitespace')
temp_trimmed = os.path.abspath('temp-trimmed.csv')
(csvfix['trim', '-t', temp_sorted_no_header] > temp_trimmed)()

# Remove any rows where the primary ID is not present.
# This cleans up some note rows.
print term.yellow('Removing extra rows')
temp_stripped = os.path.abspath('temp-stripped.csv')
(csvfix['remove','-f', '6', '-e', "'^$'", temp_trimmed] > temp_stripped)()

# Make our primary ID lower with no dash or underscore
print term.yellow('Removing chracters from the ID')
temp_lower = os.path.abspath('temp-lower.csv')
(csvfix['lower', '-f', '6', temp_stripped] > temp_lower)()
temp_dashless = os.path.abspath('temp-dashless.csv')
(csvfix['edit', '-f', '6', '-e', 's/[-,_]//g', temp_lower] > temp_dashless)()

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
print term.yellow('Splitting out latitude and longitude')
temp_latlong = os.path.abspath('temp-latlong.csv')
(csvfix['split_char', '-f', '12', '-c', ',', temp_dashless] > temp_latlong)()

# Add the Piction data header
print term.yellow('Adding a header row')
piction_header  = os.path.abspath('piction_header.csv')
temp_header  = os.path.abspath('temp-header.csv')
(cat[piction_header, temp_latlong] >> temp_header)()

# Remove any columns outside our header scope
print term.yellow('Removing extra columns')
final  = os.path.abspath('final.csv')
(csvfix['order', '-f', '1:41', temp_header] > final)()

# Cleanup all our temp files
cwd = os.path.dirname(os.path.abspath(__file__))
for fl in glob.glob(cwd + '/temp-*'):
    os.remove(fl)

## This final step is manual and is only documented here for reference.
## Once you've created this big CSV of all the images we need to add the image
## dimension data into the table. We use imagemagick to do this, and then
## merge the csv into the file with new headers
##
## Create the image dimension sheet
## identify -format "%t,%w,%h,%[fx:w/h]\n" *.jpg > dimensions.csv
##
## Merge the dimensions.csv into the final.csv
