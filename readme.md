# Doc Generator

This project is meant to render templates, compose documents and output generated content as is or pdf.

## Structure

1. Template render
    - ejs implemented with async option enabled by default
2. Template composition
    - the base structure expected makes possible to organize templates orderly and recursively

## Templates

To make the best use of this you can find the base entities structure at /test/entities.
They are not mandatory, but the template config structure is (you can only change field names)

Template Config sample

```
    {
        "config": {},
        "template": {
            "defaultConfig": {
                "outputType": "PDF"
            }
        },
        "templateContents": [
            {
                "name": "",
                "config": {
                    "order": 0,
                    "type": "HTML",
                    "ejsConfig": {}
                },
                "options": {
                    "subtitle": "test"
                },
                "content": "<h1>HTML <%=title%> - <%=options.subtitle%></h1>"
            },
            ...
        ]
    }
```

## Rendering

To start rendering templates follow the example below

```
    // minimal and mandatory configuration below
    const builderConfig: DeepPartial<DomainOptions> = {
        templateConfig
    };
    const renderingData = {
        // data used into templates
    };

    const builder = new DocGeneratorBuilder();
    const { path } = await builder.generate(
        builderConfig,
        renderingData
    );
```

"builderConfig" can receive many customizations like:
    - file.dirPath: directory to store the file (or file.generate.dirPath specifically for rendering)
    - file.fileSystem: instance used to store content into a file
        - fileSystem is an instance of brunnofoggia/cloud-solutions storage, a lib that allows you to connect to different
          storages like aws.s3 gcp.storage or local.storage
    - file.name: template (lodash/template) of filename

* any of these configurations can be set specifically for generate or output as shown below:

```
    {
        file: {
            generate: {
                dirPath,
                name,
                fileSystem
            },
            output: {
                dirPath,
                name,
                fileSystem
            }
        }
    }
```

## Converting rendered content

* For now only pdf convertion is available
Looking at template config sample you see "outputType" set as "PDF" (it can be set into templateConfig.config or templateConfig.template.defaultConfig)
Using the same configuration of previous example you can have a pdf as an output just changing the "generate" method for "generateAndOutput" as the code shown below:

```
    const { path } = await builder.generateAndOutput(
        builderConfig,
        renderingData
    );
```

Also if you need just to convert a html you already have, you can use pdf class directly. See the example below:

```
    import { PDFOptions } from 'puppeteer';
    import { PdfGenerator } from 'doc-generator/lib/outputs/pdf';

    const pdfConfig: DeepPartial<PDFOptions> = {}; // look into puppeteer docs
    const pdfGenerator = new PdfGenerator();
    const { path } = await pdfGenerator.generate({
        fileSystem,
        path,
        content,
        config: pdfConfig
    });
```