**Several string utils**

```js
import { bestMatch } from '@FMI-MediaMaster/string-utils'

const target = "Blapshemous";
const options = [
    {
        "name": "Blasphemous",
        "id": 1,
    },
    {
        "name": "Blasphemous 2",
        "id": 2,
    },
];
const best = bestMatch(target, options, { field: "name" });
```
