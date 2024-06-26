
# @qshift/quarkus-plugins

This project contains different [Backstage](https://backstage.io/) plugins to work with [Quarkus](https://quarkus.io/) which is a Kubernetes-native Java framework tailored for GraalVM and HotSpot, crafted from best-of-breed Java libraries and standards.

## Prerequisites

- [Node.js](https://nodejs.org/en) (18 or 20)
- [nvm](https://github.com/nvm-sh/nvm), npm and [yarn 4.x](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable) installed

## Getting started

To play with one of our plugins, create first a [Backstage](https://backstage.io/docs/getting-started/) application locally using this command:
```
npx @backstage/create-app@latest
```

Next, verify if the newly application created is working fine: `yarn dev`

If this is the case, you can start to play with one or all our plugins :-)

## Quarkus Console

Before to use the quarkus console, it is needed to install and configure the kubernetes plugin as [documented](https://backstage.io/docs/features/kubernetes/installation).

Import first the following package within an existing backstage application:
```bash
yarn add --cwd packages/app "@qshift/plugin-quarkus-console"
```
Next, customize the `packages/app/src/components/catalog/EntityPage.tsx` to include a new `<EntityLayout.Route...>`:
```typescript jsx
import {
    QuarkusPage,
} from "@qshift/plugin-quarkus-console";
...
const serviceEntityPage = (
  <EntityLayout>
  ...
    <EntityLayout.Route path="/quarkus" title="Quarkus">
      <QuarkusPage />
    </EntityLayout.Route>
```
Start backstage, register a quarkus component including the following annotations

```yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: my-quarkus-app
  description: A cool quarkus app
  annotations:
    app.kubernetes.io/name: quarkus
    app.quarkus.io/quarkus-version: "3.9"
```

and open the Quarkus view using the software catalog.

## Scaffold template fields

This plugin proposes different UI fields to be used part of a template scaffolded by backstage as parameters:

| Name                                                        | Description                                                                                                                     |
|-------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------|
| [QuarkusExtensionList](#Quarkus-extensions-field)           | Filter, select your Quarkus extensions using the `Quarkus Extension List` field.                                                |
| [QuarkusQuickstartPicker](#Quarkus-Quickstart-picker-field) | Select using the `Quarkus QuickStart Picker` one of the quickstarts available: https://github.com/quarkusio/quarkus-quickstarts |
| [QuarkusVersionList](#Quarkus-version-list-field)           | List the recommended and available versions of Quarkus                                                                          |


**NOTE**: Such frontend feature(s) should be used with the quarkus scaffolder backend plugin !

To use them, import the needed package under the following path within an existing backstage application:
```
yarn add --cwd packages/app "@qshift/plugin-quarkus"
```

Next, customize the `packages/app/src/App.tsx` file according to the field that you plan to use and described hereafter

### Local development

When you develop a new `<ScaffolderFieldExtensions/>`, then we recommend
to launch the plugin locally using the `createDevApp` of the `./dev/index.tsx` file for testing/debugging purposes.

To play with it, open a terminal and run the command: `yarn start` within the `./plugins/quarkus` folder

**NOTE:** Don't forget to open a second terminal and to launch the backend or [backend-next](../../docs/backend-system/index.md) there, using `yarn start` and to specify the locations of the templates to play with !

If your IDE supports to debug an application that is running on the localhost in the development mode like [IntelliJ](https://www.jetbrains.com/help/idea/debugging-javascript-in-chrome.html#debugging_js_on_local_host_development_mode), then use the commands "Command + Shift" and click on the url: `http://localhost:3000`, next add a breakpoint within your tsx file

![local-debug.png](doc%2Flocal-debug.png)

### Quarkus extensions field

This field allows a user to pick up Quarkus extension(s) from the code generator server.

Edit the `packages/app/src/App.tsx` file to add the tag of the `<QuarkusExtensionListField />`
within the tag `<Route path="/create" element={<ScaffolderPage />}>` as described hereafter.

```tsx
...
import { ScaffolderFieldExtensions } from '@backstage/plugin-scaffolder-react';
import { QuarkusExtensionListField } from '@qshift/plugin-quarkus';
...
    <Route path="/create" element={<ScaffolderPage />}>
      <ScaffolderFieldExtensions>
        <QuarkusExtensionListField />
      </ScaffolderFieldExtensions>
...
```

Update your template file to use extension field:
```yaml
apiVersion: scaffolder.backstage.io/v1beta3
kind: Template
metadata:
  name: quarkus-application
  title: Create a Quarkus Application
  description: Create a Quarkus application using code generator "code.quarkus.io"
  tags:
    - quarkus
    - java
spec:
  owner: guests
  type: service

  parameters:
  ...
  - title: Customize the Quarkus application features
    properties:
      extensions:
        title: Quarkus Extensions
        type: array
        description: The list of the quarkus extensions
        ui:field: QuarkusExtensionList
  steps:
  ...
```

When done, you will be able to select your extension(s) when you scaffold a new project.

It is also possible to filter the extensions (aka restrict the list of the extensions to be used):
```yaml
    ui:field: QuarkusExtensionList
    ui:options:
      filter:
        extensions:
          - io.quarkus:quarkus-resteasy-reactive-jackson
          - io.quarkus:quarkus-smallrye-openapi
          - io.quarkus:quarkus-smallrye-graphql
          - io.quarkus:quarkus-hibernate-orm-rest-data-panache
```
If you would like to use a different code generator server, set the following property
```yaml
    ui:field: QuarkusExtensionList
    ui:options:
        codeQuarkusUrl: https://staging.code.quarkus.io
```

Quarkus Extension List - default (field):
![extensions-1.png](/plugins%2Fquarkus%2Fdoc%2Fextensions-1.png)

Quarkus Extension List - Select (field):
![extensions-2.png](/plugins%2Fquarkus%2Fdoc%2Fextensions-2.png)

Quarkus Extension List - Added (field):
![extensions-3.png](/plugins%2Fquarkus%2Fdoc%2Fextensions-3.png)

### Quarkus Quickstart picker field

This field allows a user to pick up a Quarkus Quickstart project.

Edit the `packages/app/src/App.tsx` file to add the tag of the `<QuarkusQuickstartPickerField />`
within the `<Route path="/create" element={<ScaffolderPage />}>` as described hereafter.

```tsx
...
import { ScaffolderFieldExtensions } from '@backstage/plugin-scaffolder-react';
import { QuarkusQuickstartPickerField } from '@qshift/plugin-quarkus';
...
    <Route path="/create" element={<ScaffolderPage />}>
      <ScaffolderFieldExtensions>
        <QuarkusQuickstartPickerField />
      </ScaffolderFieldExtensions>
...
```

Update your template file to use extension field:
```yaml
apiVersion: scaffolder.backstage.io/v1beta3
kind: Template
metadata:
  name: quarkus-quickstart
  title: Create a Quarkus Application from a Quickstart
  description: Create a Quarkus Application from one of the Quickstarts you can find on "https://github.com/quarkusio/quarkus-quickstarts"
  tags:
    - quarkus
    - java
spec:
  owner: guests
  type: service

  parameters:
  ...
  - title: Select the Quarkus Quickstart
    properties:
      quickstartName:
        title: Quickstart Name
        type: string
        description: The name of the quickstart to clone
        default: 'hibernate-orm-panache'
        ui:field: QuarkusQuickstartPicker
  steps:
  ...
```

When done, you will be able to create a new Quarkus project from the quickstart selected.

Quarkus Quickstart Picker - default (field):
![quickstart-1.png](/plugins/quarkus/doc/quickstart-1.png)

Quarkus Quickstart Picker - select (field):
![quickstart-2.png](/plugins/quarkus/doc/quickstart-2.png)

### Quarkus Version list field

This field allows a user to select a Quarkus version from the list of the recommended and available version.

Edit the `packages/app/src/App.tsx` file to add the tag of the `<QuarkusQuickstartPickerField />`
within the `<Route path="/create" element={<ScaffolderPage />}>` as described hereafter.

```tsx
...
import { ScaffolderFieldExtensions } from '@backstage/plugin-scaffolder-react';
import { QuarkusVersionListField } from '@qshift/plugin-quarkus';
...
    <Route path="/create" element={<ScaffolderPage />}>
      <ScaffolderFieldExtensions>
        <QuarkusQuickstartPickerField />
      </ScaffolderFieldExtensions>
...
```
Update your template file to use extension field:
```yaml
apiVersion: scaffolder.backstage.io/v1beta3
kind: Template
metadata:
  name: quarkus-application
  title: Create a Quarkus Application
  description: Create a Quarkus application using code generator "code.quarkus.io"
  tags:
    - quarkus
    - java
spec:
  owner: guests
  type: service

  parameters:
  ...
  - title: Customize the Quarkus application features
    properties:
      quarkusVersion:
      title: Quarkus version
      type: array
      description: The list of the quarkus supported/recommended
      ui:field: QuarkusVersionList
      
  steps:
  ...
```

When done, you will be able to select the quarkus version to be used to scaffold 
your quarkus project

Quarkus Version list - Select (field):
![version-list.png](/plugins/quarkus/doc/version-list.png)

Quarkus Version list - Recommended (field):
![version-recommended.png](/plugins/quarkus/doc/version-recommended.png)

## Quarkus actions

This plugin provides the following list of backstage action(s) to be used in a template:

| Action                     | Description                                                                                                                                                |
|----------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `quarkus:app:create`       | Create a Quarkus using the website `code.quarkus.io` able to generate a zip file of a Quarkus project and extensions selected (using extension list field) |
| `quarkus:quickstart:clone` | Clone a Quarkus "Quickstart" repository.                                                                                                                   |

To use this plugin, add the following packages to the backstage backend:
```bash
yarn add --cwd packages/backend "@qshift/plugin-quarkus-backend"
yarn add --cwd packages/backend "@backstage/integration"
```
Next, follow the instructions documented for each `action`

### quickstart:clone

To use this action able to clone a quarkus quickstart from this [repository](https://github.com/quarkusio/quarkus-quickstarts), then add it to the new backend system like this

```typescript
// packages/backend/src/index.ts
import { createBackend } from '@backstage/backend-defaults';

const backend = createBackend();
...
backend.add(import('@qshift/plugin-quarkus-backend'));
...
backend.start();
```

or edit the file `packages/backend/src/plugins/scaffolder.ts` using the old backend system to register the action: `cloneQuarkusQuickstart`.

Here is a snippet example of code changed
```typescript
import { ScmIntegrations } from '@backstage/integration';
import {createBuiltinActions, createRouter} from '@backstage/plugin-scaffolder-backend';
import { cloneQuarkusQuickstart } from '@internal/plugin-quarkus-backend';
...
  const integrations = ScmIntegrations.fromConfig(env.config);

  const builtInActions = createBuiltinActions({
    integrations,
    catalogClient,
    config: env.config,
    reader: env.reader,
  });

  const actions = [...builtInActions, cloneQuarkusQuickstart()];

  return await createRouter({
    actions,
```

The following table details the fields that you can use to customize this action:

| Input               | Description                                   | Type          | Required |
|---------------------|-----------------------------------------------|---------------|----------|
| quickstartName      | The name of the quickstart project to be used | string        | Yes      |
| groupId             | Maven GroupID                                     | No    |
| artifactId          | Maven ArtifactID                                  | No    |
| targetPath          | Target Path to access the code within the workspace | No    |
| additionalProperties | Quarkus properties                                | No    |
| database            | Quarkus backend database (PostgreSQL, etc)        | No    |
| infoEndpoint        | Quarkus API endpoint                              | No    |
| healthEndpoint      | Kubernetes Health ednpoint                        | No    |
| metricsEndpoint     | Enpoint exposing the Quarkus metrics              | No    |

Example of action:
```yaml
  steps:
    - id: template
      name: Generating the Source Code Component
      action: quarkus:quickstart:clone
      input:
        values:
          groupId: ${{ parameters.groupId }}
          artifactId: ${{ parameters.artifactId }}
          version: ${{ parameters.version }}
          quickstartName: ${{ parameters.quickstartName }}
          additionalProperties: ${{ parameters.additionalProperties }}
```

### app:create

To use this action able to create a quarkus application using `code.quarkus.io`, then add it to the new backend system like this

```typescript
// packages/backend/src/index.ts
import { createBackend } from '@backstage/backend-defaults';

const backend = createBackend();
...
backend.add(import('@qshift/plugin-quarkus-backend'));
...
backend.start();
```

or edit the file `packages/backend/src/plugins/scaffolder.ts` to register the action: `createQuarkusApp`.

Here is a snippet example of code changed
```typescript
import { ScmIntegrations } from '@backstage/integration';
import {createBuiltinActions, createRouter} from '@backstage/plugin-scaffolder-backend';
import { createQuarkusApp } from '@internal/plugin-quarkus-backend';
...
  const integrations = ScmIntegrations.fromConfig(env.config);

  const builtInActions = createBuiltinActions({
    integrations,
    catalogClient,
    config: env.config,
    reader: env.reader,
  });

  const actions = [...builtInActions, createQuarkusApp()];

  return await createRouter({
    actions,
```
The following table details the fields that you can use to customize this action:

| Input                | Description                                                      | Type    | Required |
|----------------------|------------------------------------------------------------------|---------|----------|
| quarkusVersion       | Quarkus version                                                  | string  | No       |
| groupId              | Maven GroupID                                                    | string  | No       |
| artifactId           | Maven ArtifactID                                                 | string  | No       |
| version              | Maven Version                                                    | string  | No       |
| buildTool            | Tool to be used to build: 'MAVEN', 'GRADLE', 'GRADLE_KOTLIN_DSL' | string  | No       |
| extensions           | List of the Quarkus extensions                                   | array   | No       |
| javaVersion          | JDK version                                                      | string  | No       |
| starterCode          | Generate for the project some code to start ?                    | boolean | No       |
| targetPath           | Target Path to access the code within the workspace              | string  | No       |
| additionalProperties | Quarkus properties                                               | string  | No       |
| database             | Quarkus backend database (PostgreSQL, etc)                       | string  | No       |
| infoEndpoint         | Has a Quarkus API endpoint ?                                     | boolean | No       |
| healthEndpoint       | Has a Kubernetes Health endpoint ?                               | boolean | No       |
| metricsEndpoint      | Has a Quarkus metrics endpoint ?                                 | boolean | No       |

Example of action:
```yaml
  steps:
    - id: template
      name: Generating the Source Code Component
      action: quarkus:app:create
      input:
        values:
          quarkusVersion: ${{ parameters.quarkusVersion[0] }}
          groupId: ${{ parameters.groupId }}
          artifactId: ${{ parameters.artifactId }}
          version: ${{ parameters.version }}
          buildTool: ${{ parameters.buildTool }}
          javaVersion: ${{ parameters.javaVersion }}
          extensions: ${{ parameters.extensions }}
          database: ${{ parameters.database }}
          infoEndpoint: ${{ parameters.infoEndpoint }}
          healthEndpoint: ${{ parameters.healthEndpoint }}
          metricsEndpoint: ${{ parameters.metricsEndpoint }}
          additionalProperties: ${{ parameters.additionalProperties }}
          starterCode: true
```

## Api actions

This plugin provides the following list of backstage action(s) to be used in a template:

| Action       | Description                                           |
|--------------|-------------------------------------------------------|
| `api:save`   | Save an API from the catalog to the project workspace |

To use this plugin, add the following packages to the backstage backend:
```bash
yarn add --cwd packages/backend "@qshift/plugin-maven-backend"
yarn add --cwd packages/backend "@backstage/integration"
```
Next, follow the instructions documented for each `action`

### api:save

To use the plugin you need to add the following module to the new backend system like this

```typescript
// packages/backend/src/index.ts
import { createBackend } from '@backstage/backend-defaults';

const backend = createBackend();
...
backend.add(import('@qshift/plugin-quarkus-backend'));
...
backend.start();
```

The following table details the fields that you can use to customize this action:

| Input        | Description                              | Type   | Required |
|--------------|------------------------------------------|--------|----------|
| apiEntityRef | The reference of the Api Entity          | string | Yes      |
| targetPath   | Path where the API file should be stored | string | Yes      |


Example of template including the EntityPicker field parameter:
```yaml
properties:
  apiRef:
    title: API
    description: The API to consume
    type: string
    ui:field: EntityPicker
    ui:options:
      catalogFilter:
        kind:
          - API
        spec.type: grpc
```

**Remark**: The apiRef example above only lists the APIs of type `grpc`, but any type can be used, or even no type at all. In the later case all APIs, regardless of their kind will be listed.

The definition of the selected API can then be saved to the project workspace using the `save:api` action.

```yaml
- id: saveApi
  name: Save the API
  action: save:api
  input:
    values:
      targetPath: proto/${{ parameters.component_id }}.proto
      apiEntityRef: ${{ parameters.apiRef }}
```


## Maven actions

This plugin provides the following list of backstage action(s) to be used in a template:

| Action                     | Description                                                                                                                                                |
|----------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `maven:dependencies:add`   | Add one or more maven dependencies to a pom in your project                                                                                                |

To use this plugin, add the following packages to the backstage backend:
```bash
yarn add --cwd packages/backend "@qshift/plugin-maven-backend"
yarn add --cwd packages/backend "@backstage/integration"
```
Next, follow the instructions documented for each `action`

### maven:dependencies:add

To use this action able to add maven dependencies to a POM xml file, add it to the new backend system like this

```typescript
// packages/backend/src/index.ts
import { createBackend } from '@backstage/backend-defaults';

const backend = createBackend();
...
backend.add(import('@qshift/plugin-quarkus-backend'))
...
backend.start()
```

or edit the file `packages/backend/src/plugins/scaffolder.ts` using the old backend system to register the action: `mavenDependenciesAdd`.

Here is a snippet example of code changed
```typescript
import { ScmIntegrations } from '@backstage/integration';
import {createBuiltinActions, createRouter} from '@backstage/plugin-scaffolder-backend';
import { mavenDependenciesAdd } from '@internal/plugin-maven-backend';
...
  const integrations = ScmIntegrations.fromConfig(env.config);

  const builtInActions = createBuiltinActions({
    integrations,
    catalogClient,
    config: env.config,
    reader: env.reader,
  });

  const actions = [...builtInActions, mavenDependenciesAdd()];

  return await createRouter({
    actions,
```

The following table details the fields that you can use to customize this action:

| Input                | Description                             | Type               | Required |
|--------------------- |-----------------------------------------|--------------------|----------|
| pomPath              | The path of the pom.xml file to edit    | string             | Yes      |
| dependencies         | Maven dependencies                      | object (see below) | No       |


The `dependencies` field is an array of objects with the following fields:
| Field                | Description                             | Type               | Required |
|--------------------- |-----------------------------------------|--------------------|----------|
| groupId              | Maven GroupID                           | string             | Yes      |
| artifactId           | Maven ArtifactID                        | string             | Yes      |
| version              | Maven version                           | string             | No       |
| scope                | Maven scope                             | string             | No       |
| classifier           | Maven classifier                        | string             | No       |
| optional             | Maven optional                          | boolean            | No       |

Example of action:
```yaml
steps:
  - action: maven:dependencies:add
    id: maven-dependency-add
    name: Add dependencies to a Maven project
    input:
      values:
        dependencies:
          - groupId: org.mvnpm.at.mvnpm
            artifactId: vaadin-webcomponents
            version: 24.3.10
            scope: provided
```



