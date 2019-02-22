var ThreadPoolLite = (function () {
    'use strict';

    /**
     * 
     *  Our worker script
     * 
     */
    const workerScript = `
        (function workerScript(){
            self.addEventListener('message', e => {
                let result;
                try{
                    result = eval(e.data);
                }
                catch(err){
                    setTimeout(function() { throw err; }); 
                }

                if(result instanceof Promise){
                    result.then(x => {
                        self.postMessage(x);
                    }).catch(err => {
                        setTimeout(function() { throw err; }); 
                    })
                } else {
                    self.postMessage(result);
                }
            })
        })()`;
    /**
     * 
     *  The url for our worker
     * 
     */
    let url = URL.createObjectURL(new Blob([workerScript]));

    class ThreadPoolLite{
        /**
         * 
         * Create a pool of workers, defaults to the amount of logical cores 
         * your hardware has.
         * 
         * @param {Integer} workerCount 
         */
        constructor(workerCount = navigator.hardwareConcurrency){
            /**
             * The array of workers
             */
            let workers = [];
            let queue = [];
            let tasks = new WeakMap();
            /**
             *
             * Create all workers
             * 
             */
            let toIdle = worker => {
                /**
                 * 
                 *  Check for other tasks
                 * 
                 */
                if(queue.length > 0){
                    /**
                     * 
                     *  Send another task to this worker
                     * 
                     */
                    let task = queue.shift();
                    worker.postMessage(task[0]);
                    tasks.set(worker, task[1]);
                } else {
                    this.working = this.working.filter(e => worker !== e);
                    workers.push(worker);
                    tasks.set(worker, null);
                }
            }
            for(let i = 0; i < workerCount; i++){
                let worker = new Worker(url);
                workers[i] = worker;

                worker.addEventListener('message', e => {
                    tasks.get(worker).resolve(e.data);
                    toIdle(worker);
                });

                worker.addEventListener('error', e => {
                    tasks.get(worker).reject(e);
                    toIdle(worker);
                });
            }
            this.tasks = tasks;
            this.worker = workers;
            this.queue = queue;
            this.working = [];
        }

        /**
         * 
         * Runs(or enqueues, if no idle workers are available) a task.
         * 
         * Tasks have scope of their own, and cannot access their parent scope.
         * 
         * 
         * @param {Function} runnable - the task the worker receives
         * @returns {Promise}
         */
        run(runnable){
            let deferred = {
                resolve: null, 
                reject: null
            };

            let promise = new Promise((resolve, reject) => {
                deferred.resolve = resolve;
                deferred.reject = reject;
            });
            /**
             * 
             *  Enqueue the task 
             *
             */
            this.queue.push(['('+runnable.toString()+')()', deferred]);
            /**
             * 
             *  Check for idle workers
             * 
             */
            if(this.worker.length > 0){
                /**
                 * 
                 *  Get a worker
                 * 
                 */
                let worker = this.worker.pop();
                /**
                 * 
                 *  Send the task to the worker
                 * 
                 */
                let task = this.queue.shift();
                worker.postMessage(task[0]);
                this.working.push(worker);
                this.tasks.set(worker, task[1]);
            }

            return promise;
        }

        /**
         * 
         *  Terminates all workers
         * 
         */
        terminate(){
            for(let worker in this.working){
                if(worker instanceof Worker){
                    worker.terminate();
                }
            }
            this.working = [];
        }

        /**
         * 
         *  Get the active workers count
         * 
         */
        getActiveCount(){
            return this.working.length;
        }

        /**
         * 
         * Get the idle workers count
         * 
         */
        getIdleCount(){
            return this.worker.length;
        }
    }

    return ThreadPoolLite;
}());
