# qsog
Qlik Sense Object Grabber (Bookmarklet to get Qlik Sense object IDs).

Either create a bookmark yourself below, or go to https://withdave.github.io/qsog/ and drag the button to your bookmarks bar.


## Purpose
This bookmarklet is designed to be saved into a bookmark on your browser bar, and is a temporary way of allowing easy extraction of Qlik Sense object IDs.


## Use
1. Create a bookmark and paste the following into the address section:
```
javascript:javascript:(function()%7Bfunction callback()%7Bconsole.log("For updates see https%3A%2F%2Fgithub.com%2Fwithdave%2Fqsog")%7Dvar s%3Ddocument.createElement("script")%3Bs.src%3D"https%3A%2F%2Fwithdave.github.io%2Fqsog%2Fqsog.min.js"%3Bif(s.addEventListener)%7Bs.addEventListener("load"%2Ccallback%2Cfalse)%7Delse if(s.readyState)%7Bs.onreadystatechange%3Dcallback%7Ddocument.body.appendChild(s)%3B%7D)()
```

2. Navigate to a Qlik Sense sheet and click the bookmark. Each time you refresh or navigate away you will need to click the button again.
3. qsOG will place a green box containing the object ID in the bottom right of each object, and also log this information to the console.
4. To copy the object ID, click on the text to copy it to the clipboard


## Tested configurations
Qlik Sense
* All 2017 releases
* All 2018 releases
* All 2019 releases up to and including September 2019

Browsers
* Chrome 63
* IE11 (autocopy doesn't always work)

## Updates
* 04/11/2019 - Repointed RawGit to GitHub.io (as the former is shutting down). Added minified script version.

## Known issues
* The DIV I've picked to identify the object sometimes also selects blank space. I need to repoint this to use a different ID or class.

## Resolved issues
* The z-index was increased from 2 to 99999 to counter interactions with the Qlik Sense context menu. This causes overlaps when expanding objects to full screen and was reduced to 2 again. Appears to work correctly when Ctrl+C used to copy the value.
* Problems in versions of IE where the DIVs do not apply the correct styles. Fixed by setting properties differently.

## Notes
* The bookmarklet was generated using an online tool: https://mrcoles.com/bookmarklet/
