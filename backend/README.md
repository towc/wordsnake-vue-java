# backend
REST api for word snake using [java-spark](http://sparkjava.com/)

# configuration
All important values are hardcoded, under `src/main/java/Config.java`

I decided that reading from a file/env was trivial and not something I should spend too much time on

| name | default | description |
| --- | --- | --- |
| dictionaryLocation | /etc/dictionaries-common/words | line-separated word storage |
| port | 5000 | api server port |
| defaultCount | 5 | default number of words returned |
| defaultMinSize | 4 | default length of shortest word to be returned |
| defaultMaxSize | 8 | default length of longest word to be returned |
| noiseRatio | 0.1 | max amount of noise characters to normal response characters (twice expected amount) |
| noiseChars | `.-~:+!#()` | characters to be inserted as noise |

# endpoints
specifying count and range:

```
/api/words/
/api/words/count/:count
/api/words/count/:count/range/:min/:max
/api/words/range/:min/:max
```

specifying every length (count implied):
```
/api/words/by-length/:lengths
```
where `lengths` is a comma-separated list of integers

# running
entrypoint is src/main/java/Application.java

make sure maven is set up correctly

# notes
The server never checks for bad input. If something doesn't add up, internal errors happen and you get a 500

With this API, nothing bad can come from that, other than a less than great user experience

The errors usually come from `NullPointerException`s when trying to find the last character of a word that couldn't be produced, which is somewhat convenient because it handles most cases of bad inputs:
- min > max
- count > 1, min > length of largest word in dictionary
- some lengths are < 0

Because of some assumptions, it doesn't catch all bad input
- count < 0

And there's one case in which 500 is not due to bad input, and that's when the length is exclusively 3, count > 1, and you have some bad luck: there's some words of length 3 that end in X, but none that begin in X, so null is returned and you get the exception

I didn't think it was overly important to focus on comments/docs/tests for the backend part of the assignment, or setting up a proper docker environment
