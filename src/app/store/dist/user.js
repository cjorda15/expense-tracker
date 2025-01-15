"use strict";
exports.__esModule = true;
exports.UserStore = void 0;
var signals_1 = require("@ngrx/signals");
var initialState = { user: null };
exports.UserStore = signals_1.signalStore({ providedIn: 'root' }, signals_1.withState(initialState), signals_1.withMethods(function (store) { return ({
    login: function (user) {
        signals_1.patchState(store, {
            user: user
        });
    },
    clear: function () {
        signals_1.patchState(store, {
            user: null
        });
    }
}); }));
