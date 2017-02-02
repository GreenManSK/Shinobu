define(function (require) {
    var NAMESPACE = "Parsers";

    return class BaseParser {
        static doesUrlMatch(url) {
            console.error(this.constructor.name + " parser need to implement doesUrlMatch(url) method.");
        }

        static getIdFromUrl(url) {
            console.error(this.constructor.name + " parser need to implement getIdFromUrl(url) method.");
        }

        static getUrl(id) {
            console.error(this.constructor.name + " parser need to implement getUrl(id) method.");
        }

        static getData(id) {
            let THIS = this;
            return new Promise((cb) => {
                let url = THIS.getUrl(id);
                let request = new XMLHttpRequest();
                request.responseType = 'text';

                request.addEventListener("load", function (evt) {
                    let response = evt.target.response;
                    if (response)
                        THIS._onLoad(cb, evt, response);
                    else
                        THIS._onError(cb, url);
                });
                request.addEventListener("error", function (evt) {
                    THIS._onError(cb, url);
                });

                request.open('GET', url, true);
                request.send();
            });
        }

        static _onLoad(cb, evt, response) {
            console.error(this.constructor.name + " parser need to implement _onLoad(cb, evt, response) method.");
        }

        static _onError(cb, url) {
            chrome.runtime.sendMessage({
                name: "notification",
                "msg": this.constructor.name + ": Error while parsing " + url,
                type: "error"
            }, null);
        }

        static getForm() {
            console.error(this.constructor.name + " parser need to implement getForm() method.");
        }
    }
});