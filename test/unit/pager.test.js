$(function () {
    'use strict';

    module('pager plugin');

    test('should be defined on jQuery object', function () {
        ok($(document.body).pager, 'pager method is defined');
    });

    module('pager', {
        setup: function () {
            // Run all tests in noConflict mode 
            // it's the only way to ensure that 
            // the plugin works in noConflict mode
            $.fn.bootstrapPager = $.fn.pager.noConflict()
        },
        teardown: function () {
            $.fn.pager = $.fn.bootstrapPager
            delete $.fn.bootstrapPager
        }
    });

    test('should provide no conflict', function () {
        strictEqual($.fn.pager, undefined, 'pager was set back to undefined (orig value)')
    });

    test('should throw exception when passing invalid command', function () {
        var html = '<nav id="pager"></nav>'
        var $pager = $(html).bootstrapPager({ itemCount: 20, pageSize: 5 });

        throws(function () {
            $pager.bootstrapPager('test');
        },
            "TypeError: Object doesn't support property or method 'test'",
            'type error thrown');
    });

 /*    test('should not fire moved event when passing incorrect page number', function () {
        var html = '<nav id="pager"></nav>'
        var $pager = $(html).bootstrapPager({ itemCount: 20, pageSize: 5 });

        stop();

        $pager.one('pager.moved', function (e) {
           notOk(true, 'moved event thrown');
           start();
        }).bootstrapPager(20);
    });*/

    test('should fire moved event when passing action argument returning position and size', function () {
        var html = '<nav id="pager"></nav>'
        var $pager = $(html).bootstrapPager({ itemCount: 20, pageSize: 5 });

        stop();

        $pager.one('pager.moved', function (e) {
            strictEqual(e.page, 2, 'page is correct on next');
            strictEqual(e.offset, 5, 'position is correct next');
        }).bootstrapPager('next');

        $pager.one('pager.moved', function (e) {
            strictEqual(e.page, 1, 'page is correct on prev');
            strictEqual(e.offset, 0, 'position is correct on prev');
            start()
        }).bootstrapPager('prev');
    });

    test('should fire moved event when passing page argument returning position and size', function () {
        var html = '<nav id="pager"></nav>'
        var $pager = $(html).bootstrapPager({ itemCount: 20, pageSize: 5 });

        stop();

        $pager.one('pager.moved', function (e) {
            strictEqual(e.page, 2, 'page is correct on 2');
            strictEqual(e.offset, 5, 'position is correct on 2');
        }).bootstrapPager(2);

        $pager.one('pager.moved', function (e) {
            strictEqual(e.page, 1, 'page is correct on 1');
            strictEqual(e.offset, 0, 'position is correct on 1');
            start()
        }).bootstrapPager(1);
    });
});