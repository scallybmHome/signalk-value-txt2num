# signalk-value-txt2num
A simple Signalk plugin that remaps txt in the values field a number is a related path.
This is particularly usfull if you want to plot state graphs using Graphana or similar package.

While some plugins andd numerical values automatically, several data ingestion methods do not provide a numeric pairing.

This plugin is an add on to those ingestion methods.
To improve consistency I have adopted the naming schema used by Scott Bender - https://github.com/sbender9?tab=repositories##.

## Example
One of my solar converters populates it's opertional state as text in the SignalK database.

![Data view](https://github.com/scallybmHome/signalk-value-txt2num/blob/main/images/data_view.png)

'Converter 36' populates an operational state of 'off', 'bulk', 'float' and 'error' through my N2K->Ethernet gateway.
This plugin adds an "Path"+Number leaf that contains a numeric representation of the device state.

To configure the plugin 

![Plugin Config](https://github.com/scallybmHome/signalk-value-txt2num/blob/main/images/data_view.png)

Add the path where the test field exists, and a keyword that is contained in the source.

Then enter the text and number pairs.  The text should be an exact match for the reperesentation of the population in the SignalK database.

Submit the changes and you should be good to go.
