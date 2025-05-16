var PONIES = (function (exports) {

    function map(array, callback) {
        var result = [];
        for (var index = 0; index < array.length; index += 1) {
            var value = array[index];
            result[index] = callback(value, index, array);
        }
        return result;
    }

    function arrayFrom(source, mapFn) {
        if (!source.length)
            return [];
        var asArray = [];
        try {
            for (var i = 0; i < source.length; i++)
                asArray.push(source[i]);
        }
        catch (_a) {
            for (var i = 1; i <= source.length; i++)
                asArray.push(source[i]);
        }
        return mapFn ? map(asArray, mapFn) : asArray;
    }

    function some(array, callback) {
        for (var index = 0; index < array.length; index += 1) {
            var value = array[index];
            if (callback(value, index, array)) {
                return true;
            }
        }
        return false;
    }

    function arrayIncludes(array, searchedValue) {
        return some(array, function (value) { return value === searchedValue; });
    }

    function every(array, callback) {
        for (var index = 0; index < array.length; index += 1) {
            var value = array[index];
            if (!callback(value, index, array)) {
                return false;
            }
        }
        return true;
    }

    function fill(array, value, startIndex, endIndex) {
        if (startIndex === void 0) { startIndex = 0; }
        if (endIndex === void 0) { endIndex = array.length; }
        for (var index = startIndex; index < endIndex; index += 1) {
            array[index] = value;
        }
        return array;
    }

    function filter(array, callback) {
        var result = [];
        for (var index = 0; index < array.length; index += 1) {
            var value = array[index];
            if (callback(value, index, array)) {
                result.push(value);
            }
        }
        return result;
    }

    function findIndex(array, callback) {
        for (var index = 0; index < array.length; index += 1) {
            var value = array[index];
            if (callback(value, index, array)) {
                return index;
            }
        }
        return -1;
    }

    function find(array, callback) {
        var index = findIndex(array, callback);
        if (index === -1) {
            return undefined;
        }
        return array[index];
    }

    function reduce(array, callback, initValue) {
        var acc = initValue;
        var startAtIndex = 0;
        if (initValue === undefined) {
            acc = array[0];
            startAtIndex = 1;
        }
        for (var index = startAtIndex; index < array.length; index += 1) {
            var value = array[index];
            acc = callback(acc, value, index, array);
        }
        return acc;
    }

    function isArray(subject) {
        return Boolean(subject &&
            Object.prototype.toString.call(Object(subject)) === "[object Array]");
    }

    function flat(array, depth) {
        if (depth === void 0) { depth = 0; }
        if (depth < 1 || !isArray(array)) {
            return array;
        }
        return reduce(array, function (result, current) {
            return result.concat(flat(current, depth - 1));
        }, []);
    }

    function flatMap(array, callback) {
        return flat(map(array, callback), 1);
    }

    function forEach(array, callback) {
        for (var index = 0; index < array.length; index += 1) {
            var value = array[index];
            callback(value, index, array);
        }
        return array;
    }

    function groupBy(array, key) {
        return reduce(array, function (acc, currentValue) {
            var groupKey = currentValue[key];
            if (!acc[groupKey]) {
                acc[groupKey] = [];
            }
            acc[groupKey].push(currentValue);
            return acc;
        }, {});
    }

    function indexOf(array, searchedValue) {
        return findIndex(array, function (value) { return value === searchedValue; });
    }

    function lastIndexOf(array, searchedValue) {
        for (var index = array.length - 1; index > -1; index -= 1) {
            var value = array[index];
            if (value === searchedValue) {
                return index;
            }
        }
        return -1;
    }

    var _Array = {
        arrayFrom: arrayFrom,
        every: every,
        fill: fill,
        filter: filter,
        find: find,
        findIndex: findIndex,
        flat: flat,
        flatMap: flatMap,
        forEach: forEach,
        groupBy: groupBy,
        includes: arrayIncludes,
        indexOf: indexOf,
        isArray: isArray,
        lastIndexOf: lastIndexOf,
        map: map,
        reduce: reduce,
        some: some
    };

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __spreadArray(to, from, pack) {
        if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
            if (ar || !(i in from)) {
                if (!ar) ar = Array.prototype.slice.call(from, 0, i);
                ar[i] = from[i];
            }
        }
        return to.concat(ar || Array.prototype.slice.call(from));
    }

    function bind(thisArg, obj) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        return function () {
            var newArgs = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                newArgs[_i] = arguments[_i];
            }
            thisArg.apply(obj, __spreadArray(__spreadArray([], args, true), newArgs, true));
        };
    }

    var _Function = {
        bind: bind
    };

    function endsWith(string, searchString, position) {
        if (typeof position !== "number" ||
            !isFinite(position) ||
            Math.floor(position) !== position ||
            position > string.length) {
            position = string.length;
        }
        position -= searchString.length;
        var lastIndex = string.lastIndexOf(searchString, position);
        return lastIndex !== -1 && lastIndex === position;
    }

    function repeat(string, count) {
        var str = "" + string;
        count = +count;
        if (count != count) {
            count = 0;
        }
        if (count < 0) {
            throw new Error("RangeError: String.repeat count must be non-negative");
        }
        if (count == Infinity) {
            throw new Error("RangeError: String.repeat count must be less than infinity");
        }
        count = Math.floor(count);
        if (str.length == 0 || count == 0) {
            return "";
        }
        if (str.length * count >= 1 << 28) {
            throw new Error("RangeError: String.repeat count must not overflow maximum string size");
        }
        var rpt = "";
        for (;;) {
            if ((count & 1) == 1) {
                rpt += str;
            }
            count >>>= 1;
            if (count == 0) {
                break;
            }
            str += str;
        }
        return rpt;
    }

    function padEnd(string, targetLength, padString) {
        targetLength = targetLength >> 0;
        padString = String(typeof padString !== "undefined" ? padString : " ");
        if (string.length > targetLength) {
            return String(string);
        }
        else {
            targetLength = targetLength - string.length;
            if (targetLength > padString.length) {
                padString += repeat(padString, targetLength / padString.length);
            }
            return String(string) + padString.slice(0, targetLength);
        }
    }

    function padStart(string, targetLength, padString) {
        targetLength = targetLength >> 0;
        padString = String(typeof padString !== "undefined" ? padString : " ");
        if (string.length > targetLength) {
            return String(string);
        }
        else {
            targetLength = targetLength - string.length;
            if (targetLength > padString.length) {
                padString += repeat(padString, targetLength / padString.length);
            }
            return padString.slice(0, targetLength) + String(string);
        }
    }

    function startsWith(string, searchString, position) {
        position = position || 0;
        return string.substr(position, searchString.length) === searchString;
    }

    function stringIncludes(string, searchString, start) {
        if (typeof start !== "number") {
            start = 0;
        }
        if (start + searchString.length > string.length) {
            return false;
        }
        else {
            return string.indexOf(searchString, start) !== -1;
        }
    }

    function trim(string) {
        return String(string).replace(/^\s+/, "").replace(/\s+$/, "");
    }

    var _String = {
        endsWith: endsWith,
        includes: stringIncludes,
        padEnd: padEnd,
        padStart: padStart,
        repeat: repeat,
        startsWith: startsWith,
        trim: trim
    };

    function assign(target, source) {
        var from;
        var to = toObject(target);
        for (var i = 1; i < arguments.length; i++) {
            from = Object(arguments[i]);
            for (var key in from) {
                if (Object.prototype.hasOwnProperty.call(from, key)) {
                    to[key] = from[key];
                }
            }
        }
        return to;
    }
    function toObject(val) {
        if (val === null || val === undefined) {
            throw new Error("Object.assign cannot be called with null or undefined");
        }
        return Object(val);
    }

    function includes(a, b, c) {
        if (typeof a === "string" &&
            typeof b === "string" &&
            (typeof c === "number" || typeof c === "undefined")) {
            return stringIncludes(a, b, c);
        }
        else if (isArray(a)) {
            return arrayIncludes(a, b);
        }
        else {
            return false;
        }
    }

    var _Overloads = {
        includes: includes
    };

    exports._Array = _Array;
    exports._Function = _Function;
    exports._Overloads = _Overloads;
    exports._String = _String;
    exports.arrayFrom = arrayFrom;
    exports.arrayIncludes = arrayIncludes;
    exports.assign = assign;
    exports.bind = bind;
    exports.endsWith = endsWith;
    exports.every = every;
    exports.fill = fill;
    exports.filter = filter;
    exports.find = find;
    exports.findIndex = findIndex;
    exports.flat = flat;
    exports.flatMap = flatMap;
    exports.forEach = forEach;
    exports.groupBy = groupBy;
    exports.includes = includes;
    exports.indexOf = indexOf;
    exports.isArray = isArray;
    exports.lastIndexOf = lastIndexOf;
    exports.map = map;
    exports.padEnd = padEnd;
    exports.padStart = padStart;
    exports.reduce = reduce;
    exports.repeat = repeat;
    exports.some = some;
    exports.startsWith = startsWith;
    exports.stringIncludes = stringIncludes;
    exports.trim = trim;

    return exports;

})({});
