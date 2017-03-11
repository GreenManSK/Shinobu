var NAMESPACE = "Kirino/Helpers";
define(function (require) {
    /**
     * %n - episode number
     * %e - episode of season
     * %s - season
     * %([n|e|s]+64), %([n|e|s]-12) - add or subtract from number
     * %n_100  - pad %n to have same length as 100 (e.g. %n = 5 then 005)
     * %(e+12)_1000 - pad (e+12) to have same length as 1000 (e.g. %e = 5 then 0017)
     *
     * \% - to write % without risk
     */
    return class SearchGenerator {
        static generate(number, search, typeClass) {
            let text = search;
            let escChr = SearchGenerator._getSafeEscape(text);
            text = text.replace(/\\%/g, escChr);

            text = SearchGenerator._normalize(text);
            text = SearchGenerator._doMagic(number, text, typeClass);

            let regex = new RegExp(escChr, "g");
            return text.replace(regex, "%");
        }

        static _normalize(text) {
            text = text.replace(/%([nes])/g, "%($1+0)");
            text = text.replace(/%\(([nes])\)/g, "%($1+0)");
            text = text.replace(/%\((.*?)\)(?!_1)/g, "%($1)_1");
            return text;
        }

        static _doMagic(number, text, typeClass) {
            let replacer = {
                n: number,
                e: typeClass && typeClass.hasOwnProperty("getEpisode") ? typeClass.getEpisode(number) : number,
                s: typeClass && typeClass.hasOwnProperty("getSeason") ? typeClass.getSeason(number) : number
            };
            return text.replace(/%\(([nes])([+-]\d+)\)_(10*)/g, function (match, type, add, pad) {
                let n = replacer[type];
                n += parseInt(add);
                return SearchGenerator._pad(n, pad.length);
            });
        }

        static _getSafeEscape(text) {
            let e = "-#-";
            while (text.indexOf(e) !== -1) {
                e = "-" + e + "-";
            }
            return e;
        }

        static _pad(value, length) {
            return (value.toString().length < length) ? SearchGenerator._pad("0" + value, length) : value;
        }
    };
});