# artoratoire

## Development
create a folder named `speech_material` with audio and text

```
npm run dev
```

## Generate `speech_list.json` file

```
[
  {
    "label": "CATEGORY_ONE",
    "value": "CATEGORY_ONE_VALUE",
    "list": [
      {
        "label": "SPEECH_LABEL",
        "file_name": "SPEECH_FILE_NAME", // set SPEECH_FILE_NAME.mp3 and SPEECH_FILE_NAME.txt in speech_material folder
        "lang": "SPEECH_LANGUAGE" // en or fr
      },
      ...
    ]
  },
  {
    "label": "CATEGORY_TWO",
    "value": "CATEGORY_ONE_VALUE",
    "list": [
      ...
    ]
  }
```