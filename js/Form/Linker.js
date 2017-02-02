define(function (require) {
    var NAMESPACE = "Form";
    var FORM_FILE = "form.html";

    var FORM_MODULE = NAMESPACE + "/Entity/";

    return class Linker {
        static parseUrl(hash = null) {
            if (!hash) {
                hash = window.location.hash;
            }
            let parsed = {
                module: null,
                id: null
            };

            let match = hash.match(/^#(.*?)(#(.*))?$/);
            if (match) {
                parsed.module = match[1] ? match[1].trim() : null;
                parsed.id = match[3] ? match[3].trim() : null;
            }

            return parsed;
        }

        static createLink(module, id) {
            return FORM_FILE + "#" + module + (id ? "#" + id : "");
        }

        static get FORM_MODULE() {
            return FORM_MODULE;
        }

        static getUrlParams(url = window.location.search) {
            let parts = url.match(/[?&]([^?&]*)/g);
            let GET = {};

            for (let i in parts) {
                let m = parts[i].split("=");
                GET[decodeURIComponent(m[0].replace(/^[?&]/, ""))] = decodeURIComponent(m[1]);
            }

            return GET;
        }

        static createUrlQuery(params) {
            let query = "?";

            for (let i in params) {
                if (typeof params[i] !== 'undefined') {
                    query += encodeURIComponent(i) + "=" + encodeURIComponent(params[i]);
                    query += "&";
                }
            }

            return query;
        }
    }
});
