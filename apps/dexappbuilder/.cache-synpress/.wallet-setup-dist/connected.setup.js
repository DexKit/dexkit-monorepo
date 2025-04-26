/// ######## BANNER WITH FIXES START ########
// ---- DYNAMIC_REQUIRE_FS_FIX ----
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _async_to_generator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
function _ts_generator(thisArg, body) {
    var f, y, t, g, _ = {
        label: 0,
        sent: function() {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    };
    return(g = {
        next: verb(0),
        "throw": verb(1),
        "return": verb(2)
    }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
    }), g);
    function verb(n) {
        return function(v) {
            return step([
                n,
                v
            ]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(_)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
}
var require = (await import("node:module")).createRequire(import.meta.url);
var __filename = (await import("node:url")).fileURLToPath(import.meta.url);
var __dirname = (await import("node:path")).dirname(__filename);
// ---- DYNAMIC_REQUIRE_FS_FIX ----
/// ######## BANNER WITH FIXES END ########
import { __commonJS, __require } from "./chunk-DU5HJZCO.js";
// ../../node_modules/dotenv/lib/main.js
var require_main = __commonJS({
    "../../node_modules/dotenv/lib/main.js": function(exports, module) {
        "use strict";
        var log = function log(message) {};
        var parse = function parse(src, options) {
            var debug = Boolean(options && options.debug);
            var obj = {};
            src.toString().split(NEWLINES_MATCH).forEach(function(line, idx) {
                var keyValueArr = line.match(RE_INI_KEY_VAL);
                if (keyValueArr != null) {
                    var key = keyValueArr[1];
                    var val = keyValueArr[2] || "";
                    var end = val.length - 1;
                    var isDoubleQuoted = val[0] === '"' && val[end] === '"';
                    var isSingleQuoted = val[0] === "'" && val[end] === "'";
                    if (isSingleQuoted || isDoubleQuoted) {
                        val = val.substring(1, end);
                        if (isDoubleQuoted) {
                            val = val.replace(RE_NEWLINES, NEWLINE);
                        }
                    } else {
                        val = val.trim();
                    }
                    obj[key] = val;
                } else if (debug) {
                    log("did not match key and value when parsing line ".concat(idx + 1, ": ").concat(line));
                }
            });
            return obj;
        };
        var config = function config(options) {
            var dotenvPath = path.resolve(process.cwd(), ".env");
            var encoding = "utf8";
            var debug = false;
            if (options) {
                if (options.path != null) {
                    dotenvPath = options.path;
                }
                if (options.encoding != null) {
                    encoding = options.encoding;
                }
                if (options.debug != null) {
                    debug = true;
                }
            }
            try {
                var parsed = parse(fs.readFileSync(dotenvPath, {
                    encoding: encoding
                }), {
                    debug: debug
                });
                Object.keys(parsed).forEach(function(key) {
                    if (!Object.prototype.hasOwnProperty.call(process.env, key)) {
                        process.env[key] = parsed[key];
                    } else if (debug) {
                        log('"'.concat(key, '" is already defined in `process.env` and will not be overwritten'));
                    }
                });
                return {
                    parsed: parsed
                };
            } catch (e) {
                return {
                    error: e
                };
            }
        };
        var fs = __require("fs");
        var path = __require("path");
        var NEWLINE = "\n";
        var RE_INI_KEY_VAL = /^\s*([\w.-]+)\s*=\s*(.*)?\s*$/;
        var RE_NEWLINES = /\\n/g;
        var NEWLINES_MATCH = /\n|\r|\r\n/;
        module.exports.config = config;
        module.exports.parse = parse;
    }
});
// ../../node_modules/dotenv/lib/env-options.js
var require_env_options = __commonJS({
    "../../node_modules/dotenv/lib/env-options.js": function(exports, module) {
        "use strict";
        var options = {};
        if (process.env.DOTENV_CONFIG_ENCODING != null) {
            options.encoding = process.env.DOTENV_CONFIG_ENCODING;
        }
        if (process.env.DOTENV_CONFIG_PATH != null) {
            options.path = process.env.DOTENV_CONFIG_PATH;
        }
        if (process.env.DOTENV_CONFIG_DEBUG != null) {
            options.debug = process.env.DOTENV_CONFIG_DEBUG;
        }
        module.exports = options;
    }
});
// ../../node_modules/dotenv/lib/cli-options.js
var require_cli_options = __commonJS({
    "../../node_modules/dotenv/lib/cli-options.js": function(exports, module) {
        "use strict";
        var re = /^dotenv_config_(encoding|path|debug)=(.+)$/;
        module.exports = function optionMatcher(args) {
            return args.reduce(function(acc, cur) {
                var matches = cur.match(re);
                if (matches) {
                    acc[matches[1]] = matches[2];
                }
                return acc;
            }, {});
        };
    }
});
// test/wallet-setup/connected.setup.ts
import { defineWalletSetup } from "@synthetixio/synpress";
import { MetaMask, getExtensionId } from "@synthetixio/synpress/playwright";
// ../../node_modules/dotenv/config.js
(function() {
    require_main().config(Object.assign({}, require_env_options(), require_cli_options()(process.argv)));
})();
// test/wallet-setup/connected.setup.ts
var SEED_PHRASE = process.env.SEED_PHRASE;
var PASSWORD = process.env.WALLET_PASSWORD;
var connected_setup_default = defineWalletSetup(PASSWORD, function() {
    var _ref = _async_to_generator(function(context, walletPage) {
        var extensionId, metamask, page;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        getExtensionId(context, "MetaMask")
                    ];
                case 1:
                    extensionId = _state.sent();
                    metamask = new MetaMask(context, walletPage, PASSWORD, extensionId);
                    return [
                        4,
                        metamask.importWallet(SEED_PHRASE)
                    ];
                case 2:
                    _state.sent();
                    return [
                        4,
                        context.newPage()
                    ];
                case 3:
                    page = _state.sent();
                    return [
                        4,
                        page.goto("http://localhost:9999")
                    ];
                case 4:
                    _state.sent();
                    return [
                        4,
                        page.locator("#connectButton").click()
                    ];
                case 5:
                    _state.sent();
                    return [
                        4,
                        metamask.connectToDapp([
                            "Account 1"
                        ])
                    ];
                case 6:
                    _state.sent();
                    return [
                        2
                    ];
            }
        });
    });
    return function(context, walletPage) {
        return _ref.apply(this, arguments);
    };
}());
export { connected_setup_default as default };
