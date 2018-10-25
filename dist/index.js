var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { ApolloLink, Observable } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';
// turns 10d into number of ms
function msTime(str) {
    var types = { ms: 1 };
    types.s = types.ms * 1000;
    types.m = types.s * 60;
    types.h = types.m * 60;
    types.d = types.h * 24;
    types.w = types.d * 7;
    var num = parseInt(str.replace(/[a-z]+/i, ''), 10);
    var type = str.replace(/[0-9]+/, '');
    return num * types[type];
}
var MaxAgeLink = /** @class */ (function (_super) {
    __extends(MaxAgeLink, _super);
    function MaxAgeLink(options) {
        var _this = _super.call(this) || this;
        _this.options = options;
        _this.scheduled = new Map();
        return _this;
    }
    MaxAgeLink.prototype.request = function (op, forward) {
        var ctx = op.getContext();
        var isQuery = getMainDefinition(op.query).operation === 'query';
        if (!isQuery || !ctx.maxAge || ctx.force === true) {
            return forward(op);
        }
        var key = this.toKey(op);
        if (this.shouldUseNetwork(key)) {
            var now = new Date();
            var maxAge = typeof ctx.maxAge === 'string' ? msTime(ctx.maxAge) : ctx.maxAge;
            var expirationDate = new Date(now.getTime() + maxAge);
            this.schedule(key, expirationDate);
            return forward(op);
        }
        try {
            var data_1 = this.options.cache.readQuery({
                query: ctx.query || op.query,
                variables: op.variables,
            });
            return new Observable(function (observer) {
                try {
                    observer.next({ data: data_1 });
                    observer.complete();
                }
                catch (e) {
                    observer.error(e);
                }
            });
        }
        catch (e) {
            // Query not in cache, do the network request
            return forward(op);
        }
    };
    MaxAgeLink.prototype.shouldUseNetwork = function (key) {
        return this.isExpired(key) || !this.scheduled.has(key);
    };
    MaxAgeLink.prototype.isExpired = function (key) {
        return this.scheduled.get(key) < new Date();
    };
    MaxAgeLink.prototype.schedule = function (key, date) {
        this.scheduled.set(key, date);
    };
    MaxAgeLink.prototype.toKey = function (op) {
        return this.options.toKey ? this.options.toKey(op) : op.toKey();
    };
    return MaxAgeLink;
}(ApolloLink));
export { MaxAgeLink };
//# sourceMappingURL=index.js.map