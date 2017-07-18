# DLVR (ALPHA) 
[![Known Vulnerabilities](https://snyk.io/test/github/freakzero/dlvr/badge.svg)](https://snyk.io/test/github/freakzero/dlvr)
[![npm version](https://badge.fury.io/js/dlvr.svg)](https://badge.fury.io/js/dlvr)
[![Build Status](https://travis-ci.org/FreaKzero/dlvr.svg?branch=master)](https://travis-ci.org/FreaKzero/dlvr)  

*(Until real release use at your own risk, fallback from failure is not yet implemented)*

[![asciicast](https://asciinema.org/a/ZCItj9lqc7Y7mjRGdEFCCSxle.png)](https://asciinema.org/a/ZCItj9lqc7Y7mjRGdEFCCSxle)

Command Line tool for easy automated Releasing. See the ASCII cast.

Config (.dlvr):
```
{
  "snyk": {
    "token": "YOUR API TOKEN"
  },
  "compress": [
    {"in": "./dist/test.txt", "out": "./dist/test.zip"},
    {"in": "./dist/test2.txt", "out": "./dist/test2.zip"}
  ],
  "github": {
    "token": "YOUR API TOKEN",
    "repo": "username/repo",
    "release": {
      "assets": [{
        "file": "./dist/test.zip",
        "name": "test.zip"
      },{
        "file": "./dist/test2.zip",
        "name": "test2.zip"
      }],
      "draft":true
    }
  },
  "test":"npm run test",
  "npmpublish": false
}

```
