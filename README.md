# qsog
Qlik Sense Object ID Grabber (Bookmarklet)


## Purpose
This bookmarklet is designed to be saved into a bookmark on your browser bar, and is a temporary way of allowing easy extraction of Qlik Sense object IDs.

## Use
1. Create a bookmark and paste the following into the address section:
```
javascript:(function()%7Bfunction%20callback()%7Bconsole.log(%22For%20updates%20see%20https%3A%2F%2Fgithub.com%2Fwithdave%2Fqsog%22)%7Dvar%20s%3Ddocument.createElement(%22script%22)%3Bs.src%3D%22https%3A%2F%2Fcdn.rawgit.com%2Fwithdave%2Fqsog%2Fmaster%2Fqsog.js%22%3Bif(s.addEventListener)%7Bs.addEventListener(%22load%22%2Ccallback%2Cfalse)%7Delse%20if(s.readyState)%7Bs.onreadystatechange%3Dcallback%7Ddocument.body.appendChild(s)%3B%7D)()
```

2. Navigate to a Qlik Sense sheet and click the bookmark. Each time you refresh or navigate away you will need to click the button again.

## Tested configurations
Qlik Sense
* June 2017
* September 2017
* November 2017

Browsers
* Chrome 63

## Known issues
* The DIV I've picked to identify the object sometimes also selects blank space. I need to repoint this to use a different ID or class.

## Notes
* The bookmarklet was generated using an online tool: https://mrcoles.com/bookmarklet/
* RawGit is used to link to the files: https://rawgit.com/
