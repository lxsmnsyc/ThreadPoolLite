# ThreadPoolLite
A library for creating Web Worker pools.

[![npm version](https://badge.fury.io/js/threadpool-lite.svg)](https://badge.fury.io/js/threadpool-lite)[![](https://data.jsdelivr.com/v1/package/npm/threadpool-lite/badge)](https://www.jsdelivr.com/package/npm/threadpool-lite)
## Example

The example below displays 10 random numbers per 3 seconds.
```js
/**
 * 
 *  Create 10 Workers 
 * 
 */
let tp = new ThreadPoolLite(10); 

/**
 * 
 *  Generate 50 tasks
 * 
 *  The task is to output a random number after 3 seconds
 *  of their current runtime.
 * 
 */
for(let i = 0; i < 50; i++){ 
    tp.run(function (){
        /**
         * 
         *  ThreadPoolLite workers can handle Promise
         *  objects, neat!
         * 
         */
        return new Promise(function (resolve, reject){
            setTimeout(function (){
                resolve(Math.random());
            }, 3000)
        })
    }).then(console.log);
}
```

## Usage
### Loading Module
NPM
```bash
npm i threadpool-lite
```
CDN
```html
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/threadpool-lite"></script>
```

## API
* [ThreadPoolLite](#ThreadPoolLite)
    * [new ThreadPoolLite(workerCount)](#new_ThreadPoolLite_new)
    * [.run(runnable)](#ThreadPoolLite+run) ⇒ <code>Promise</code>
    * [.terminate()](#ThreadPoolLite+terminate)
    * [.getActiveCount()](#ThreadPoolLite+getActiveCount)
    * [.getIdleCount()](#ThreadPoolLite+getIdleCount)

<a name="new_ThreadPoolLite_new"></a>

### new ThreadPoolLite(workerCount)
Create a pool of workers, defaults to the amount of logical cores 
your hardware has.


| Param | Type |
| --- | --- |
| workerCount | <code>Integer</code> | 

<a name="ThreadPoolLite+run"></a>

### threadPoolLite.run(runnable) ⇒ <code>Promise</code>
Runs(or enqueues, if no idle workers are available) a task.

Tasks have scope of their own, and cannot access their parent scope.

**Kind**: instance method of [<code>ThreadPoolLite</code>](#ThreadPoolLite)  

| Param | Type | Description |
| --- | --- | --- |
| runnable | <code>function</code> | the task the worker receives |

<a name="ThreadPoolLite+terminate"></a>

### threadPoolLite.terminate()
Terminates all workers

**Kind**: instance method of [<code>ThreadPoolLite</code>](#ThreadPoolLite)  
<a name="ThreadPoolLite+getActiveCount"></a>

### threadPoolLite.getActiveCount()
Get the active workers count

**Kind**: instance method of [<code>ThreadPoolLite</code>](#ThreadPoolLite)  
<a name="ThreadPoolLite+getIdleCount"></a>

### threadPoolLite.getIdleCount()
Get the idle workers count

**Kind**: instance method of [<code>ThreadPoolLite</code>](#ThreadPoolLite)

## Changelogs
* 1.1.1
    * Proper error handling
* 1.1.0
    * Run method now returns a Promise.
* 1.0.0
    * Initial release

## License
MIT License

Copyright (c) 2019 Alexis Munsayac

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
