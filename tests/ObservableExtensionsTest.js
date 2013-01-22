﻿/// <reference path="../reactiveassert.js" />
/// <reference path="../rx.js" />
/// <reference path="../rx.testing.js" />

(function(window) {

    // Check if browser vs node
    var root;
    if (!window.document) {
        root = require('../rx.js');
        require('../rx.testing');
        require('./ReactiveAssert');
    } else {
        root = window.Rx;
    }

    // use a single load function
    var load = typeof require == 'function' ? require : window.load;

    // load QUnit and CLIB if needed
    var QUnit =
      window.QUnit || (
        window.setTimeout || (window.addEventListener = window.setTimeout = / /),
        window.QUnit = load('./vendor/qunit-1.9.0.js') || window.QUnit,
        load('./vendor/qunit-clib.js'),
        (window.addEventListener || 0).test && delete window.addEventListener,
        window.QUnit
      );

    QUnit.module('ObservableExtensionsTest');

    var Scheduler = root.Scheduler,
        Observable = root.Observable;

    test('Subscribe_None_Return', function () {
        Observable.returnValue(1, Scheduler.immediate).subscribe();
        ok(true);
    });

    test('Subscribe_None_Throw', function () {
        var e, ex;
        ex = 'ex';
        try {
            Observable.throwException(ex, Scheduler.immediate).subscribe();
        } catch (e1) {
            e = e1;
        }
        equal(e, ex);
    });

    test('Subscribe_None_Empty', function () {
        Observable.empty(Scheduler.immediate).subscribe(function () {
            ok(false);
        });
        ok(true);
    });

    test('Subscribe_OnNext_Return', function () {
        var x1 = -1;
        Observable.returnValue(42, Scheduler.immediate).subscribe(function (x) {
            x1 = x;
        });
        equal(42, x1);
    });

    test('Subscribe_OnNext_Throw', function () {
        var e, ex;
        ex = 'ex';
        try {
            Observable.throwException(ex, Scheduler.immediate).subscribe(function () {
                ok(false);
            });
        } catch (e1) {
            e = e1;
        }
        equal(e, ex);
    });

    test('Subscribe_OnNext_Empty', function () {
        Observable.empty(Scheduler.immediate).subscribe(function (x) {
            ok(false);
        });
        ok(true);
    });

    test('Subscribe_OnNext_Empty', function () {
        var finished = false, x1 = -1;
        Observable.returnValue(42, Scheduler.immediate).subscribe(function (x) {
            x1 = x;
        }, null, function () {
            finished = true;
        });
        equal(42, x1);
        ok(finished);
    });

    test('Subscribe_OnNextOnCompleted_Throw', function () {
        var e, ex;
        ex = 'ex';
        try {
            Observable.throwException(ex, Scheduler.immediate).subscribe(function () {
                ok(false);
            }, null, function () {
                ok(false);
            });
        } catch (e1) {
            e = e1;
        }
        equal(ex, e);
    });

    test('Subscribe_OnNextOnCompleted_Empty', function () {
        var finished = false;
        Observable.empty(Scheduler.immediate).subscribe(function () {
            ok(false);
        }, null, function () {
            finished = true;
        });
        ok(finished);
    });

    // must call `QUnit.start()` if using QUnit < 1.3.0 with Node.js or any
    // version of QUnit with Narwhal, Rhino, or RingoJS
    if (!window.document) {
        QUnit.start();
    }
}(typeof global == 'object' && global || this));