/*
  Russian time expression parser.

  Examples:
  - в 11:00
  - в 11.00
  - в 11
  - в 10 вечера

 */

var moment = require('moment');
var Parser = require('../parser').Parser;
var ParsedResult = require('../../result').ParsedResult;

var PATTERN = /(\s|^)в\s+([0-9]{1,2}(?:[\.:][0-9]{1,2})?)\s*(утра|утром|вечера|вечером|дня|днем)?(?=\s+|$|\.|,)/i;

exports.Parser = function RUTimeExpressionParser () {

  Parser.apply(this, arguments);

  this.pattern = function() { return PATTERN; };

  this.extract = function(text, ref, match, opt){
    var result = new ParsedResult({
      text: match[0].substr(match[1].length, match[0].length - match[1].length),
      index: match.index + match[1].length,
      ref: ref
    });

    var time = match[2].split(/[\.:]/).map(Number);
    var hour = time[0];

    var tod = match[3];

    if (tod) {
      if (hour < 12 && /^(дн|вечер)/i.test(tod)) {
        hour += 12;
      }
    }

    result.start.imply('hour', hour);
    if (time[1] !== undefined) {
      result.start.imply('minute', time[1]);
    }

    result.tags['RUTimeExpressionParser'] = true;
    return result;
  };
};
