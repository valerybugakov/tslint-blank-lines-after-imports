# TSLint Blank Lines After Imports Rule

> Custom rule for tslint

Ensure number of blank lines after all import statements.

## Usage

```sh
npm i -D tslint-origin-ordered-imports-rule
```

### Configuration

```json
"rules": {
  "blank-lines-after-imports": [true]
}
```

_Wrong:_

```ts
import MyClass from './my-class';
import * as _ from 'lodash';
class YourClass {}
```

_Right:_

```ts
import MyClass from './my-class';
import * as _ from 'lodash';

class YourClass {}
```

Additional parameter allows to configure number of required blank lines:

```json
"rules": {
  "blank-lines-after-imports": [true, 2]
}
```

_Wrong:_

```ts
import MyClass from './my-class';
import * as _ from 'lodash';
class YourClass {}
```

_Right:_

```ts
import MyClass from './my-class';
import * as _ from 'lodash';

class YourClass {}
```

## Testing

To test the rule just run:

```sh
npm run test
```

## Licensing

The code in this project is licensed under MIT license.
