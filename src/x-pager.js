(function () {
    xtag.register('x-pager', {
        lifecycle: {
            created: function () {
                this.xtag.active = 1;
                this.xtag.moving = false;
                this.xtag.loop = false;
                this.xtag.pageSize = 5;
                this.xtag.itemCount = 0;
                this.xtag.pageCount = function () {
                    return Math.ceil(this.itemCount / this.pageSize);
                };
            }
        },
        accessors: {
            pageSize: {
                attribute: {},
                get: function () {
                    return this.xtag.pageSize;
                },
                set: function (val) {
                    this.xtag.pageSize = val;
                }
            },
            itemCount: {
                attribute: {},
                get: function () {
                    return this.xtag.itemCount;
                },
                set: function (val) {
                    this.xtag.itemCount = val;
                }
            },
            loop: {
                attribute: {
                    boolean: true
                },
                get: function () {
                    return this.xtag.loop;
                },
                set: function (val) {
                    this.xtag.loop = val;
                }
            }
        },
        methods: {
            render: function (callback) {
                if (typeof callback == "function") {
                    var that = this,
                        last = xtag.queryChildren(this, ".pager-next");

                    for (var page = 1; page <= this.xtag.pageCount(); page++) {
                        var link = xtag.createFragment(callback(page));

                        this.xtag.content.push(link.firstChild);

                        (function (arg) {
                            xtag.addEvent(link.firstChild, 'tap', function (event) {
                                that.to(arg);
                            });
                        })(page);

                        this.insertBefore(link, last[0]);
                    }
                }
            },
            next: function () {
                if (this.xtag.moving) {
                    return;
                }

                return move.call(this, this.xtag.active + 1);
            },
            prev: function () {
                if (this.xtag.moving) {
                    return;
                }

                return move.call(this, this.xtag.active - 1);
            },
            to: function (page) {
                var that = this;

                if (this.xtag.moving) {
                    return xtag.fireEvent(this, 'moved', function () {
                        e.target.removeEventListener(e.type, arguments.callee);
                        that.to(page);
                    });
                }

                return move.call(this, page);
            }
        },
        events: {
            'tap:delegate(.prev)': function (e) {
                disableButton.call(e.currentTarget, '.next', false);
                e.currentTarget.prev();
            },
            'tap:delegate(.next)': function (e) {
                disableButton.call(e.currentTarget, '.prev', false);
                e.currentTarget.next();
            },
            first: function (e) {
                disableButton.call(e.currentTarget, '.prev', true);
            },
            last: function (e) {
                disableButton.call(e.currentTarget, '.next', true);
            }
        }
    });

    function move(page) {
        this.xtag.moving = true;

        setActive.call(this, page);

        if (this.xtag.active == 1) {
            xtag.fireEvent(this, 'first');
        } else if (this.xtag.active === this.xtag.pageCount()) {
            xtag.fireEvent(this, 'last');
        }

        xtag.fireEvent(this, 'moved', {
            detail: {
                page: this.xtag.active,
                pageSize: this.xtag.pageSize,
                offset: (page - 1) * this.xtag.pageSize
            }
        });

        this.xtag.moving = false;

        return this;
    }

    function setActive(page) {
        if (page > this.xtag.pageCount() || page < 1) {
            if (this.xtag.loop) {
                page = 1;
            } else {
                return;
            }
        }

        this.xtag.active = page;
    }

    function disableButton(selector, disabled) {
        var btn = xtag.query(this, selector)
        if (btn && btn[0].disabled !== disabled) {
            btn[0].disabled = disabled;
        };
    }
})();