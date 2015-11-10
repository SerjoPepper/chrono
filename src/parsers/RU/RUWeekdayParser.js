/*
  Russian weekday parser.

  Examples:
  - Пн
  - Понедельник
  - Вторник
  - вт.
  - во вторник
  - в среду
 */

var moment = require('moment');
var Parser = require('../parser').Parser;
var ParsedResult = require('../../result').ParsedResult;

var PATTERN = /(\s|^)(?:в\s+)?(пн|понедельник|вт|вторник|ср|сред[ау]|чт|четверг|пт|пятниц[ау]|сб|субб?от[ау]|вс|воскресен[ьи]е)(?=\s+|$|\.|,)/i;

var DAYS = {
  'пн|пон': 1,
  'вт|втор': 2,
  'ср': 3,
  'чт|четв': 4,
  'пт|пятн': 5,
  'сб|суб': 6,
  'вс|воск': 7
};

exports.Parser = function RUWeekdayParser () {

  Parser.apply(this, arguments);

  this.pattern = function() { return PATTERN; };

  this.extract = function(text, ref, match, opt){

    var result = new ParsedResult({
      text: match[0].substr(match[1].length, match[0].length - match[1].length),
      index: match.index + match[1].length,
      ref: ref
    });

    var date = moment(ref);
    for (var k in DAYS) {
      if (new RegExp('^(' + k + ')', 'i').test(match[2])) {
        date.day(DAYS[k]);
      }
    }
    if (date.toDate() <= ref) {
      date.add(1, 'week');
    }

    result.start.assign('day', date.date());
    result.start.assign('month', date.month() + 1);
    result.start.assign('year', date.year());

    result.tags['RUWeekdayParser'] = true;
    return result;

  };

};