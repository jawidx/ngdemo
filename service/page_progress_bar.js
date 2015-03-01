(function () {
    angular.module('ngCommon').factory("pageProgressBar", function () {
        function PageProgressBar() {
            this.reset();
        }

        PageProgressBar.prototype = {
            init: function ($rootScope, timeout) {
                var self = this;
                $rootScope.$on("$routeChangeStart", function () {
                    self.reset();
                });

                $rootScope.$on("$routeChangeSuccess", function () {
                    NProgress.set(0.5);
                    setTimeout(function () {
                        self.freezeTaskAdded();
                    }, timeout || 100);
                });
            },

            reset: function () {
                this.count = 0;
                this.finished = 0;
                this.freeze = false;
                this.done = false;
            },

            addTask: function () {
                if (!this.freeze) {
                    this.count++;
                    if (this.count === 1) {
                        NProgress.start();
                    }
                }
            },

            finishTask: function () {
                this.finished++;
                NProgress.inc();
                this._update();
            },

            freezeTaskAdded: function () {
                this.freeze = true;
                this._update();
            },

            _update: function () {
                if (!this.done && this.freeze && this.count === this.finished) {
                    this.done = true;
                    NProgress.done();
                }
            }
        };

        return new PageProgressBar();
    });

})();