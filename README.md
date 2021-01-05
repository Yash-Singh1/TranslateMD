# `TranslateMD`

Simple API that takes markdown as an input and returns HTML in a different language as an output.

## About

`TranslateMD` is an API that will take markdown, `gfm` or `common` and take a language, returning HTML with the text translated into the specified language.

## Languages

Languages are specified when calling the API. They tell the API what language to translate the text to. For a list of available languages, go to [https://api.cognitive.microsofttranslator.com/languages?api-version=3.0](https://api.cognitive.microsofttranslator.com/languages?api-version=3.0). The languages are underneath the `translation` section.

## API Documentation

### Request Types

Request types:

- `url` requests
- `raw` requests

`url` requests are given when raw markdown is not passed. It takes in a `url` that will be requested by the API and the API will use the contents of that `url` to process. In the scenario of a `raw` request, raw markdown is passed in.

In the case of a `url` request, the request URL is: [https://translatemd.herokuapp.com/url](https://translatemd.herokuapp.com/url)

In the case of a `raw` request, the request URL is: [https://translatemd.herokuapp.com/raw](https://translatemd.herokuapp.com/raw)

### Headers

No Headers are necessary, `TranslateMD` assumes the query to be a flavor of markdown. However, there is an option called `mode` inside the body to define whether it is `plain markdown` or `gfm`.

### Query Parameters

`TranslateMD` does not accept query parameters, all parameters are passed into the body (plans for query parameters are in a future version)

### Body

The body must be in a JSON format
Here is the format for the body:

```json5
{
  "text": String // The text is required on raw requests, it is the raw markdown
  "url": String // The URL is required on url requests
  "lang": String // This is the language to translate to, refer to the languages section
  "mode": String // This is the mode of the input. It can be markdown or GFM
  "key": String // Your Microsoft Translator API Key to Translate the Markdown
  "context": String // The repository referred, used in GFM only
}
```

### Verbs

The request must be of type `POST`, any other requests will be given a status code of `400`.

### Request Validation

The following scenarios will result in a `400` error code as a response:

- Non-POST requests
- Invalid Language Codes
- An invalid mode is provided
- No key is provided
- No language is provided

## Github Flavored Markdown (GFM)

Github Flavored Markdown is a flavor of markdown written by Github. It allows you to write rich text. For more information go to: [https://github.github.com/gfm/](https://github.github.com/gfm/). That is the official documentation of Github Flavored Markdown.

## Development

To start up the development environment:

```bash
git clone https://github.com/Yash-Singh1/TranslateMD.git
cd TranslateMD/
npm install
npm run start
```

Now you can call the API on `localhost:5000`. The process works exactly the same in the development environment.

## Contributing

Contributions are welcome!
