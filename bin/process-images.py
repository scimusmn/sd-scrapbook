#!/usr/bin/env python

from plumbum import local
from plumbum.cmd import csvfix, identify, mogrify
from blessings import Terminal
import os
import glob

"""Create thumbnails and resized max images for all the existing photos
"""

# Setup the terminal object for blessings
term = Terminal()

data_path = os.path.abspath('../data')
photos_path = data_path + os.sep + 'photos'

"""
Create thumbnail images for the map view
"""
print term.green('Creating thumbnails')
mogrify_thumbnail_arguments = [

    # SD is producing JPGs source material, so we'll create JPG thumbnails too
    '-format', 'jpg',

    # Output directory
    '-path', photos_path + os.sep + 'processed-latest/thumbnails',

    # Thumbnail size
    '-thumbnail', '300x300',

    # Input directory
    photos_path + os.sep + 'source-latest/*.jpg',

]
(mogrify[mogrify_thumbnail_arguments])()

"""
Create expanded images

Some of the pictures are really huge, so we need to skrink them for
display, even when we want visitors to be able to see them full screen
"""
print term.green('Creating expanded images')
mogrify_expanded_arguments = [
    # SD is producing JPGs source material, so we'll create JPG thumbnails too
    '-format', 'jpg',

    # Output directory
    '-path', photos_path + os.sep + 'processed-latest/expanded',

    # Thumbnail size
    '-thumbnail', '1000x800',

    # Input directory
    photos_path + os.sep + 'source-latest/*.jpg',
]
(mogrify[mogrify_expanded_arguments])()

"""
Write image dimensions to a csv to make it quicker to load them into
the final application.

We write this into the MongoDB database so that we don't need to examine
each file on load
"""
print term.blue('Creating dimensions.csv')
identify_thumbnail_arguments = [
    # Write the filename (without extension, which matches the _id in Mongo),
    # width, height, and the aspect ratio for each image
    '-format', '%t,%w,%h,%[fx:w/h]\n',
    # Output
    photos_path + os.sep + 'processed-latest/thumbnails/*.jpg'
]
temp_thumb_dimensions = data_path + os.sep + 'temp-thumbnail-dimensions.csv'
(identify[identify_thumbnail_arguments] > temp_thumb_dimensions)()
identify_expanded_arguments = [
    # Write the filename (without extension, which matches the _id in Mongo),
    # width, height, and the aspect ratio for each image
    '-format', '%t,%w,%h,%[fx:w/h]\n',
    # Output
    photos_path + os.sep + 'processed-latest/expanded/*.jpg'
]
temp_expanded_dimensions = data_path + os.sep + 'temp-expanded-dimensions.csv'
(identify[identify_expanded_arguments] > temp_expanded_dimensions)()

# Merge the two dimension files together
(csvfix['join', '-f', '1:1', temp_thumb_dimensions, temp_expanded_dimensions] > data_path + os.sep + 'dimensions.csv')()

# Cleanup all of our temp files
cwd = os.path.abspath(data_path)
for fl in glob.glob(cwd + os.sep + 'temp-*'):
    os.remove(fl)
