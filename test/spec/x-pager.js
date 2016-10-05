describe("x-pager ", function () {
    var testbox = null;

    beforeAll(function (done) {
        window.addEventListener('WebComponentsReady', function () {
            done();
        });
        testbox = document.getElementById("testbox");
    });

    afterEach(function () {
        while (testbox.firstChild) {
            testbox.removeChild(testbox.firstChild);
        }
    });

    it('should be available', function () {
        expect(xtag.tags['x-pager']).toBeDefined();
    });

    it('fires moved event when calling next method', function (done) {
        var element = document.createElement('x-pager');
        element.itemCount = 20;
        element.pageSize = 5;
        element.addEventListener("moved", function (e) {
            expect(e.detail.page).toBe(2);
            expect(e.detail.pageSize).toBe(5);
            expect(e.detail.offset).toBe(5);
            done();
        });
        element.next();
    });

    it('fires moved event when calling prev method', function (done) {
        var element = document.createElement('x-pager');
        element.itemCount = 20;
        element.pageSize = 5;
        element.next();
        element.addEventListener("moved", function (e) {
            expect(e.detail.page).toBe(1);
            expect(e.detail.pageSize).toBe(5);
            expect(e.detail.offset).toBe(0);
            done();
        });
        element.prev();
    });

    it('fires moved event when calling to method', function (done) {
        var element = document.createElement('x-pager');
        element.itemCount = 20;
        element.pageSize = 5;
        element.addEventListener("moved", function (e) {
            expect(e.detail.page).toBe(3);
            expect(e.detail.pageSize).toBe(5);
            expect(e.detail.offset).toBe(10);
            done();
        });
        element.to(3);
    });

    it('fires moved event when calling to method with invalid page argument', function (done) {
        var element = document.createElement('x-pager');
        element.itemCount = 20;
        element.pageSize = 5;
        element.to(3);
        element.addEventListener("moved", function (e) {
            expect(e.detail.page).toBe(3);
            expect(e.detail.pageSize).toBe(5);
            expect(e.detail.offset).toBe(10);
            done();
        });
        element.to(10);
    });

    it('fires first event when moved to first page', function (done) {
        var element = document.createElement('x-pager');
        element.itemCount = 20;
        element.pageSize = 5;

        element.addEventListener("first", function (e) {
            expect(true).toBe(true);
            done();
        })

        element.next();
        element.prev();
    });

    it('fires last event when moved to last page', function (done) {
        var element = document.createElement('x-pager');
        element.itemCount = 20;
        element.pageSize = 5;

        element.addEventListener("last", function (e) {
            expect(true).toBe(true);
            done();
        })

        element.to(4);
    });

    it('should stay in last page when loop is disabled', function (done) {
        var element = document.createElement('x-pager');
        element.itemCount = 20;
        element.pageSize = 5;
        element.to(4);

        element.addEventListener("moved", function (e) {
            expect(e.detail.page).toBe(4);
            expect(e.detail.pageSize).toBe(5);
            expect(e.detail.offset).toBe(15);
            done();
        })

        element.next();
    });

    it('should move to first page when loop is enabled', function (done) {
        var element = document.createElement('x-pager');
        element.itemCount = 20;
        element.pageSize = 5;
        element.loop = true;
        element.to(4);

        element.addEventListener("moved", function (e) {
            expect(e.detail.page).toBe(1);
            expect(e.detail.pageSize).toBe(5);
            expect(e.detail.offset).toBe(0);
            done();
        })

        element.next();
    });
});