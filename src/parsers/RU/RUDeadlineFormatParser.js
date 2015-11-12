/*
  Russian time duration parser

  - через 5 минут
  - через 20мин
  - через 2 часа
  - чере 1час
  - через 2 дня
  - через 21 день
  - через 20 секунд
 */

var moment = require('moment');
var Parser = require('../parser').Parser;
var ParsedResult = require('../../result').ParsedResult;

var INTERVALS = {
  'м': 'minute',
  'ч': 'hour',
  'д': 'day',
  'с': 'second'
}

var PATTERN = /(\s|^)через\s+([0-9\.]+)\s*(минут(?:а|ы)?|мин\.?|час(?:а|ов)?|ч\.?|день|дня|дней|секунд(?:а|ы)?)(?=\s|$|\.|,|;)/i;

exports.Parser = function RUDeadlineFormatParser () {

  Parser.apply(this, arguments);

  this.pattern = function() { return PATTERN; };

  this.extract = function(text, ref, match, opt){

    var result = new ParsedResult({
        text: match[0].substr(match[1].length, match[0].length - match[1].length),
        index: match.index + match[1].length,
        ref: ref
    });

    var duration = parseInt(match[2])
    var interval;
    for (k in INTERVALS) {
      if (match[3].indexOf(k) === 0) {
        interval = INTERVALS[k];
      }
    }

    var date = moment(ref);

    date.add(duration, interval);

    result.start.assign('day', date.date());
    result.start.assign('month', date.month() + 1);
    result.start.assign('year', date.year());
    result.start.assign('hour', date.hour());
    result.start.assign('minute', date.minute());
    result.start.assign('second', date.second());

    result.tags['RUDeadlineFormatParser'] = true;
    return result;
  };

};