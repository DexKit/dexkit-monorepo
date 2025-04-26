/// ######## BANNER WITH FIXES START ########
// ---- DYNAMIC_REQUIRE_FS_FIX ----
var require = (await import("node:module")).createRequire(import.meta.url);
var __filename = (await import("node:url")).fileURLToPath(import.meta.url);
var __dirname = (await import("node:path")).dirname(__filename);
// ---- DYNAMIC_REQUIRE_FS_FIX ----
/// ######## BANNER WITH FIXES END ########
var __getOwnPropNames = Object.getOwnPropertyNames;
var __require = /* @__PURE__ */ function(x) {
    return typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
        get: function(a, b) {
            return (typeof require !== "undefined" ? require : a)[b];
        }
    }) : x;
}(function(x) {
    if (typeof require !== "undefined") return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
});
var __commonJS = function(cb, mod) {
    return function __require2() {
        return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = {
            exports: {}
        }).exports, mod), mod.exports;
    };
};
export { __require, __commonJS };
