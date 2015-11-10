/*
  Parse russian month names

  Examples:
  - 10го ноября
  - 2 января
  - на 8 марта
  - 4 июля
 */

var moment = require('moment')
var Parser = require('../parser').Parser;
var ParsedResult = require('../../result').ParsedResult;

var MONTH_OFFSET = {
  'январ': 1,
  'феврал': 2,
  'март': 3,
  'апрел': 4,
  'ма[йея]': 5,
  'июн': 6,
  'июл': 7,
  'август': 8,
  'сентябр': 9,
  'октябр': 10,
  'ноябр': 11,
  'декабр': 12
}

var getMonthOffset = function (substr) {
  for (var k in MONTH_OFFSET) {
    if (new RegExp('^' + k).test(substr)) {
      return MONTH_OFFSET[k];
    }
  }
};

var PATTERN = new RegExp(
  '(\\s|^)' +
  '([0-9]{1,2})?(?:е|го)?\\s*' +
  '(январ\\S?|феврал\\S?|март\\S?|апрел\\S?|ма[йея]|июн\\S?|июл\\S?|август\\S?|сентябр\\S?|октябр\\S?|ноябр\\S?|декабр\\S?)' +
  '(\\s*[0-9]{2,4}\\s*(?:года?|г\\.?)?)?' +
  '(?=\\s|$|\\.|\\,)', 'i'
);

var DATE_GROUP = 2;
var MONTH_NAME_GROUP = 3;
var YEAR_GROUP = 4;

exports.Parser = function RUMonthNameParser(){
    Parser.apply(this, arguments);

    this.pattern = function() { return PATTERN; }

    this.extract = function(text, ref, match, opt){

        var result = new ParsedResult({
            text: match[0].substr(match[1].length, match[0].length - match[1].length),
            index: match.index + match[1].length,
            ref: ref
        });

        var month = match[MONTH_NAME_GROUP];
        month = getMonthOffset(month.toLowerCase());

        var day = match[DATE_GROUP];
        day = parseInt(day || 1);

        var year = null;
        if (match[YEAR_GROUP]) {
            year = match[YEAR_GROUP];
            year = parseInt(year);
            if (year < 100) {
              year += 2000;
            }
        }

        if (year) {
            result.start.assign('day', day);
            result.start.assign('month', month);
            result.start.assign('year', year);
        } else {
            //Find the most appropriated year
            var refMoment = moment(ref);
            refMoment.month(month - 1);
            refMoment.date(day);
            refMoment.year(moment(ref).year());

            if (ref > refMoment.toDate()) {
              refMoment = refMoment.clone().add(1, 'y');
            }

            result.start.assign('day', day);
            result.start.assign('month', month);
            result.start.imply('year', refMoment.year());
        }

        result.tags['RUMonthNameParser'] = true;
        return result;
    };
}
