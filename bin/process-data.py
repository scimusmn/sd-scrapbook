#!/usr/bin/env python

from plumbum.cmd import cat, csvfix, in2csv, sed, rm
from blessings import Terminal
import os
import glob
import csv
import re

# Setup the terminal object for blessings
term = Terminal()

# Get setup
data_path = '../data'
database_file_name = 'piction'
print term.bold('Processing data for the Digital Scrapbook')

# Cleanup from last time
print rm('-rf', database_file_name + '.csv')

# Get all the sheets into CSVs
print term.yellow('Extracting the CSVs')

sheets = ['1-Anza', '2-Cleve', '13-SDCst', '19-L.A.', '7-Moj', '12-Bern',
          '3-Color', '4-Imp', '5-Josh', '6-Torr', '8-NorthSD', '9-OC',
          '10-Palo', '11-Salton', '14-SDIn', '15-Gabr', '16-Jac',
          '17-Mon', '18-SoSD', '20-River', '21-Channel']

# Write a CSV for each sheet in the Excel files and save the filepaths
# in an array for merging
# We have to save these to files since it appears that csvfix only takes
# file input.
sheet_csvs = []
for sheet in sheets:
    sheet_csv = str.lower(sheet).replace('.', '') + '.csv'
    temp_sheet = 'temp-sheet-' + sheet_csv
    (in2csv['--sheet', sheet, data_path + os.sep + database_file_name +
            '.xlsx'] > temp_sheet)()
    sheet_csvs.append(os.path.abspath(temp_sheet))

# Merge all the CSV files into a single file
# Sort on the "other numbers" field, which is the unique ID category
print term.yellow('Merging the files')
merge_arguments = ['file_merge', '-f', '6']
merge_arguments.extend(sheet_csvs)
temp_merged = os.path.abspath('temp-merged.csv')
print merge_arguments
(csvfix[merge_arguments] > temp_merged)()

print term.yellow('Sorting the rows')
sort_arguments = ['sort', '-f', '6:D,1', temp_merged]
temp_sorted = os.path.abspath('temp-sorted.csv')
(csvfix[sort_arguments] > temp_sorted)()

print term.red('Removing the header lines')
temp_sorted_no_header = os.path.abspath('temp-sorted-no-header.csv')
(sed['-e', "1," + str(len(sheets) + 1) + "d", temp_sorted] >
 temp_sorted_no_header)()

print term.yellow('Remove whitespace')
temp_trimmed = os.path.abspath('temp-trimmed.csv')
(csvfix['trim', '-t', temp_sorted_no_header] > temp_trimmed)()

# Remove any rows where the primary ID (DS-#####) is not present.
# This cleans up some note rows.
print term.yellow('Removing extra rows')
temp_stripped = os.path.abspath('temp-stripped.csv')
input = open(temp_trimmed, 'rb')
output = open(temp_stripped, 'wb')
writer = csv.writer(output)
for row in csv.reader(input):
    if row:
        if not re.search('^$', row[5]):
            # Limit the ID number to the first 8 char.
            # This removes any in-house identifiers for the ID that the
            # client might add.
            row[5] = row[5][:8]
            writer.writerow(row)
input.close()
output.close()

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
# csvfix edit -e 's/^$/ /g' temp-stripped.csv > temp-dashed.csv

# Split the lat,long column into two columns
# We want to store this as separate fields in the data base.
print term.yellow('Splitting out latitude and longitude')
temp_latlong = os.path.abspath('temp-latlong.csv')
(csvfix['split_char', '-f', '12', '-c', ',', temp_dashless] > temp_latlong)()

# Parse the data uncertainties into ISO dates
print term.blue('Fixing dates')
temp_dates = os.path.abspath('temp-dates.csv')
input = open(temp_latlong, 'rb')
output = open(temp_dates, 'wb')
writer = csv.writer(output)
for row in csv.reader(input):
    if row:
        date_string = row[8]

        parts = date_string.split('-')

        year = parts[0]

        # Year only
        if len(parts) == 1:
            # Remove circa
            if year.startswith('ca. '):
                year = year[4:]
            date_string = year
            iso_date = str(str(year) + '-00-00')

        # If the month is present, process it
        if len(parts) == 2 or len(parts) == 3:
            month = parts[1]
            stringDic = {
                "Jan": "January",
                "Feb": "February",
                "Mar": "March",
                "Apr": "April",
                "May": "May",
                "Jun": "June",
                "Jul": "July",
                "Aug": "August",
                "Sep": "September",
                "Oct": "October",
                "Nov": "November",
                "Dec": "December",
            }
            for i, j in stringDic.iteritems():
                month = month.replace(i, j)
            date_string = month + ' ' + year

            if month == 'January':
                iso_month = '01'

            if month == 'February':
                iso_month = '02'

            if month == 'March':
                iso_month = '03'

            if month == 'April':
                iso_month = '04'

            if month == 'May':
                iso_month = '05'

            if month == 'June':
                iso_month = '06'

            if month == 'July':
                iso_month = '07'

            if month == 'August':
                iso_month = '08'

            if month == 'September':
                iso_month = '09'

            if month == 'October':
                iso_month = '10'

            if month == 'November':
                iso_month = '11'

            if month == 'December':
                iso_month = '12'

            iso_date = str(str(year) + '-' + iso_month + '-00')

        if len(parts) == 3:
            day = parts[2]
            date_string = month + ' ' + day + ', ' + year
            iso_date = str(str(year) + '-' + iso_month + '-' + day)

        # Average the year if a range (e.g. 1969/1980)
        if re.search('/', year):
            range = year.split('/')
            yearlist = [float(x) for x in range]
            year = int(sum(yearlist) / float(len(range)))
            iso_date = str(str(year) + '-00-00')
            date_string = ('Between ' + str(int(yearlist[0])) + ' and ' +
                           str(int(yearlist[1])))

        # row.insert(8, str(str(year) + '-' + str(month) + '-' + str(day)))
        row.insert(8, "date-" + date_string)

        row.insert(9, "iso-" + iso_date)

        writer.writerow(row)
input.close()
output.close()

# Add the Piction data header
print term.yellow('Adding a header row')
piction_header = os.path.abspath(data_path + os.sep + 'piction_header.csv')
temp_header = os.path.abspath('temp-header.csv')
(cat[piction_header, temp_dates] >> temp_header)()

# Remove any columns outside our header scope
print term.yellow('Removing extra columns')
temp_scope = os.path.abspath('temp-scope.csv')
(csvfix['order', '-f', '1:41', temp_header] > temp_scope)()

# Build a dimensions file
dimensions = os.path.abspath(data_path + os.sep + 'dimensions.csv')
dimensions_header = os.path.abspath(
    data_path + os.sep + 'dimensions_header.csv')
temp_dimensions = os.path.abspath('temp-dimensions.csv')
(cat[dimensions_header, dimensions] > temp_dimensions)()

print term.yellow('Adding dimensions to piction file')
piction = os.path.abspath(data_path + os.sep + database_file_name + '.csv')
(csvfix['join', '-f', '6:1', temp_scope, temp_dimensions] > piction)()

# Cleanup all our temp files
cwd = os.path.dirname(os.path.abspath(__file__))
for fl in glob.glob(cwd + '/temp-*'):
    os.remove(fl)

# This final step is manual and is only documented here for reference.
# Once you've created this big CSV of all the images we need to add the image
# dimension data into the table. We use imagemagick to do this, and then
# merge the csv into the file with new headers
#
# Create the image dimension sheet
# identify -format "%t,%w,%h,%[fx:w/h]\n" *.jpg > dimensions.csv
#
# Merge the dimensions.csv into the piction.csv
