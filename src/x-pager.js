(function () {
    xtag.register('x-pager', {
        lifecycle: {
            created: function () {
                this.xtag.moving = false;
                this.xtag.loop = false;
                this.xtag.activePage = 1;
                this.xtag.pageSize = 5;
                this.xtag.itemCount = 0;

                this.xtag.indicatorTemplate = '<div>{page}</div>';
            }
        },
        accessors: {
            pageCount: {
                get: function () {
                    return Math.ceil(this.xtag.itemCount / this.xtag.pageSize);
                }
            },
            activePage: {
                get: function () {
                    return this.xtag.activePage;
                }
            },
            indicatorTemplate: {
                get: function () {
                    return this.xtag.indicatorTemplate;
                },
                set: function (val) {
                    this.xtag.indicatorTemplate = val;
                }
            },
            pageSize: {
                attribute: {},
                get: function () {
                    return this.xtag.pageSize;
                },
                set: function (val) {
                    this.xtag.pageSize = parseInt(val);
                }
            },
            itemCount: {
                attribute: {},
                get: function () {
                    return this.xtag.itemCount;
                },
                set: function (val) {
                    this.xtag.itemCount = parseInt(val);
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
            renderIndicators: function (selector) {       
                    var that = this,container;
                    
                    if (selector instanceof HTMLElement) {
                        container = selector;
                    } else if (xtag.query(document, selector).length) {
                        container = xtag.query(document, selector)[0];
                    } 
                            
                    container.innerHTML = '';

                    for (var page = 1; page <= this.pageCount; page++) {
                        var fragment = xtag.createFragment(this.xtag.indicatorTemplate), 
                            element = fragment.firstChild;
                        
                        element.innerHTML = element.innerHTML.replace("{page}",page);

                        if (page == this.activePage)
                        {
                            element.classList.add('active');
                        }

                        (function (arg) {
                            xtag.addEvent(element, 'tap', function (event) {
                                that.to(arg);
                            });
                        })(page);

                        container.appendChild(fragment);
                    }
            },
            next: function () {
                disableButton.call(this, '.prev', false);

                if (this.xtag.moving) {
                    return;
                }

                return move.call(this, this.xtag.activePage + 1);
            },
            prev: function () {
                disableButton.call(this, '.next', false);

                if (this.xtag.moving) {
                    return;
                }

                return move.call(this, this.xtag.activePage - 1);
            },
            to: function (page) {
                disableButton.call(this, '.prev', false);
                disableButton.call(this, '.next', false);

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
                e.currentTarget.prev();
            },
            'tap:delegate(.next)': function (e) {
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

        xtag.fireEvent(this, 'moved', {
            detail: {
                page: this.xtag.activePage,
                pageSize: this.xtag.pageSize,
                offset: (this.xtag.activePage - 1) * this.xtag.pageSize
            }
        });
  
        this.xtag.moving = false;

        if (this.xtag.activePage == 1) {
            xtag.fireEvent(this, 'first');
        } else if (this.xtag.activePage === this.pageCount) {
            xtag.fireEvent(this, 'last');
        }

        return this;
    }

    function setActive(page) {
        if (page > this.pageCount || page < 1) {
            if (this.xtag.loop) {
                page = 1;
            } else {
                return;
            }
        }

        this.xtag.activePage = page;
    }

    function disableButton(selector, disabled) {
        var btn = xtag.query(this, selector)
        if (btn.length && btn[0].disabled !== disabled) {
            btn[0].disabled = disabled;
        };
    }
})();