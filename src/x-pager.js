(function () {
    xtag.register('x-pager', {
        lifecycle: {
            created: function() {
                this.xtag.moving = false;
                this.xtag.activePage = 1;
                this.xtag.templates = {
                    indicator : '<div>{page}</div>',
                    prev: '<div class="prev">prev</div>',
                    next:  '<div class="next">next</div>',
                    more: '<div class="more">...</div>'
                }
            },
            inserted: function() {
                var prevControl = xtag.query(this, '.prev');
                if (prevControl.length){
                    this.xtag.prevControl = prevElement[0];
                }

                var nextControl = xtag.query(this, '.next');
                if (nextControl.length){
                    this.xtag.nextControl = nextControl[0];
                }
            }
        },
        accessors: {
            pageCount: {
                get: function() {
                    return Math.ceil(this.itemCount / this.pageSize);
                }
            },
            activePage: {
                get: function() {
                    return this.xtag.activePage;
                }
            },
            templates: {
                get: function() {
                    return this.xtag.templates;
                },
                set: function(){
                    Object.assign(this.xtag.templates, val);
                }
            },
            pageSize: {
                attribute: {
                    def: 5,
                    validate: function(val) {
                        return parseInt(val);
                    }
                }
            },
            itemCount: {
                attribute: {
                    def: 0,
                    validate: function(val) {
                        return parseInt(val);
                    }
                }
            },
            maxPages: {
                attribute: {
                    def: 10,
                    validate: function(val) {
                        return parseInt(val);
                    }
                }
            },
            navigation: {
                attribute: {
                    boolean: true
                }
            },
            loop: {
                attribute: {
                    boolean: true
                }
            }
        },
        methods: {
            renderControls: function(selector) {       
                    var that = this, container;
                    
                    if (selector instanceof HTMLElement) {
                        container = selector;
                    } else if (container = xtag.query(document, selector)) {
                    } else {
                        container = this.textContent;
                    }
                            
                    container.innerHTML = '';

                    for (var page = 1; page <= this.pageCount; page++) {
                        var fragment = xtag.createFragment(this.templates.indicator), 
                            element = fragment.firstChild;
                        
                        element.innerHTML = element.innerHTML.replace("{page}", page);

                        if (page === this.activePage)
                        {
                            element.classList.add('active');
                        }

                        (function (arg) {
                            xtag.addEvent(element, 'tap', function (event) {
                                disableElement(that.xtag.prevControl, false);
                                disableElement(that.xtag.nextControl, false);

                                that.to(arg);
                                that.updateControls();
                            });
                        })(page);

                        container.appendChild(fragment);
                    }

                    if (this.navigation)
                    {
                        var prev = xtag.createFragment(this.templates.prev);
                        var next = xtag.createFragment(this.templates.next); 

                        this.xtag.prevControl = prev.firstChild;
                        this.xtag.prevControl.onclick = function() {
                            var disabled = this.getAttribute('disabled');
                            if (disabled !== '' && disabled !== "disabled") {
                                that.prev();
                                that.updateControls();
                            }
                        };

                        this.xtag.nextControl = next.firstChild;
                        this.xtag.nextControl.onclick = function(){
                            var disabled = this.getAttribute('disabled');
                            if (disabled !== '' && disabled !== "disabled") {
                                that.next();
                                that.updateControls();
                            }
                        };

                        if (this.xtag.activePage == 1) {
                            disableElement(this.xtag.prevControl, true);
                        } 

                        if (this.xtag.activePage === this.pageCount) {
                            disableElement(this.xtag.nextControl, true);
                        }

                        container.insertBefore(prev, container.firstChild);
                        container.appendChild(next);
                    }
            },
            updateControls: function() {
            },
            next: function() {
                if (this.xtag.moving) {
                    return;
                }

                return move.call(this, this.xtag.activePage + 1);
            },
            prev: function() {
                if (this.xtag.moving) {
                    return;
                }

                return move.call(this, this.xtag.activePage - 1);
            },
            to: function(page) {
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
            'tap:delegate(.prev)': function(e) {
                var element = e.currentTarget;

                disableElement(element.xtag.nextControl, false);
                element.prev();
            },
            'tap:delegate(.next)': function(e) {
                var element = e.currentTarget;

                disableElement(element.xtag.prevControl, false);
                element.next();
            },
            first: function(e) {
                disableElement(e.currentTarget.xtag.prevControl, true);
            },
            last: function(e) {
                disableElement(e.currentTarget.xtag.nextControl, true);
            }
        }
    });

    function move(page) {
        this.xtag.moving = true;

        setActive.call(this, page);

        xtag.fireEvent(this, 'moved', {
            detail: {
                page: this.activePage,
                pageSize: parseInt(this.pageSize),
                offset: (this.activePage - 1) * this.pageSize
            }
        });
  
        this.xtag.moving = false;

        if (this.activePage == 1) {
            xtag.fireEvent(this, 'first');
        } else if (this.activePage === this.pageCount) {
            xtag.fireEvent(this, 'last');
        }

        return this;
    }

    function setActive(page) {
        if (page > this.pageCount || page < 1) {
            if (this.loop) {
                page = 1;
            } else {
                return;
            }
        }

        this.xtag.activePage = page;
    }

    function disableElement(element, disabled) {
        if (element && element instanceof HTMLElement) {
            if (disabled) {
                element.setAttribute('disabled', '');
            } else {
                element.removeAttribute('disabled');
            }
        }
    }
})();