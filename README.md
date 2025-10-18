**Finds the best match given a target and an array**

```js
import bestMatch from '@FMI-MediaMaster/best-match'

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
